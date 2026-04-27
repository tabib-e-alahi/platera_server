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
import {
  ORDER_STATUS_TRANSITIONS,
  CUSTOMER_CANCELLABLE_STATUSES,
} from "./order.constants";
import { orderEventBus } from "./order.event";
import { getProviderProfile } from "../../helpers/getProviderProfile";
import { sendEmail } from "../../utils/email.utils";
import { buildRefundEmail } from "../../utils/refundEmail";

// ─── Internal helpers

const normalizeCity = (city: string) => city.trim().toUpperCase();

const getCustomerProfileOrThrow = async (userId: string) => {
  const cp = await prisma.customerProfile.findUnique({ where: { userId } });
  if (!cp) throw new ForbiddenError("Please complete your customer profile before checkout.");
  return cp;
};

const getCartOrThrow = async (customerProfileId: string) => {
  const cart = await prisma.cart.findUnique({
    where: { customerId: customerProfileId },
    include: {
      provider: true,
      cartItems: { include: { meal: true }, orderBy: { createdAt: "asc" } },
    },
  });
  if (!cart || cart.cartItems.length === 0) throw new BadRequestError("Your cart is empty.");
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

  if (normalizeCity(customerProfile.city) !== normalizeCity(cart.provider.city)) {
    throw new ForbiddenError(`This provider only serves customers in ${cart.provider.city}.`);
  }

  const validatedItems = cart.cartItems.map((item) => {
    const meal = item.meal;
    if (!meal.isActive || !meal.isAvailable) {
      throw new BadRequestError(`The meal "${meal.name}" is currently unavailable.`);
    }
    const discountInfo = computeDiscount({
      basePrice: Number(meal.basePrice),
      discountPrice: meal.discountPrice !== null && meal.discountPrice !== undefined ? Number(meal.discountPrice) : null,
      discountStartDate: meal.discountStartDate,
      discountEndDate: meal.discountEndDate,
    });
    const unitPrice     = discountInfo.effectivePrice;
    const baseUnitPrice = Number(meal.basePrice);
    const totalPrice    = unitPrice * item.quantity;
    return {
      mealId:          meal.id,
      mealName:        meal.name,
      mealImageUrl:    meal.mainImageURL,
      quantity:        item.quantity,
      baseUnitPrice,
      unitPrice,
      totalPrice,
      mealDeliveryFee: Number(meal.deliveryFee || 0),
    };
  });

  const subtotal       = validatedItems.reduce((s, i) => s + i.totalPrice, 0);
  const discountAmount = validatedItems.reduce((s, i) => s + (i.baseUnitPrice - i.unitPrice) * i.quantity, 0);
  const deliveryFee    = validatedItems.length > 0 ? Math.max(...validatedItems.map((i) => i.mealDeliveryFee)) : 0;
  const totalAmount    = subtotal + deliveryFee;

  return {
    customerProfile,
    cart,
    validatedItems,
    totals: { subtotal, discountAmount, deliveryFee, totalAmount },
    delivery: {
      customerName:          payload.customerName,
      customerPhone:         payload.customerPhone,
      deliveryCity:          customerProfile.city,
      deliveryStreetAddress: payload.deliveryStreetAddress,
      deliveryHouseNumber:   payload.deliveryHouseNumber || null,
      deliveryApartment:     payload.deliveryApartment   || null,
      deliveryPostalCode:    payload.deliveryPostalCode  || null,
      deliveryNote:          payload.deliveryNote        || null,
    },
  };
};

/* ─── Shared helpers ────────────────────────────────────────────────────── */

const generateOrderNumber = () => {
  const now  = new Date();
  const y    = now.getFullYear();
  const m    = String(now.getMonth() + 1).padStart(2, "0");
  const d    = String(now.getDate()).padStart(2, "0");
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `PLT-${y}${m}${d}-${rand}`;
};

/* ─── Service: getCheckoutPreview ───────────────────────────────────────── */

const getCheckoutPreview = async (userId: string, payload: TCheckoutPreviewPayload) => {
  const state = await buildValidatedCheckoutState(userId, payload);
  return {
    provider: { id: state.cart.provider.id, businessName: state.cart.provider.businessName, city: state.cart.provider.city, imageURL: state.cart.provider.imageURL },
    items:    state.validatedItems,
    totals:   state.totals,
    delivery: state.delivery,
  };
};

