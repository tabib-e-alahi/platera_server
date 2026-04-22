import { Router } from "express";
import authMiddleware, { UserRole } from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validateRequest";
import { OrderController } from "./order.controller";
import {
  checkoutPreviewSchema,
  createOrderSchema,
  updateOrderStatusSchema,
} from "./order.validation";

const router = Router();

/* ── Customer routes ──────────────────────────────────────────────────────── */

// POST /orders/checkout-preview
router.post(
  "/checkout-preview",
  authMiddleware(UserRole.CUSTOMER),
  validateRequest(checkoutPreviewSchema),
  OrderController.getCheckoutPreview
);

// POST /orders
router.post(
  "/",
  authMiddleware(UserRole.CUSTOMER),
  validateRequest(createOrderSchema),
  OrderController.createOrder
);

// GET /orders/my-orders?status=&page=&limit=&search=
router.get(
  "/my-orders",
  authMiddleware(UserRole.CUSTOMER),
  OrderController.getMyOrders
);

// GET /orders/:id/tracking  (REST snapshot)
router.get(
  "/:id/tracking",
  authMiddleware(UserRole.CUSTOMER),
  OrderController.getOrderTracking
);

// GET /orders/:id/tracking/stream  (SSE real-time stream)
router.get(
  "/:id/tracking/stream",
  authMiddleware(UserRole.CUSTOMER),
  OrderController.streamOrderTracking
);

// PATCH /orders/:id/cancel
router.patch(
  "/:id/cancel",
  authMiddleware(UserRole.CUSTOMER),
  OrderController.cancelMyOrder
);

// GET /orders/:id  (full detail)
router.get(
  "/:id",
  authMiddleware(UserRole.CUSTOMER),
  OrderController.getMyOrderDetail
);

/* ── Provider routes ──────────────────────────────────────────────────────── */

// GET /orders/provider-orders?status=&page=&limit=
router.get(
  "/provider/orders",
  authMiddleware(UserRole.PROVIDER),
  OrderController.getProviderOrders
);

// PATCH /orders/:id/provider-status
router.patch(
  "/:id/provider-status",
  authMiddleware(UserRole.PROVIDER),
  validateRequest(updateOrderStatusSchema),
  OrderController.updateProviderOrderStatus
);

export const OrderRoutes: Router = router;