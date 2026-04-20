// src/modules/payment/payment.service.ts

import { prisma } from "../../lib/prisma";
import {
  BadRequestError,
  ForbiddenError,
  InternalError,
  NotFoundError,
} from "../../errors/AppError";
import { initSSLSession, validateSSLPayment } from "../../utils/sslcommerz";
import envConfig from "../../config/index";
import { Prisma } from "../../../generated/prisma/client";

// Platform takes 25%, provider gets 75%
const PLATFORM_FEE_PERCENT = 25;

// ─── Helper: generate a unique transaction ID ─────────────────────────────────

const generateTransactionId = (orderId: string): string => {
  const short = orderId.replace(/-/g, "").slice(0, 12).toUpperCase();
  const rand  = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `PLT-${short}-${rand}`;
};

// ─── 1. Initiate SSLCommerz payment session ───────────────────────────────────

const initiateSSLPayment = async (userId: string, orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      customer: {
        select: {
          id: true, name: true, email: true, phone: true,
        },
      },
      provider: {
        select: {
          id: true, businessName: true, city: true,
        },
      },
    },
  });

  if (!order) {
    throw new NotFoundError("Order not found.");
  }

  if (order.customerId !== userId) {
    throw new ForbiddenError("You do not have access to this order.");
  }

  if (order.paymentMethod !== "ONLINE") {
    throw new BadRequestError("This order does not require online payment.");
  }

  if (order.status !== "PENDING_PAYMENT") {
    throw new BadRequestError(
      "This order is not awaiting payment. It may have already been paid or cancelled."
    );
  }

  const amount     = Number(order.totalAmount);
  const platformFeeAmount  = Math.round(amount * PLATFORM_FEE_PERCENT) / 100;
  const providerShareAmount = amount - platformFeeAmount;
  const transactionId = generateTransactionId(orderId);

  // create or reuse payment record
  const existingPayment = await prisma.payment.findFirst({
    where: {
      orderId,
      status: { in: ["PENDING", "FAILED"] },
    },
    orderBy: { createdAt: "desc" },
  });

  let paymentRecord;

  if (existingPayment) {
    // reuse and refresh transaction ID
    paymentRecord = await prisma.payment.update({
      where: { id: existingPayment.id },
      data: {
        transactionId,
        status: "PENDING",
        paymentGatewayData: Prisma.DbNull,
        failedAt: null,
      },
    });
  } else {
    paymentRecord = await prisma.payment.create({
      data: {
        orderId,
        customerId: userId,
        providerId: order.providerId,
        amount,
        platformFeePercent: PLATFORM_FEE_PERCENT,
        platformFeeAmount,
        providerShareAmount,
        transactionId,
        gatewayName: "SSLCommerz",
        status: "PENDING",
      },
    });
  }

  // build SSLCommerz payload
  const sslPayload = {
    total_amount:     amount,
    currency:         "BDT",
    tran_id:          transactionId,
    success_url:      envConfig.SSLCOMMERZ_SUCCESS_URL,
    fail_url:         envConfig.SSLCOMMERZ_FAIL_URL,
    cancel_url:       envConfig.SSLCOMMERZ_CANCEL_URL,
    ipn_url:          envConfig.SSLCOMMERZ_IPN_URL,
    cus_name:         order.customerName ?? order.customer.name,
    cus_email:        order.customer.email,
    cus_phone:        order.customerPhone ?? order.customer.phone ?? "N/A",
    cus_add1:         order.deliveryStreetAddress ?? "N/A",
    cus_city:         order.deliveryCity,
    cus_country:      "Bangladesh",
    product_name:     `Order ${order.orderNumber}`,
    product_category: "Food",
    product_profile:  "general",
  };

  const sslResponse = await initSSLSession(sslPayload);

  if (sslResponse.status !== "SUCCESS" || !sslResponse.GatewayPageURL) {
    await prisma.payment.update({
      where: { id: paymentRecord.id },
      data: { status: "FAILED", failedAt: new Date() },
    });
    throw new InternalError(
      sslResponse.failedreason ?? "Failed to initiate payment gateway."
    );
  }

  return {
    gatewayURL:    sslResponse.GatewayPageURL,
    transactionId: paymentRecord.transactionId,
    paymentId:     paymentRecord.id,
    amount,
  };
};