/* ─── Service: createOrder ──────────────────────────────────────────────── */

const createOrder = async (userId: string, payload: TCreateOrderPayload) => {
  const state = await buildValidatedCheckoutState(userId, payload);

  const existingPending = await prisma.order.findFirst({
    where: { customerId: userId, providerId: state.cart.provider.id, status: "PENDING_PAYMENT" },
    select: { id: true },
  });
  if (existingPending && payload.paymentMethod === "ONLINE") {
    throw new BadRequestError("You already have a pending payment order for this provider.");
  }

  return prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const initialStatus = payload.paymentMethod === "ONLINE" ? "PENDING_PAYMENT" : "PLACED";

    const order = await tx.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerId:  userId,
        providerId:  state.cart.provider.id,
        paymentMethod: payload.paymentMethod,
        status:      initialStatus,
        ...state.delivery,
        subtotal:       state.totals.subtotal,
        deliveryFee:    state.totals.deliveryFee,
        discountAmount: state.totals.discountAmount,
        totalAmount:    state.totals.totalAmount,
        placedAt: payload.paymentMethod === "COD" ? new Date() : null,
      },
    });

    await tx.orderItem.createMany({
      data: state.validatedItems.map((item) => ({
        orderId:     order.id,
        mealId:      item.mealId,
        mealName:    item.mealName,
        mealImageUrl:item.mealImageUrl,
        quantity:    item.quantity,
        unitPrice:   item.unitPrice,
        totalPrice:  item.totalPrice,
      })),
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId: order.id,
        status:  initialStatus,
        note:    payload.paymentMethod === "ONLINE" ? "Order created. Waiting for payment." : "Order placed successfully via Cash on Delivery.",
        changedByUserId: userId,
        changedByRole:   "CUSTOMER",
      },
    });

    if (payload.paymentMethod === "COD") {
      await tx.cart.delete({ where: { id: state.cart.id } });
    }

    return tx.order.findUnique({
      where: { id: order.id },
      include: {
        provider:            { select: { id: true, businessName: true, city: true, imageURL: true } },
        orderItems:          true,
        orderStatusHistories:{ orderBy: { createdAt: "asc" } },
      },
    });
  });
};

/* ─── Service: getMyOrders ──────────────────────────────────────────────── */

const getMyOrders = async (
  userId: string,
  query?: { status?: string; page?: number; limit?: number; search?: string }
) => {
  const page  = Math.max(1, query?.page ?? 1);
  const limit = Math.min(50, Math.max(1, query?.limit ?? 20));
  const skip  = (page - 1) * limit;

  const where: Prisma.OrderWhereInput = {
    customerId: userId,
    ...(query?.status && { status: query.status as any }),
    ...(query?.search && {
      OR: [
        { orderNumber: { contains: query.search, mode: "insensitive" } },
        { orderItems: { some: { mealName: { contains: query.search, mode: "insensitive" } } } },
        { provider: { businessName: { contains: query.search, mode: "insensitive" } } },
      ],
    }),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        provider:   { select: { id: true, businessName: true, city: true, imageURL: true } },
        orderItems: true,
        payments: {
          select: {
            id:            true,
            status:        true,
            amount:        true,
            gatewayName:   true,
            refundedAt:    true,
            paymentGatewayData: true,   // needed to surface refund info on card
          },
          orderBy: { createdAt: "desc" },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders: orders.map((o) => ({ ...o, items: o.orderItems })),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: skip + limit < total, hasPrevPage: page > 1 },
  };
};

/* ─── Service: getMyOrderDetail ─────────────────────────────────────────── */

const getMyOrderDetail = async (userId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, customerId: userId },
    include: {
      provider:            { select: { id: true, businessName: true, city: true, imageURL: true, phone: true } },
      orderItems:          true,
      payments:            true,
      orderStatusHistories:{ orderBy: { createdAt: "asc" } },
    },
  });
  if (!order) throw new NotFoundError("Order not found.");
  return { ...order, items: order.orderItems };
};

