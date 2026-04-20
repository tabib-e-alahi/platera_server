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