// ─── 2. Handle IPN (Instant Payment Notification from SSLCommerz) ────────────
// SSLCommerz POSTs to this URL after every transaction event
// This is the ground truth — do NOT trust the frontend callback

const handleIPNNotification = async (body: Record<string, any>) => {
  const {
    tran_id,
    val_id,
    status,        // VALID | INVALID_TRANSACTION | FAILED | CANCELLED | UNATTEMPTED | EXPIRED
    amount,
    currency,
    store_amount,
  } = body;

  if (!tran_id) {
    throw new BadRequestError("Missing transaction ID in IPN.");
  }

  // Find the payment record
  const payment = await prisma.payment.findUnique({
    where: { transactionId: tran_id },
    include: {
      order: true,
      provider: {
        select: {
          id: true,
          currentPayableAmount: true,
          totalGrossRevenue: true,
          totalPlatformFee: true,
          totalProviderEarning: true,
          totalOrdersCompleted: true,
        },
      },
    },
  });

  if (!payment) {
    // SSLCommerz may retry — do not throw, just return silently
    return { received: true, message: "Transaction not found. Ignored." };
  }

  // Already processed — idempotent
  if (payment.status === "SUCCESS") {
    return { received: true, message: "Already processed." };
  }

  // VALID = successful payment confirmed by SSLCommerz
  if (status === "VALID") {
    // Validate with SSLCommerz server (second layer of security)
    if (val_id) {
      const validation = await validateSSLPayment(val_id);
      if (
        validation.status !== "VALID" ||
        validation.tran_id !== tran_id
      ) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: "FAILED",
            failedAt: new Date(),
            paymentGatewayData: body as Prisma.InputJsonValue,
          },
        });
        return { received: true, message: "Validation failed." };
      }
    }

    const paidAmount    = Number(payment.amount);
    const platformFee   = Number(payment.platformFeeAmount);
    const providerShare = Number(payment.providerShareAmount);

    // Atomic transaction — update payment, order, provider stats
    await prisma.$transaction(async (tx) => {

      // 1. Mark payment as success
      await tx.payment.update({
        where: { id: payment.id },
        data: {
          status:  "SUCCESS",
          paidAt:  new Date(),
          paymentGatewayData: body as Prisma.InputJsonValue,
        },
      });

      // 2. Move order from PENDING_PAYMENT → PLACED
      await tx.order.update({
        where: { id: payment.orderId },
        data: {
          status:   "PLACED",
          placedAt: new Date(),
        },
      });

      // 3. Update provider financial summary
      await tx.providerProfile.update({
        where: { id: payment.providerId },
        data: {
          totalGrossRevenue:    { increment: paidAmount    },
          totalPlatformFee:     { increment: platformFee   },
          totalProviderEarning: { increment: providerShare },
          // currentPayableAmount is what admin owes the provider
          currentPayableAmount: { increment: providerShare },
          totalOrdersCompleted: { increment: 1             },
        },
      });

      // 4. Clear the customer's cart
      const cart = await tx.cart.findFirst({
        where: {
          customer: { userId: payment.customerId },
        },
        select: { id: true },
      });

      if (cart) {
        await tx.cart.delete({ where: { id: cart.id } });
      }
    });

    return { received: true, message: "Payment confirmed." };
  }

  // FAILED / CANCELLED / EXPIRED
  if (["FAILED", "CANCELLED", "UNATTEMPTED", "EXPIRED"].includes(status)) {
    const newStatus =
      status === "CANCELLED" ? "CANCELLED" : "FAILED";

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status:   newStatus,
        failedAt: new Date(),
        paymentGatewayData: body as Prisma.InputJsonValue,
      },
    });

    return { received: true, message: `Payment ${status.toLowerCase()}.` };
  }

  return { received: true, message: "Unhandled IPN status." };
};

// ─── 3. Get payment status for an order ──────────────────────────────────────

