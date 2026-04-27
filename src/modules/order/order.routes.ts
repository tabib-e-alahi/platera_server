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


router.post(
  "/checkout-preview",
  authMiddleware(UserRole.CUSTOMER),
  validateRequest(checkoutPreviewSchema),
  OrderController.getCheckoutPreview
);

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

router.get(
  "/:id",
  authMiddleware(UserRole.CUSTOMER),
  OrderController.getMyOrderDetail
);

router.get(
  "/provider/orders",
  authMiddleware(UserRole.PROVIDER),
  OrderController.getProviderOrders
);

router.patch(
  "/:id/provider-status",
  authMiddleware(UserRole.PROVIDER),
  validateRequest(updateOrderStatusSchema),
  OrderController.updateProviderOrderStatus
);

export const OrderRoutes: Router = router;