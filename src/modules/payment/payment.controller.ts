// src/modules/payment/payment.controller.ts

import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentService } from "./payment.service";

// POST /api/v1/payments/initiate/:orderId
const initiateSSLPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await PaymentService.initiateSSLPayment(
      req.user.id,
      req.params.orderId as string
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Payment session initiated.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// POST /api/v1/payments/sslcommerz/ipn  — called by SSLCommerz server
// Must NOT have auth middleware (SSLCommerz calls this, not the user)
const handleIPNNotification = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await PaymentService.handleIPNNotification(req.body);
    // SSLCommerz expects a 200 OK plain response
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
};

// GET /api/v1/payments/status/:orderId
const getPaymentStatus = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await PaymentService.getPaymentStatus(
      req.user.id,
      req.params.orderId as string
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Payment status fetched.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Admin controllers

// GET /api/v1/admins/settlements
const getPaymentsForAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page  = Number(req.query.page)  || 1;
    const limit = Number(req.query.limit) || 20;
    const settlementStatus = req.query.settlementStatus as string | undefined;
    const providerId       = req.query.providerId as string | undefined;

    const result = await PaymentService.getPaymentsForAdmin({
      page,
      limit,
      ...(settlementStatus && { settlementStatus }),
      ...(providerId && { providerId }),
    });

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Payments fetched.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/admins/settlements/:paymentId
const settleProviderPayment = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await PaymentService.settleProviderPayment(
      req.user.id,
      req.params.paymentId as string,
      req.body.note
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Payment settled successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// PATCH /api/v1/admins/settlements/bulk/:providerId
const bulkSettleProvider = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await PaymentService.bulkSettleProvider(
      req.user.id,
      req.params.providerId as string,
      req.body.note
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Bulk settlement completed.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const PaymentController = {
  initiateSSLPayment,
  handleIPNNotification,
  getPaymentStatus,
  getPaymentsForAdmin,
  settleProviderPayment,
  bulkSettleProvider,
};