const getPaymentStatus = async (userId: string, orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      payments: {
        orderBy: { createdAt: "desc" },
        take: 1,
      },
    },
  });

  if (!order) throw new NotFoundError("Order not found.");
  if (order.customerId !== userId) {
    throw new ForbiddenError("Access denied.");
  }

  const payment = order.payments[0] ?? null;

  return {
    orderId:     order.id,
    orderNumber: order.orderNumber,
    orderStatus: order.status,
    payment: payment
      ? {
          id:            payment.id,
          status:        payment.status,
          amount:        Number(payment.amount),
          transactionId: payment.transactionId,
          paidAt:        payment.paidAt,
        }
      : null,
  };
};

// ─── 4. Admin: list all payments with settlement info ─────────────────────────

const getPaymentsForAdmin = async (filters: {
  settlementStatus?: string;
  providerId?: string;
  page: number;
  limit: number;
}) => {
  const { settlementStatus, providerId, page, limit } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.PaymentWhereInput = {
    status: "SUCCESS",
    ...(settlementStatus && {
      providerSettlementStatus: settlementStatus as any,
    }),
    ...(providerId && { providerId }),
  };

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      include: {
        order: {
          select: {
            id: true, orderNumber: true, status: true,
          },
        },
        provider: {
          select: {
            id: true, businessName: true, city: true,
          },
        },
        customer: {
          select: { id: true, name: true, email: true },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.payment.count({ where }),
  ]);

  return {
    payments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ─── 5. Admin: settle a single payment to provider ───────────────────────────

const settleProviderPayment = async (
  adminId: string,
  paymentId: string,
  note?: string
) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      provider: {
        select: {
          id: true,
          currentPayableAmount: true,
        },
      },
    },
  });

  if (!payment) throw new NotFoundError("Payment not found.");

  if (payment.status !== "SUCCESS") {
    throw new BadRequestError("Only successful payments can be settled.");
  }

  if (payment.providerSettlementStatus === "PAID") {
    throw new BadRequestError("This payment has already been settled.");
  }

  const providerShare = Number(payment.providerShareAmount);

  await prisma.$transaction(async (tx) => {
    // 1. Mark payment as settled
    await tx.payment.update({
      where: { id: paymentId },
      data: {
        providerSettlementStatus: "PAID",
        providerSettledAt:        new Date(),
        providerSettledBy:        adminId,
        providerSettlementNote:   note ?? null,
      },
    });

    // 2. Reduce provider's payable balance
    await tx.providerProfile.update({
      where: { id: payment.providerId },
      data: {
        currentPayableAmount: {
          decrement: providerShare,
        },
        lastPaymentAt: new Date(),
      },
    });
  });

  return prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      order: { select: { id: true, orderNumber: true } },
      provider: { select: { id: true, businessName: true } },
    },
  });
};

// ─── 6. Admin: bulk settle all pending for a provider ────────────────────────

const bulkSettleProvider = async (
  adminId: string,
  providerId: string,
  note?: string
) => {
  const pendingPayments = await prisma.payment.findMany({
    where: {
      providerId,
      status: "SUCCESS",
      providerSettlementStatus: "PENDING",
    },
    select: {
      id: true,
      providerShareAmount: true,
    },
  });

  if (pendingPayments.length === 0) {
    throw new BadRequestError("No pending settlements for this provider.");
  }

  const totalSettled = pendingPayments.reduce(
    (sum, p) => sum + Number(p.providerShareAmount),
    0
  );

  await prisma.$transaction(async (tx) => {
    await tx.payment.updateMany({
      where: {
        id: { in: pendingPayments.map((p) => p.id) },
      },
      data: {
        providerSettlementStatus: "PAID",
        providerSettledAt:        new Date(),
        providerSettledBy:        adminId,
        providerSettlementNote:   note ?? "Bulk settlement",
      },
    });

    await tx.providerProfile.update({
      where: { id: providerId },
      data: {
        currentPayableAmount: { decrement: totalSettled },
        lastPaymentAt: new Date(),
      },
    });
  });

  return {
    settledCount:  pendingPayments.length,
    totalSettled,
  };
};

export const PaymentService = {
  initiateSSLPayment,
  handleIPNNotification,
  getPaymentStatus,
  getPaymentsForAdmin,
  settleProviderPayment,
  bulkSettleProvider,
};