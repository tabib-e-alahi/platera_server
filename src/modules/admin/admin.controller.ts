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
  TUpdateProviderStatus,
} from "./admin.validation";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

/* ─── Dashboard ──────────────────────────────────────────────────────────── */

const getDashboardStats = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await AdminService.getDashboardStats();
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Dashboard stats fetched.", data: result });
  } catch (e) { next(e); }
};

/* ─── Provider management ────────────────────────────────────────────────── */

const getPendingProviders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = providerListQuerySchema.parse(req.query);
    const result = await AdminService.getPendingProviders(query);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Pending providers fetched.", data: result });
  } catch (e) { next(e); }
};

const getAllProviders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = providerListQuerySchema.parse(req.query);
    const result = await AdminService.getAllProviders(query);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Providers fetched.", data: result });
  } catch (e) { next(e); }
};

const getProviderDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await AdminService.getProviderDetail(req.params.id as string);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Provider detail fetched.", data: result });
  } catch (e) { next(e); }
};

const approveProvider = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await AdminService.approveProvider(req.params.id as string, req.user.id);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Provider approved.", data: result });
  } catch (e) { next(e); }
};

const rejectProvider = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { rejectionReason } = req.body as TRejectProvider;
    const result = await AdminService.rejectProvider(req.params.id as string, req.user.id, rejectionReason);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Provider rejected.", data: result });
  } catch (e) { next(e); }
};

const updateProviderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await AdminService.updateProviderStatus(req.params.id as string, req.user.id, req.body as TUpdateProviderStatus);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Provider status updated.", data: result });
  } catch (e) { next(e); }
};

/* ─── User management ────────────────────────────────────────────────────── */

const getAllUsers = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = userListQuerySchema.parse(req.query);
    const result = await AdminService.getAllUsers(query);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Users fetched.", data: result });
  } catch (e) { next(e); }
};

const getUserDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await AdminService.getUserDetail(req.params.id as string);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "User detail fetched.", data: result });
  } catch (e) { next(e); }
};

const suspendUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { reason } = req.body as TSuspendUser;
    const result = await AdminService.suspendUser(req.params.id as string, req.user.id, reason);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "User suspended.", data: result });
  } catch (e) { next(e); }
};

const reactivateUser = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await AdminService.reactivateUser(req.params.id as string, req.user.id);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "User reactivated.", data: result });
  } catch (e) { next(e); }
};

const toggleUserStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await AdminService.toggleUserStatus(req.params.id as string, req.user.id);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "User status toggled.", data: result });
  } catch (e) { next(e); }
};

/* ─── Super admin ────────────────────────────────────────────────────────── */

const getAllAdmins = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await AdminService.getAllAdmins();
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Admins fetched.", data: result });
  } catch (e) { next(e); }
};

const createAdmin = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await AdminService.createAdmin(req.body as TCreateAdmin, req.user.id);
    sendResponse(res, { httpStatusCode: status.CREATED, success: true, message: "Admin account created.", data: result });
  } catch (e) { next(e); }
};

/* ─── Orders ─────────────────────────────────────────────────────────────── */

const getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = orderListQuerySchema.parse(req.query);
    const result = await AdminService.getAllOrders(query);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Orders fetched.", data: result });
  } catch (e) { next(e); }
};

const getOrderDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await AdminService.getOrderDetail(req.params.id as string);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Order detail fetched.", data: result });
  } catch (e) { next(e); }
};

/* ─── Payments ───────────────────────────────────────────────────────────── */

const getAllPayments = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const query = paymentListQuerySchema.parse(req.query);
    const result = await AdminService.getAllPayments(query);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Payments fetched.", data: result });
  } catch (e) { next(e); }
};

const getPaymentDetail = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await AdminService.getPaymentDetail(req.params.id as string);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Payment detail fetched.", data: result });
  } catch (e) { next(e); }
};

const getProviderPayablesSummary = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await AdminService.getProviderPayablesSummary();
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Provider payables fetched.", data: result });
  } catch (e) { next(e); }
};

const markPaymentAsProviderPaid = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {

    const { note } = req.body as TMarkProviderPaid;
    const result = await AdminService.markPaymentAsProviderPaid(req.params.paymentId as string, req.user.id, note);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Payment settled.", data: result });
  } catch (e) { next(e); }
};

const bulkSettleProvider = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { note } = req.body as TMarkProviderPaid;
    const result = await AdminService.bulkSettleProvider(req.params.providerId as string, req.user.id, note);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Bulk settlement completed.", data: result });
  } catch (e) { next(e); }
};

/* ─── Categories ─────────────────────────────────────────────────────────── */

const getAllCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await AdminService.getAllCategories();
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Categories fetched.", data: result });
  } catch (e) { next(e); }
};

const createCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await AdminService.createCategory(req.body);
    sendResponse(res, { httpStatusCode: status.CREATED, success: true, message: "Category created.", data: result });
  } catch (e) { next(e); }
};

const updateCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await AdminService.updateCategory(req.params.id as string, req.body);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Category updated.", data: result });
  } catch (e) { next(e); }
};

const deleteCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await AdminService.deleteCategory(req.params.id as string);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Category deleted.", data: result });
  } catch (e) { next(e); }
};

const toggleCategoryStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const result = await AdminService.toggleCategoryStatus(req.params.id as string);
    sendResponse(res, { httpStatusCode: status.OK, success: true, message: "Category status toggled.", data: result });
  } catch (e) { next(e); }
};

export const AdminController = {
  getDashboardStats,
  getPendingProviders,
  getAllProviders,
  getProviderDetail,
  approveProvider,
  rejectProvider,
  updateProviderStatus,
  getAllUsers,
  getUserDetail,
  suspendUser,
  reactivateUser,
  toggleUserStatus,
  getAllAdmins,
  createAdmin,
  getAllOrders,
  getOrderDetail,
  getAllPayments,
  getPaymentDetail,
  getProviderPayablesSummary,
  markPaymentAsProviderPaid,
  bulkSettleProvider,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
};