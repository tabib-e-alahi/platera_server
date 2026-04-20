import axios from "axios";
import { prisma } from "../../lib/prisma";
import {
  BadRequestError,
  NotFoundError,
} from "../../errors/AppError";
import envConfig from "../../config";

const initiatePayment = async (userId: string, orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
  });

  if (!order) throw new NotFoundError("Order not found.");

  if (order.customerId !== userId) {
    throw new BadRequestError("Unauthorized order access.");
  }

  if (order.status !== "PENDING_PAYMENT") {
    throw new BadRequestError("Order is not pending payment.");
  }

  const transactionId = `txn_${Date.now()}`;

  const platformFee = Number(order.totalAmount) * 0.25;
  const providerShare = Number(order.totalAmount) * 0.75;

  const payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      customerId: userId,
      providerId: order.providerId,
      amount: order.totalAmount,
      platformFeeAmount: platformFee,
      providerShareAmount: providerShare,
      transactionId,
      status: "PENDING",
    },
  });

  const payload = {
    store_id: envConfig.SSLCOMMERZ_STORE_ID,
    store_passwd: envConfig.SSLCOMMERZ_STORE_PASSWORD,

    total_amount: order.totalAmount,
    currency: "BDT",
    tran_id: transactionId,

    success_url: envConfig.PAYMENT_SUCCESS_URL,
    fail_url: envConfig.PAYMENT_FAIL_URL,
    cancel_url: envConfig.PAYMENT_CANCEL_URL,
    ipn_url: envConfig.PAYMENT_IPN_URL,

    cus_name: order.customerName,
    cus_email: "test@mail.com",
    cus_phone: order.customerPhone,

    shipping_method: "NO",
    product_name: "Food Order",
    product_category: "Food",
    product_profile: "general",
  };

  const response = await axios.post(
    envConfig.SSLCOMMERZ_API!,
    payload
  );

  return {
    paymentUrl: response.data.GatewayPageURL,
  };
};

const verifyPayment = async (tran_id: string) => {
  const url = `${process.env.SSLCOMMERZ_VALIDATION_API}?val_id=${tran_id}&store_id=${process.env.SSLCOMMERZ_STORE_ID}&store_passwd=${process.env.SSLCOMMERZ_STORE_PASS}`;

  const response = await axios.get(url);

  return response.data;
};

const handleIPN = async (body: any) => {
  const { tran_id, status } = body;

  const payment = await prisma.payment.findUnique({
    where: { transactionId: tran_id },
  });

  if (!payment) throw new NotFoundError("Payment not found.");

  if (status !== "VALID") {
    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    });
    return;
  }

  const order = await prisma.order.findUnique({
    where: { id: payment.orderId },
  });

  await prisma.$transaction(async (tx) => {
    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "SUCCESS",
        paidAt: new Date(),
      },
    });

    await tx.order.update({
      where: { id: order!.id },
      data: {
        status: "PLACED",
        placedAt: new Date(),
      },
    });

    await tx.providerProfile.update({
      where: { id: payment.providerId },
      data: {
        totalGrossRevenue: { increment: payment.amount },
        totalPlatformFee: { increment: payment.platformFeeAmount },
        totalProviderEarning: { increment: payment.providerShareAmount },
        currentPayableAmount: { increment: payment.providerShareAmount },
        lastPaymentAt: new Date(),
      },
    });

    await tx.cart.deleteMany({
      where: { customerId: payment.customerId },
    });
  });
};

export const PaymentService = {
  initiatePayment,
  verifyPayment,
  handleIPN,
}