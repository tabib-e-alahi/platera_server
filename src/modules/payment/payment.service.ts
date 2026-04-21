import status from "http-status";
import envConfig from "../../config";
import { AppError } from "../../errors/AppError";
import axios from "axios";
import { prisma } from "../../lib/prisma";
import { randomUUID } from "crypto";

const backendBaseUrl = envConfig.BACKEND_LOCAL_HOST;
const frontendBaseUrl = envConfig.NODE_ENV === 'production' ? envConfig.frontend_production_host : envConfig.frontend_local_host;



const validateSSLPayment = async (val_id: string) => {
  const store_id = envConfig.SSLCOMMERZ_STORE_ID;
  const store_passwd = envConfig.SSLCOMMERZ_STORE_PASSWORD;

  if (!store_id || !store_passwd) {
    throw new AppError(
      "SSLCommerz credentials are missing.",
      status.INTERNAL_SERVER_ERROR,
    );
  }

  const validationURL = `https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php?val_id=${val_id}&store_id=${store_id}&store_passwd=${store_passwd}&v=1&format=json`;

  const response = await axios.get(validationURL);

  return response.data;
};

const finalizeSuccessPayment = async (payment: any, validation: any) => {
  if (payment.status === "SUCCESS") return;

  const amount = Number(payment.amount);
  const platformFeeAmount = amount * 0.25;
  const providerShareAmount = amount * 0.75;

  await prisma.$transaction(async (tx) => {
    const paymentRecord = await tx.payment.findUnique({
      where: { id: payment.id },
    });

    if (!paymentRecord) {
      throw new AppError("Payment not found.", status.NOT_FOUND);
    }

    if (paymentRecord.status === "SUCCESS") return;

    await tx.payment.update({
      where: { id: payment.id },
      data: {
        status: "SUCCESS",
        paidAt: new Date(),
        paymentGatewayData: validation,
        platformFeeAmount,
        providerShareAmount,
      },
    });

    const order = await tx.order.findUnique({
      where: { id: payment.orderId },
      include: {
        orderItems: true,
      },
    });

    if (!order) {
      throw new AppError("Order not found.", status.NOT_FOUND);
    }

    await tx.order.update({
      where: { id: order.id },
      data: {
        status: "PLACED",
        placedAt: new Date(),
      },
    });

    // clear cart after successful online payment
    const customerProfile = await tx.customerProfile.findUnique({
      where: { userId: order.customerId },
    });

    if (customerProfile) {
      const cart = await tx.cart.findUnique({
        where: { customerId: customerProfile.id },
      });

      if (cart) {
        await tx.cart.delete({
          where: { id: cart.id },
        });
      }
    }

    // provider revenue update
    await tx.providerProfile.update({
      where: {
        id: order.providerId,
      },
      data: {
        currentPayableAmount: {
          increment: providerShareAmount,
        },
        totalGrossRevenue: {
          increment: amount,
        },
        totalProviderEarning: {
          increment: providerShareAmount,
        },
        totalPlatformFee: {
          increment: platformFeeAmount,
        },
        totalOrdersCompleted: {
          increment: 1,
        },
      },
    });
  });
};

