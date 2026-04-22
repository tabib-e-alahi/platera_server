import { prisma } from "../../lib/prisma";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../errors/AppError";
import {
  TCheckoutPreviewPayload,
  TCreateOrderPayload,
  TUpdateOrderStatusPayload,
} from "./order.validation";
import { computeDiscount } from "../../utils/discount.util";
import { Prisma } from "../../../generated/prisma/client";
import { ORDER_STATUS_TRANSITIONS, CUSTOMER_CANCELLABLE_STATUSES } from "./order.constants";
import { orderEventBus } from "./order.event";
import { getProviderProfile } from "../../helpers/getProviderProfile";

/* ─── Internal helpers ──────────────────────────────────────────────────── */

const normalizeCity = (city: string) => city.trim().toUpperCase();

const getCustomerProfileOrThrow = async (userId: string) => {
  const customerProfile = await prisma.customerProfile.findUnique({
    where: { userId },
  });

  if (!customerProfile) {
    throw new ForbiddenError(
      "Please complete your customer profile before checkout."
    );
  }

  return customerProfile;
};

const getCartOrThrow = async (customerProfileId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { customerId: customerProfileId },
    include: {
      provider: true,
      cartItems: {
        include: { meal: true },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!cart || cart.cartItems.length === 0) {
    throw new BadRequestError("Your cart is empty.");
  }

  return cart;
};

const buildValidatedCheckoutState = async (
  userId: string,
  payload: TCheckoutPreviewPayload | TCreateOrderPayload
) => {
  const customerProfile = await getCustomerProfileOrThrow(userId);
  const cart = await getCartOrThrow(customerProfile.id);

  if (!cart.provider.isActive || cart.provider.approvalStatus !== "APPROVED") {
    throw new BadRequestError("This provider is not available for checkout.");
  }

  const customerCity = normalizeCity(customerProfile.city);
  const providerCity = normalizeCity(cart.provider.city);

  if (customerCity !== providerCity) {
    throw new ForbiddenError(
      `This provider only serves customers in ${cart.provider.city}.`
    );
  }

  const validatedItems = cart.cartItems.map((item) => {
    const meal = item.meal;

    if (!meal.isActive || !meal.isAvailable) {
      throw new BadRequestError(
        `The meal "${meal.name}" is currently unavailable.`
      );
    }

    const discountInfo = computeDiscount({
      basePrice: Number(meal.basePrice),
      discountPrice:
        meal.discountPrice !== null && meal.discountPrice !== undefined
          ? Number(meal.discountPrice)
          : null,
      discountStartDate: meal.discountStartDate,
      discountEndDate: meal.discountEndDate,
    });

    const unitPrice = discountInfo.effectivePrice;
    const baseUnitPrice = Number(meal.basePrice);
    const totalPrice = unitPrice * item.quantity;

    return {
      mealId: meal.id,
      mealName: meal.name,
      mealImageUrl: meal.mainImageURL,
      quantity: item.quantity,
      baseUnitPrice,
      unitPrice,
      totalPrice,
      mealDeliveryFee: Number(meal.deliveryFee || 0),
    };
  });

  const subtotal = validatedItems.reduce((sum, item) => sum + item.totalPrice, 0);
  const discountAmount = validatedItems.reduce(
    (sum, item) => sum + (item.baseUnitPrice - item.unitPrice) * item.quantity,
    0
  );
  const deliveryFee =
    validatedItems.length > 0
      ? Math.max(...validatedItems.map((item) => item.mealDeliveryFee))
      : 0;
  const totalAmount = subtotal + deliveryFee;

  return {
    customerProfile,
    cart,
    validatedItems,
    totals: { subtotal, discountAmount, deliveryFee, totalAmount },
    delivery: {
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      deliveryCity: customerProfile.city,
      deliveryStreetAddress: payload.deliveryStreetAddress,
      deliveryHouseNumber: payload.deliveryHouseNumber || null,
      deliveryApartment: payload.deliveryApartment || null,
      deliveryPostalCode: payload.deliveryPostalCode || null,
      deliveryNote: payload.deliveryNote || null,
    },
  };
};

/* ─── Service functions ─────────────────────────────────────────────────── */

const getCheckoutPreview = async (
  userId: string,
  payload: TCheckoutPreviewPayload
) => {
  const state = await buildValidatedCheckoutState(userId, payload);

  return {
    provider: {
      id: state.cart.provider.id,
      businessName: state.cart.provider.businessName,
      city: state.cart.provider.city,
      imageURL: state.cart.provider.imageURL,
    },
    items: state.validatedItems,
    totals: state.totals,
    delivery: state.delivery,
  };
};

const generateOrderNumber = () => {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, "0");
  const d = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `PLT-${y}${m}${d}-${rand}`;
};

