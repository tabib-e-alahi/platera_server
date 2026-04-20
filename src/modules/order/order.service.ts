import { prisma } from "../../lib/prisma";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../errors/AppError";
import {
  TCheckoutPreviewPayload,
  TCreateOrderPayload,
} from "./order.validation";
import { computeDiscount } from "../../utils/discount.util";
import { Prisma } from "../../../generated/prisma/client";

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
      cartItems:{
          include: {
              meal: true,
          },
          orderBy: { createdAt: "asc" },
      }
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
    (sum, item) =>
      sum + (item.baseUnitPrice - item.unitPrice) * item.quantity,
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
    totals: {
      subtotal,
      discountAmount,
      deliveryFee,
      totalAmount,
    },
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
  const rand = Math.random().toString().slice(2, 8);
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
    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId: userId,
        providerId: state.cart.provider.id,
        paymentMethod: payload.paymentMethod,
        status: payload.paymentMethod === "ONLINE" ? "PENDING_PAYMENT" : "PLACED",
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

    if (payload.paymentMethod === "COD") {
      await tx.providerProfile.update({
        where: { id: state.cart.provider.id },
        data: {
          totalOrdersCompleted: {
            increment: 0,
          },
        },
      });

      await tx.cart.delete({
        where: { id: state.cart.id },
      });
    }

    const createdOrder = await tx.order.findUnique({
      where: { id: order.id },
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            city: true,
          },
        },
        orderItems: true,
      },
    });

    return createdOrder;
  });

  return result;
};

const getMyOrders = async (userId: string) => {
  const orders = await prisma.order.findMany({
    where: { customerId: userId },
    include: {
      provider: {
        select: {
          id: true,
          businessName: true,
          city: true,
          imageURL: true,
        },
      },
      orderItems: true,
      payments: {
        select: {
          id: true,
          status: true,
          amount: true,
          gatewayName: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return orders;
};

const getMyOrderDetail = async (userId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      customerId: userId,
    },
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
      orderItems:true,
      payments: true,
    },
  });

  if (!order) {
    throw new NotFoundError("Order not found.");
  }

  return order;
};

export const OrderService = {
  getCheckoutPreview,
  createOrder,
  getMyOrders,
  getMyOrderDetail,
};