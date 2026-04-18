// src/modules/admin/admin.controller.ts

import { Request, Response, NextFunction } from "express";
import { AdminService } from "./admin.service";
import {
  TRejectProvider,
  TCreateAdmin,
  TSuspendUser,
  userListQuerySchema,
  providerListQuerySchema,
  orderListQuerySchema,
  paymentListQuerySchema,
  TMarkProviderPaid,
} from "./admin.validation";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

// ─── Dashboard ────────────────────────────────────────────────────────────────

const getDashboardStats = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await AdminService.getDashboardStats();
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Dashboard stats fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Provider management ──────────────────────────────────────────────────────

const getPendingProviders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = providerListQuerySchema.parse(req.query);
    const result = await AdminService.getPendingProviders(query);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Pending providers fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllProviders = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = providerListQuerySchema.parse(req.query);
    const result = await AdminService.getAllProviders(query);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Providers fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getProviderDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const providerId = req.params.id as string;
    const result = await AdminService.getProviderDetail(providerId);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Provider detail fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const approveProvider = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await AdminService.approveProvider(
      req.params.id as string,
      req.user.id
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Provider approved successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const rejectProvider = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { rejectionReason } = req.body as TRejectProvider;
    const result = await AdminService.rejectProvider(
      req.params.id as string,
      req.user.id,
      rejectionReason
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Provider rejected successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ─── User management ──────────────────────────────────────────────────────────

const getAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const query = userListQuerySchema.parse(req.query);
    const result = await AdminService.getAllUsers(query);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Users fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getUserDetail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await AdminService.getUserDetail(req.params.id as string);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "User detail fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const suspendUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { reason } = req.body as TSuspendUser;
    const result = await AdminService.suspendUser(
      req.params.id as string,
      req.user.id,
      reason
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "User suspended successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const reactivateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await AdminService.reactivateUser(
      req.params.id as string,
      req.user.id
    );
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "User reactivated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// ─── Super admin only ─────────────────────────────────────────────────────────

const getAllAdmins = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await AdminService.getAllAdmins();
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Admins fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const createAdmin = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body as TCreateAdmin;
    const result = await AdminService.createAdmin(
      payload,
      req.user.id
    );
    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "Admin account created successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

//! ================ /////////////////////////// ================== new
const getAllOrders = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = orderListQuerySchema.parse(req.query);
    const result = await AdminService.getAllOrders(query);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Orders fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getOrderDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AdminService.getOrderDetail(req.params.id as string);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Order detail fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPayments = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = paymentListQuerySchema.parse(req.query);
    const result = await AdminService.getAllPayments(query);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Payments fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getPaymentDetail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AdminService.getPaymentDetail(req.params.id as string);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Payment detail fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getProviderPayablesSummary = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const result = await AdminService.getProviderPayablesSummary();
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Provider payables fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const markPaymentAsProviderPaid = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { note } = req.body as TMarkProviderPaid;
    const result = await AdminService.markPaymentAsProviderPaid(
      req.params.id as string,
      req.user.id,
      note
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Payment marked as provider paid successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AdminController = {
  getDashboardStats,
  getPendingProviders,
  getAllProviders,
  getProviderDetail,
  approveProvider,
  rejectProvider,
  getAllUsers,
  getUserDetail,
  suspendUser,
  reactivateUser,
  getAllAdmins,
  createAdmin,
  getAllOrders,
  getOrderDetail,
  getAllPayments,
  getPaymentDetail,
  getProviderPayablesSummary,
  markPaymentAsProviderPaid,
};