const createOrder = async (userId: string, payload: TCreateOrderPayload) => {
  const state = await buildValidatedCheckoutState(userId, payload);

  const existingPendingOrder = await prisma.order.findFirst({
    where: {
      customerId: userId,
      providerId: state.cart.provider.id,
      status: "PENDING_PAYMENT",
    },
    select: { id: true },
  });

  if (existingPendingOrder && payload.paymentMethod === "ONLINE") {
    throw new BadRequestError(
      "You already have a pending payment order for this provider."
    );
  }

  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const initialStatus =
      payload.paymentMethod === "ONLINE" ? "PENDING_PAYMENT" : "PLACED";

    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: userId,
        providerId: state.cart.provider.id,
        paymentMethod: payload.paymentMethod,
        status: initialStatus,
        customerName: state.delivery.customerName,
        customerPhone: state.delivery.customerPhone,
        deliveryCity: state.delivery.deliveryCity,
        deliveryStreetAddress: state.delivery.deliveryStreetAddress,
        deliveryHouseNumber: state.delivery.deliveryHouseNumber,
        deliveryApartment: state.delivery.deliveryApartment,
        deliveryPostalCode: state.delivery.deliveryPostalCode,
        deliveryNote: state.delivery.deliveryNote,
        subtotal: state.totals.subtotal,
        deliveryFee: state.totals.deliveryFee,
        discountAmount: state.totals.discountAmount,
        totalAmount: state.totals.totalAmount,
        placedAt: payload.paymentMethod === "COD" ? new Date() : null,
      },
    });

    if (state.validatedItems.length > 0) {
      await tx.orderItem.createMany({
        data: state.validatedItems.map((item) => ({
          orderId: order.id,
          mealId: item.mealId,
          mealName: item.mealName,
          mealImageUrl: item.mealImageUrl,
          quantity: item.quantity,
          unitPrice: item.unitPrice,
          totalPrice: item.totalPrice,
        })),
      });
    }

    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status: initialStatus,
        note:
          payload.paymentMethod === "ONLINE"
            ? "Order created. Waiting for payment."
            : "Order placed successfully via Cash on Delivery.",
        changedByUserId: userId,
        changedByRole: "CUSTOMER",
      },
    });

    if (payload.paymentMethod === "COD") {
      await tx.cart.delete({ where: { id: state.cart.id } });
    }

    return tx.order.findUnique({
      where: { id: order.id },
      include: {
        provider: {
          select: { id: true, businessName: true, city: true, imageURL: true },
        },
        orderItems: true,
        orderStatusHistories: { orderBy: { createdAt: "asc" } },
      },
    });
  });

  return result;
};

const getMyOrders = async (
  userId: string,
  query?: {
    status?: string;
    page?: number;
    limit?: number;
    search?: string;
  }
) => {
  const page = Math.max(1, query?.page ?? 1);
  const limit = Math.min(50, Math.max(1, query?.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: Prisma.OrderWhereInput = {
    customerId: userId,
    ...(query?.status && { status: query.status as any }),
    ...(query?.search && {
      OR: [
        { orderNumber: { contains: query.search, mode: "insensitive" } },
        {
          orderItems: {
            some: {
              mealName: { contains: query.search, mode: "insensitive" },
            },
          },
        },
        {
          provider: {
            businessName: { contains: query.search, mode: "insensitive" },
          },
        },
      ],
    }),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        provider: {
          select: { id: true, businessName: true, city: true, imageURL: true },
        },
        orderItems: true,
        payments: {
          select: { id: true, status: true, amount: true, gatewayName: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders: orders.map((order) => ({ ...order, items: order.orderItems })),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: skip + limit < total,
      hasPrevPage: page > 1,
    },
  };
};

const getMyOrderDetail = async (userId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, customerId: userId },
    include: {
      provider: {
        select: {
          id: true,
          businessName: true,
          city: true,
          imageURL: true,
          phone: true,
        },
      },
      orderItems: true,
      payments: true,
      orderStatusHistories: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!order) throw new NotFoundError("Order not found.");

  return { ...order, items: order.orderItems };
};

/**
 * Cancel an order — customer may cancel if status is:
 *   PENDING_PAYMENT | PLACED | ACCEPTED
 * Once PREPARING or beyond, cancellation is not allowed.
 */
const cancelMyOrder = async (userId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, customerId: userId },
  });

  if (!order) throw new NotFoundError("Order not found.");

  if (!CUSTOMER_CANCELLABLE_STATUSES.includes(order.status)) {
    throw new BadRequestError(
      order.status === "PREPARING" || order.status === "OUT_FOR_DELIVERY"
        ? "Your order is already being prepared and can no longer be cancelled."
        : order.status === "DELIVERED"
        ? "This order has already been delivered."
        : order.status === "CANCELLED"
        ? "This order is already cancelled."
        : "This order can no longer be cancelled."
    );
  }

  const updated = await prisma.$transaction(async (tx) => {
    const next = await tx.order.update({
      where: { id: orderId },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
      },
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId,
        status: "CANCELLED",
        note: "Cancelled by customer.",
        changedByUserId: userId,
        changedByRole: "CUSTOMER",
      },
    });

    return next;
  });

  orderEventBus.emitOrderUpdate({
    orderId,
    status: updated.status,
    message: "Your order has been cancelled.",
    updatedAt: updated.updatedAt.toISOString(),
  });

  return updated;
};