/* ─────────────────────────────────────────────────────────────────────────
   Service: cancelMyOrder
   ─────────────────────────────────────────────────────────────────────────
   Refund logic — SANDBOX ONLY (no real SSL refund API call):
   1. Check order is cancellable.
   2. If order was paid online (payment status = SUCCESS):
        a. Generate a sandbox refund reference ID.
        b. In a single DB transaction:
           • Order  → REFUNDED + cancelledAt
           • Payment → REFUNDED + refundedAt + refund info stored in paymentGatewayData
           • ProviderProfile → decrement all revenue fields that were incremented on payment success
           • OrderStatusHistory → record with refund ref
   3. If order was NOT paid (COD or PENDING_PAYMENT with no success):
        • Order → CANCELLED + cancelledAt
        • No payment changes
   4. Emit real-time event.
   5. Send refund email (fire-and-forget).
   6. Return { order, refund } — frontend uses refund to show the correct modal state.
   ───────────────────────────────────────────────────────────────────────── */

const cancelMyOrder = async (userId: string, orderId: string) => {
  // ── 1. Load order + any successful payment + customer email ──────────────
  const order = await prisma.order.findFirst({
    where: { id: orderId, customerId: userId },
    include: {
      // Only grab the most recent SUCCESS payment — that is what we refund
      payments: {
        where:   { status: "SUCCESS" },
        orderBy: { createdAt: "desc" },
        take:    1,
        select: {
          id:                      true,
          amount:                  true,
          providerShareAmount:     true,
          platformFeeAmount:       true,
          paymentGatewayData:      true,
          providerSettlementStatus: true,   // KEY: tells us if admin already paid the provider
        },
      },
      customer: { select: { name: true, email: true } },
    },
  });

  if (!order) throw new NotFoundError("Order not found.");

  // ── 2. Guard: only allowed from PENDING_PAYMENT | PLACED | ACCEPTED ──────
  if (!CUSTOMER_CANCELLABLE_STATUSES.includes(order.status)) {
    const msg =
      order.status === "PREPARING" || order.status === "OUT_FOR_DELIVERY"
        ? "Your order is already being prepared and can no longer be cancelled."
        : order.status === "DELIVERED"
        ? "This order has already been delivered."
        : order.status === "CANCELLED" || order.status === "REFUNDED"
        ? "This order is already cancelled."
        : "This order can no longer be cancelled.";
    throw new BadRequestError(msg);
  }

  // ── 3. Decide: paid online? ───────────────────────────────────────────────
  const successPayment = order.payments[0] ?? null;
  const isOnlinePaid   = order.paymentMethod === "ONLINE" && successPayment !== null;

  // ── 4. Sandbox refund simulation ─────────────────────────────────────────
  //   In sandbox mode we never call the SSL refund API because:
  //     a) It only works on live merchant accounts.
  //     b) You confirmed you will always use sandbox.
  //   We generate a fake reference ID that looks like what the real API returns.
  //   This lets the entire UI flow work identically to production.
  const sandboxRefundRefId = isOnlinePaid
    ? `SANDBOX-REF-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`
    : null;

  const refundAmount = isOnlinePaid ? Number(successPayment.amount) : 0;

  // ── 5. Atomic DB transaction ──────────────────────────────────────────────
  const finalStatus = isOnlinePaid ? ("REFUNDED" as const) : ("CANCELLED" as const);

  const updated = await prisma.$transaction(async (tx) => {
    // a) Update order
    const updatedOrder = await tx.order.update({
      where: { id: orderId },
      data:  { status: finalStatus, cancelledAt: new Date() },
    });

    // b) Build history note
    const historyNote = isOnlinePaid
      ? `Cancelled by customer. Sandbox refund of ৳${refundAmount.toFixed(2)} simulated (Ref: ${sandboxRefundRefId}).`
      : order.paymentMethod === "COD"
      ? "Cancelled by customer. Cash on Delivery — no payment to refund."
      : "Cancelled by customer. Order was unpaid — no charge made.";

    // c) Status history record
    await tx.orderStatusHistory.create({
      data: {
        orderId,
        status:          finalStatus,
        note:            historyNote,
        changedByUserId: userId,
        changedByRole:   "CUSTOMER",
      },
    });

    // d) If paid — update payment record + reverse provider revenue
    if (isOnlinePaid && successPayment) {
      const providerEarning = Number(successPayment.providerShareAmount);
      const platformFee     = Number(successPayment.platformFeeAmount);

      // Mark payment as REFUNDED, store sandbox refund reference inside paymentGatewayData
      await tx.payment.update({
        where: { id: successPayment.id },
        data: {
          status:     "REFUNDED",
          refundedAt: new Date(),
          // We store refund info inside the existing Json column — no schema change needed
          paymentGatewayData: {
            ...(typeof successPayment.paymentGatewayData === "object" && successPayment.paymentGatewayData !== null
              ? (successPayment.paymentGatewayData as object)
              : {}),
            refundSimulated:  true,
            refundRefId:      sandboxRefundRefId,
            refundedAt:       new Date().toISOString(),
            refundAmount:     refundAmount,
            refundRemarks:    `Customer cancelled order #${order.orderNumber}`,
          },
        },
      });

      // Reverse the provider stats that were incremented in finalizeSuccessPayment.
      //
      // SETTLEMENT LOGIC:
      // - If providerSettlementStatus === "PENDING" → the provider has NOT yet
      //   been paid by the admin.  The money still sits with the platform.
      //   Refund comes entirely from the admin/platform side.
      //   We decrement `currentPayableAmount` so the provider is not owed money
      //   that was already refunded.
      //
      // - If providerSettlementStatus === "PAID" → the admin already wired the
      //   money to the provider.  Both admin (platformFee portion) AND provider
      //   (providerShare portion) bear the refund cost.
      //   `currentPayableAmount` is already 0 for this payment so we don't touch it.
      //   (In production you would trigger a clawback flow here.)
      const alreadySettledToProvider = successPayment.providerSettlementStatus === "PAID";

      await tx.providerProfile.update({
        where: { id: order.providerId },
        data: {
          totalGrossRevenue:    { decrement: refundAmount },
          totalProviderEarning: { decrement: providerEarning },
          totalPlatformFee:     { decrement: platformFee },
          totalOrdersCompleted: { decrement: 1 },
          // Only reduce the payable balance when the payment has NOT yet been
          // settled.  If already settled, the funds left the platform and a
          // manual clawback process would be needed (out of scope for sandbox).
          ...(alreadySettledToProvider
            ? {}
            : { currentPayableAmount: { decrement: providerEarning } }),
        },
      });
    }

    return updatedOrder;
  });

  // ── 6. Real-time event ────────────────────────────────────────────────────
  orderEventBus.emitOrderUpdate({
    orderId,
    status:    updated.status,
    message:   isOnlinePaid
      ? `Your order has been cancelled. Refund of ৳${refundAmount.toFixed(2)} has been initiated.`
      : "Your order has been cancelled.",
    updatedAt: updated.updatedAt.toISOString(),
  });

  // ── 7. Refund email (fire-and-forget — never fail the request) ────────────
  const customerEmail = order.customer?.email;
  const customerName  = order.customerName ?? order.customer?.name ?? "Customer";
  if (customerEmail) {
    const emailData = buildRefundEmail({
      customerName,
      orderNumber:   order.orderNumber,
      amount:        Number(order.totalAmount),
      paymentMethod: order.paymentMethod,
      refundRefId:   sandboxRefundRefId,
    });
    sendEmail({ to: customerEmail, ...emailData }).catch((e) =>
      console.error("[cancelMyOrder] Refund email failed:", e?.message)
    );
  }

  // ── 8. Return structured result ───────────────────────────────────────────
  return {
    order:  updated,
    // The refund object is what the frontend modal reads to decide what to show
    refund: isOnlinePaid
      ? {
          attempted:    true as const,
          success:      true as const,
          refundRefId:  sandboxRefundRefId,
          amount:       refundAmount,
          isSandbox:    true,
        }
      : {
          attempted:    false as const,
          reason:
            order.paymentMethod === "COD"
              ? "Cash on Delivery order — no payment to refund."
              : "Order was unpaid — no charge was made.",
        },
  };
};

