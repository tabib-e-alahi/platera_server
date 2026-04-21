// src/modules/admin/admin.routes.ts

import { Router } from "express";
import authMiddleware, {
  UserRole,
} from "../../middlewares/auth.middleware";
import {
  adminGuard,
  superAdminGuard,
} from "../../middlewares/adminGuard.middleware";
import validateRequest from "../../middlewares/validateRequest";
import {
  rejectProviderSchema,
  createAdminSchema,
  suspendUserSchema,
  markProviderPaidSchema,
  updateProviderStatusSchema,
} from "./admin.validation";
import { PaymentController } from "../payment/payment.controller";
import { AdminController } from "./admin.controller";

const router = Router();

// every route in this file requires:
// 1. valid session (authMiddleware)
// 2. admin or super admin role (adminGuard)
// apply both to the router level so every route inherits them

router.use(
  authMiddleware(UserRole.ADMIN, UserRole.SUPER_ADMIN)
);
router.use(adminGuard);

// ─── Dashboard ────────────────────────────────────────────────────────────────
router.get(
  "/dashboard",
  AdminController.getDashboardStats
);

// ─── Provider management ──────────────────────────────────────────────────────
router.get(
  "/providers/pending",
  AdminController.getPendingProviders
);

router.get(
  "/providers",
  AdminController.getAllProviders
);

router.get(
  "/providers/:id",
  AdminController.getProviderDetail
);

router.patch(
  "/providers/:id/approve",
  AdminController.approveProvider
);

router.patch(
  "/providers/:id/reject",
  validateRequest(rejectProviderSchema),
  AdminController.rejectProvider
);

// ─── User management ──────────────────────────────────────────────────────────
router.get(
  "/users",
  AdminController.getAllUsers
);

router.get(
  "/users/:id",
  AdminController.getUserDetail
);

router.patch(
  "/users/:id/suspend",
  validateRequest(suspendUserSchema),
  AdminController.suspendUser
);

router.patch(
  "/users/:id/reactivate",
  AdminController.reactivateUser
);

// ─── Super admin only ─────────────────────────────────────────────────────────
// superAdminGuard applied only to these specific routes

router.get(
  "/admins",
  superAdminGuard,
  AdminController.getAllAdmins
);

router.post(
  "/admins",
  superAdminGuard,
  validateRequest(createAdminSchema),
  AdminController.createAdmin
);


//! ===================
router.get("/orders", AdminController.getAllOrders);
router.get("/orders/:id", AdminController.getOrderDetail);

router.get("/payments", AdminController.getAllPayments);
router.get("/payments/:id", AdminController.getPaymentDetail);
router.get("/payables/providers", AdminController.getProviderPayablesSummary);

router.patch(
  "/payments/:id/mark-provider-paid",
  validateRequest(markProviderPaidSchema),
  AdminController.markPaymentAsProviderPaid
);

router.patch(
  "/providers/:id/status",
  validateRequest(updateProviderStatusSchema),
  AdminController.updateProviderStatus
);


// GET /api/v1/admins/settlements
router.get("/settlements", AdminController.getAllPayments);

// PATCH /api/v1/admins/settlements/:paymentId
router.patch("/settlements/:paymentId", AdminController.markPaymentAsProviderPaid);

// PATCH /api/v1/admins/settlements/bulk/:providerId
router.patch("/settlements/bulk/:providerId", AdminController.bulkSettleProvider);

export const AdminRoutes: Router = router;