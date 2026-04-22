// src/modules/admin/admin.routes.ts

import { Router } from "express";
import authMiddleware, { UserRole } from "../../middlewares/auth.middleware";
import { adminGuard, superAdminGuard } from "../../middlewares/adminGuard.middleware";
import validateRequest from "../../middlewares/validateRequest";
import {
  rejectProviderSchema,
  createAdminSchema,
  suspendUserSchema,
  markProviderPaidSchema,
  updateProviderStatusSchema,
} from "./admin.validation";
import { AdminController } from "./admin.controller";

const router = Router();

// All routes require a valid session + admin/super-admin role
router.use(authMiddleware(UserRole.ADMIN, UserRole.SUPER_ADMIN));
router.use(adminGuard);

/* ─── Dashboard ──────────────────────────────────────────────────────────── */
router.get("/dashboard", AdminController.getDashboardStats);

/* ─── Provider management ────────────────────────────────────────────────── */
router.get("/providers/pending", AdminController.getPendingProviders);
router.get("/providers", AdminController.getAllProviders);
router.get("/providers/:id", AdminController.getProviderDetail);
router.patch("/providers/:id/approve", AdminController.approveProvider);
router.patch(
  "/providers/:id/reject",
  validateRequest(rejectProviderSchema),
  AdminController.rejectProvider
);
router.patch(
  "/providers/:id/status",
  validateRequest(updateProviderStatusSchema),
  AdminController.updateProviderStatus
);

/* ─── User management ────────────────────────────────────────────────────── */
router.get("/users", AdminController.getAllUsers);
router.get("/users/:id", AdminController.getUserDetail);
router.patch(
  "/users/:id/suspend",
  validateRequest(suspendUserSchema),
  AdminController.suspendUser
);
router.patch("/users/:id/reactivate", AdminController.reactivateUser);
router.patch("/users/:id/toggle-status", AdminController.toggleUserStatus);

/* ─── Super admin only ───────────────────────────────────────────────────── */
router.get("/admins", superAdminGuard, AdminController.getAllAdmins);
router.post(
  "/admins",
  superAdminGuard,
  validateRequest(createAdminSchema),
  AdminController.createAdmin
);

/* ─── Orders ─────────────────────────────────────────────────────────────── */
router.get("/orders", AdminController.getAllOrders);
router.get("/orders/:id", AdminController.getOrderDetail);

/* ─── Payments ───────────────────────────────────────────────────────────── */
router.get("/payments", AdminController.getAllPayments);
router.get("/payments/:id", AdminController.getPaymentDetail);
router.patch(
  "/payments/:id/mark-provider-paid",
  validateRequest(markProviderPaidSchema),
  AdminController.markPaymentAsProviderPaid
);

/* ─── Payables / Settlements ─────────────────────────────────────────────── */
router.get("/payables/providers", AdminController.getProviderPayablesSummary);
router.get("/settlements", AdminController.getAllPayments);          // alias
router.patch(
  "/settlements/:paymentId",
  validateRequest(markProviderPaidSchema),
  AdminController.markPaymentAsProviderPaid
);
router.patch("/settlements/bulk/:providerId", AdminController.bulkSettleProvider);

/* ─── Categories ─────────────────────────────────────────────────────────── */
router.get("/categories", AdminController.getAllCategories);
router.post("/categories", AdminController.createCategory);
router.patch("/categories/:id", AdminController.updateCategory);
router.delete("/categories/:id", AdminController.deleteCategory);
router.patch("/categories/:id/toggle", AdminController.toggleCategoryStatus);

export const AdminRoutes: Router = router;