const initiateSSLPayment = async (userId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      customerId: userId,
    },
    include: {
      orderItems: true,
      payments: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
      customer: true,
    },
  });

  if (!order) {
    throw new AppError("Order not found.", status.NOT_FOUND);
  }

  if (order.paymentMethod !== "ONLINE") {
    throw new AppError(
      "This order is not an online payment order.",
      status.BAD_REQUEST
    );
  }

  if (order.status === "PLACED") {
    throw new AppError(
      "This order is already paid and placed.",
      status.BAD_REQUEST,
    );
  }

  const latestPayment = order.payments?.[0];

  if (latestPayment?.status === "SUCCESS") {
    throw new AppError(
      "Payment already completed for this order.",
      status.BAD_REQUEST,
    );
  }


  const store_id = envConfig.SSLCOMMERZ_STORE_ID;
  const store_passwd = envConfig.SSLCOMMERZ_STORE_PASSWORD;

  if (!store_id || !store_passwd) {
    throw new AppError(
      "SSLCommerz credentials are missing.",
      status.INTERNAL_SERVER_ERROR
    );
  }

  const amount = Number(order.totalAmount);
  const platformFeeAmount = amount * 0.25;
  const providerShareAmount = amount * 0.75;

  const transactionId = `PLATERA_${randomUUID()}`;

  let payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      customerId: order.customerId,
      providerId: order.providerId,
      amount,
      platformFeeAmount,
      providerShareAmount,
      transactionId,
      status: "PENDING",
      gatewayName: "SSLCommerz",
    },
  });

  const sslPayload = {
    store_id,
    store_passwd,
    total_amount: Number(order.totalAmount),
    currency: "BDT",
    tran_id: transactionId,

    success_url: `${backendBaseUrl}/api/v1/payments/sslcommerz/success`,
    fail_url: `${backendBaseUrl}/api/v1/payments/sslcommerz/fail`,
    cancel_url: `${backendBaseUrl}/api/v1/payments/sslcommerz/cancel`,
    ipn_url:
      envConfig.SSLCOMMERZ_IPN_URL ||
      `${backendBaseUrl}/api/v1/payments/sslcommerz/ipn`,

    shipping_method: "NO",
    product_name: `Order-${order.id}`,
    product_category: "Food",
    product_profile: "general",

    cus_name:
      order.customerName ||
      order.customer?.name ||
      order.customer?.email ||
      "Customer",
    cus_email: order.customer?.email || "customer@example.com",
    cus_add1: `${order.deliveryStreetAddress || ""} ${order.deliveryHouseNumber || ""}`.trim() || "Dhaka",
    cus_city: order.deliveryCity || "Dhaka",
    cus_postcode: order.deliveryPostalCode || "1200",
    cus_country: "Bangladesh",
    cus_phone: order.customerPhone || "01700000000",

    ship_name:
      order.customerName ||
      order.customer?.name ||
      order.customer?.email ||
      "Customer",
    ship_add1: `${order.deliveryStreetAddress || ""} ${order.deliveryHouseNumber || ""}`.trim() || "Dhaka",
    ship_city: order.deliveryCity || "Dhaka",
    ship_postcode: order.deliveryPostalCode || "1200",
    ship_country: "Bangladesh",

    value_a: order.id,
    value_b: userId,
    value_c: "Platera",
    value_d: frontendBaseUrl,
  };

  try {
    const sslResponse = await axios.post(
      "https://sandbox.sslcommerz.com/gwprocess/v4/api.php",
      sslPayload,
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const responseData = sslResponse.data;

    if (!responseData || responseData.status !== "SUCCESS") {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: "FAILED",
          paymentGatewayData: responseData,
        },
      });

      throw new AppError(
        responseData?.failedreason || "Failed to initiate SSLCommerz payment.",
        status.BAD_REQUEST
      );
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        paymentGatewayData: responseData,
      },
    });

    return {
      success: true,
      message: "Payment session initiated successfully.",
      data: {
        gatewayURL: responseData.GatewayPageURL,
        paymentId: payment.id,
        transactionId,
        orderId: order.id,
      },
    };
  } catch (error: any) {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
        paymentGatewayData: {
          error: error?.response?.data || error?.message || "Unknown error",
        },
      },
    });

    throw new AppError(
      error?.response?.data?.failedreason ||
        error?.message ||
        "Failed to initiate payment.",
      status.BAD_REQUEST
    );
  }
};

const handleSuccess = async (payload: any) => {
  const { tran_id, val_id, amount } = payload;

  const payment = await prisma.payment.findUnique({
    where: { transactionId: tran_id },
  });

  if (!payment) {
    throw new AppError("Payment not found.", status.NOT_FOUND);
  }

  const validation = await validateSSLPayment(val_id);

  if (
    validation.status !== "VALID" &&
    validation.status !== "VALIDATED"
  ) {
    throw new AppError(
      "Payment validation failed.",
      status.BAD_REQUEST
    );
  }

  if (validation.tran_id !== tran_id) {
    throw new AppError(
      "Transaction ID mismatch.",
      status.BAD_REQUEST
    );
  }

  if (Number(validation.amount) !== Number(payment.amount)) {
    throw new AppError(
      "Paid amount does not match order amount.",
      status.BAD_REQUEST
    );
  }

  await finalizeSuccessPayment(payment, validation);

  return { orderId: payment.orderId };
};

const handleFail = async (payload: any) => {
  const { tran_id } = payload;

  const payment = await prisma.payment.findUnique({
    where: { transactionId: tran_id },
  });

  if (!payment) {
    throw new AppError("Payment not found.", status.NOT_FOUND);
  }

  if (payment.status !== "SUCCESS") {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "FAILED",
        failedAt: new Date(),
        paymentGatewayData: payload,
      },
    });
  }

  return { orderId: payment.orderId };
};

const handleCancel = async (payload: any) => {
  const { tran_id } = payload;

  const payment = await prisma.payment.findUnique({
    where: { transactionId: tran_id },
  });

  if (!payment) {
    throw new AppError("Payment not found.", status.NOT_FOUND);
  }

  if (payment.status !== "SUCCESS") {
    await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: "CANCELLED",
        cancelledAt: new Date(),
        paymentGatewayData: payload,
      },
    });
  }

  return { orderId: payment.orderId };
};

const handleIPN = async (payload: any) => {
  const { tran_id, val_id } = payload;

  const payment = await prisma.payment.findUnique({
    where: { transactionId: tran_id },
  });

  if (!payment) return;

  const validation = await validateSSLPayment(val_id);

  if (
    (validation.status === "VALID" ||
      validation.status === "VALIDATED") &&
    validation.tran_id === tran_id &&
    Number(validation.amount) === Number(payment.amount)
  ) {
    await finalizeSuccessPayment(payment, validation);
  }
};

const getPaymentStatus = async (orderId: string, userId: string) => {
  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      customerId: userId,
    },
    include: {
      payments: {
        orderBy: {
          createdAt: "desc",
        },
        take: 1,
      },
    },
  });

  if (!order) {
    throw new AppError("Order not found.", status.NOT_FOUND);
  }

  return {
    success: true,
    message: "Payment status fetched successfully.",
    data: {
      orderId: order.id,
      orderStatus: order.status,
      payment: order.payments[0] || null,
    },
  };
};

export const PaymentService = {
  initiateSSLPayment,
  handleSuccess,
  handleFail,
  handleCancel,
  handleIPN,
  getPaymentStatus,
};