/* ─── Service: getProviderOrders ────────────────────────────────────────── */

const getProviderOrders = async (
  userId: string,
  query?: { status?: string; page?: number; limit?: number }
) => {
  const provider = await getProviderProfile(userId);
  const page     = Math.max(1, query?.page ?? 1);
  const limit    = Math.min(50, Math.max(1, query?.limit ?? 20));
  const skip     = (page - 1) * limit;

  const where: Prisma.OrderWhereInput = {
    providerId: provider.id,
    status: {
      in: query?.status
        ? ([query.status] as any)
        : ["PLACED", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED", "CANCELLED", "REFUNDED"],
    },
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        customer:   { select: { id: true, name: true, email: true } },
        orderItems: true,
        payments:   { select: { id: true, status: true, amount: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders: orders.map((o) => ({ ...o, items: o.orderItems })),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit), hasNextPage: skip + limit < total, hasPrevPage: page > 1 },
  };
};

/* ─── Service: updateProviderOrderStatus ────────────────────────────────── */

const updateProviderOrderStatus = async (
  userId: string,
  orderId: string,
  payload: TUpdateOrderStatusPayload
) => {
  const provider = await getProviderProfile(userId);
  const order    = await prisma.order.findFirst({ where: { id: orderId, providerId: provider.id } });
  if (!order) throw new NotFoundError("Order not found.");

  const allowedNext = ORDER_STATUS_TRANSITIONS[order.status];
  if (!allowedNext.includes(payload.status)) {
    throw new BadRequestError(`Invalid transition: ${order.status} → ${payload.status}.`);
  }

  const updated = await prisma.$transaction(async (tx) => {
    const next = await tx.order.update({
      where: { id: orderId },
      data: {
        status:      payload.status,
        acceptedAt:  payload.status === "ACCEPTED"  ? new Date() : order.acceptedAt,
        deliveredAt: payload.status === "DELIVERED"  ? new Date() : order.deliveredAt,
        cancelledAt: payload.status === "CANCELLED"  ? new Date() : order.cancelledAt,
      },
    });

    await tx.orderStatusHistory.create({
      data: {
        orderId,
        status:          payload.status,
        note:            payload.note || `Order moved to ${payload.status}`,
        changedByUserId: userId,
        changedByRole:   "PROVIDER",
      },
    });

    // ── COD revenue accounting ─────────────────────────────────────────────
    // Online orders are accounted for in payment.service finalizeSuccessPayment.
    // COD orders are only considered "earned" at delivery time — record the
    // revenue here so provider dashboard stats are always accurate.
    if (payload.status === "DELIVERED" && order.paymentMethod === "COD") {
      const amount = Number(order.totalAmount);
      // Use the same platform fee rate as payment.service (25 %).
      // In production you could read this from a config table or env var.
      const PLATFORM_FEE_RATE = 0.25;
      const platformFeeAmount  = amount * PLATFORM_FEE_RATE;
      const providerShareAmount = amount * (1 - PLATFORM_FEE_RATE);

      // Create a COD payment record so the admin panel has a full audit trail.
      await tx.payment.create({
        data: {
          orderId:          order.id,
          customerId:       order.customerId,
          providerId:       order.providerId,
          amount,
          platformFeeAmount,
          providerShareAmount,
          transactionId:    `COD-${order.orderNumber}`,
          status:           "SUCCESS",
          gatewayName:      "COD",
          paidAt:           new Date(),
        },
      });

      await tx.providerProfile.update({
        where: { id: provider.id },
        data: {
          totalGrossRevenue:    { increment: amount },
          totalProviderEarning: { increment: providerShareAmount },
          totalPlatformFee:     { increment: platformFeeAmount },
          totalOrdersCompleted: { increment: 1 },
          // COD cash is collected by provider directly — do not increment
          // currentPayableAmount since the provider already has the cash.
        },
      });
    }

    return next;
  });

  const statusMessages: Record<string, string> = {
    ACCEPTED:         "Restaurant has accepted your order!",
    PREPARING:        "Your food is being prepared.",
    OUT_FOR_DELIVERY: "Your order is out for delivery!",
    DELIVERED:        "Your order has been delivered. Enjoy!",
    CANCELLED:        "Your order was cancelled by the restaurant.",
  };

  orderEventBus.emitOrderUpdate({
    orderId,
    status:    updated.status,
    message:   payload.note || statusMessages[payload.status] || `Order moved to ${updated.status}`,
    updatedAt: updated.updatedAt.toISOString(),
  });

  return updated;
};

/* ─── Service: getOrderTracking ─────────────────────────────────────────── */

const getOrderTracking = async (userId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, customerId: userId },
    include: {
      provider:            { select: { id: true, businessName: true, city: true, imageURL: true, phone: true } },
      orderItems:          true,
      payments: {
        select: { id: true, status: true, amount: true, gatewayName: true, refundedAt: true, paymentGatewayData: true, createdAt: true },
      },
      orderStatusHistories:{ orderBy: { createdAt: "asc" } },
    },
  });
  if (!order) throw new NotFoundError("Order not found.");
  return { ...order, items: order.orderItems };
};

/* ─── Export ─────────────────────────────────────────────────────────────── */

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