const getProviderOrders = async (
  userId: string,
  query?: { status?: string; page?: number; limit?: number }
) => {
  const provider = await getProviderProfile(userId);
console.log(provider);
  const page = Math.max(1, query?.page ?? 1);
  const limit = Math.min(50, Math.max(1, query?.limit ?? 20));
  const skip = (page - 1) * limit;

  const where: Prisma.OrderWhereInput = {
    providerId: provider.id,
    status: {
      in: query?.status
        ? ([query.status] as any)
        : ["PLACED", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED"],
    },
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        customer: { select: { id: true, name: true, email: true } },
        orderItems: true,
        payments: {
          select: { id: true, status: true, amount: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders: orders.map((order) => ({ ...order, items: order.orderItems })),
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: skip + limit < total,
      hasPrevPage: page > 1,
    },
  };
};

const updateProviderOrderStatus = async (
  userId: string,
  orderId: string,
  payload: TUpdateOrderStatusPayload
) => {
  const provider = await getProviderProfile(userId);

  const order = await prisma.order.findFirst({
    where: { id: orderId, providerId: provider.id },
  });

  if (!order) throw new NotFoundError("Order not found.");

  const allowedNext = ORDER_STATUS_TRANSITIONS[order.status];
  if (!allowedNext.includes(payload.status)) {
    throw new BadRequestError(
      `Invalid transition: ${order.status} → ${payload.status}.`
    );
  }

  const updated = await prisma.$transaction(async (tx) => {
    const next = await tx.order.update({
      where: { id: orderId },
      data: {
        status: payload.status,
        acceptedAt: payload.status === "ACCEPTED" ? new Date() : order.acceptedAt,
        deliveredAt: payload.status === "DELIVERED" ? new Date() : order.deliveredAt,
        cancelledAt: payload.status === "CANCELLED" ? new Date() : order.cancelledAt,
      },
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId,
        status: payload.status,
        note: payload.note || `Order moved to ${payload.status}`,
        changedByUserId: userId,
        changedByRole: "PROVIDER",
      },
    });

    return next;
  });

  const statusMessages: Record<string, string> = {
    ACCEPTED: "Restaurant has accepted your order!",
    PREPARING: "Your food is being prepared.",
    OUT_FOR_DELIVERY: "Your order is out for delivery!",
    DELIVERED: "Your order has been delivered. Enjoy!",
    CANCELLED: "Your order was cancelled by the restaurant.",
  };

  orderEventBus.emitOrderUpdate({
    orderId,
    status: updated.status,
    message:
      payload.note ||
      statusMessages[payload.status] ||
      `Order moved to ${updated.status}`,
    updatedAt: updated.updatedAt.toISOString(),
  });

  return updated;
};

const getOrderTracking = async (userId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, customerId: userId },
    include: {
      provider: {
        select: {
          id: true,
          businessName: true,
          city: true,
          imageURL: true,
          phone: true,
        },
      },
      orderItems: true,
      payments: {
        select: {
          id: true,
          status: true,
          amount: true,
          gatewayName: true,
          createdAt: true,
        },
      },
      orderStatusHistories: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!order) throw new NotFoundError("Order not found.");

  return { ...order, items: order.orderItems };
};

export const OrderService = {
  getCheckoutPreview,
  createOrder,
  getMyOrders,
  getMyOrderDetail,
  cancelMyOrder,
  getProviderOrders,
  updateProviderOrderStatus,
  getOrderTracking,
};