import status from "http-status";
import envConfig from "../../config";
import { AppError } from "../../errors/AppError";
import axios from "axios";
import { prisma } from "../../lib/prisma";
import { v4 as uuidv4 } from "uuid";

const backendBaseUrl = envConfig.BETTER_AUTH_URL;
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
      throw new AppError(status.NOT_FOUND, "Order not found.");
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
        userId: order.providerId,
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
      status.INTERNAL_SERVER_ERROR,
      "SSLCommerz credentials are missing."
    );
  }

  const transactionId = `PLATERA_${uuidv4()}`;

  let payment = await prisma.payment.create({
    data: {
      orderId: order.id,
      customerId: order.customerId,
      providerId: order.providerId,
      amount: Number(order.totalAmount),
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
      envConfig.sslcommerz_ipn_url ||
      `${backendBaseUrl}/api/v1/payments/sslcommerz/ipn`,

    shipping_method: "NO",
    product_name: `Order-${order.id}`,
    product_category: "Food",
    product_profile: "general",

    cus_name:
      order.customer?.name ||
      order.customer?.email ||
      "Customer",
    cus_email: order.customer?.email || "customer@example.com",
    cus_add1: order.deliveryAddress || "Dhaka",
    cus_city: order.city || "Dhaka",
    cus_postcode: "1200",
    cus_country: "Bangladesh",
    cus_phone: order.phone || "01700000000",

    ship_name:
      order.customer?.name ||
      order.customer?.email ||
      "Customer",
    ship_add1: order.deliveryAddress || "Dhaka",
    ship_city: order.city || "Dhaka",
    ship_postcode: "1200",
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
        status.BAD_REQUEST,
        responseData?.failedreason || "Failed to initiate SSLCommerz payment."
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
      status.BAD_REQUEST,
      error?.response?.data?.failedreason ||
        error?.message ||
        "Failed to initiate payment."
    );
  }
};

const handleSuccess = async (payload: any) => {
  const { tran_id, val_id, amount } = payload;

  const payment = await prisma.payment.findUnique({
    where: { transactionId: tran_id },
  });

  if (!payment) {
    throw new AppError(status.NOT_FOUND, "Payment not found.");
  }

  const validation = await validateSSLPayment(val_id);

  if (
    validation.status !== "VALID" &&
    validation.status !== "VALIDATED"
  ) {
    throw new AppError(
      status.BAD_REQUEST,
      "Payment validation failed."
    );
  }

  if (validation.tran_id !== tran_id) {
    throw new AppError(
      status.BAD_REQUEST,
      "Transaction ID mismatch."
    );
  }

  if (Number(validation.amount) !== Number(payment.amount)) {
    throw new AppError(
      status.BAD_REQUEST,
      "Paid amount does not match order amount."
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
    throw new AppError(status.NOT_FOUND, "Payment not found.");
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
    throw new AppError(status.NOT_FOUND, "Payment not found.");
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
    throw new AppError(status.NOT_FOUND, "Order not found.");
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