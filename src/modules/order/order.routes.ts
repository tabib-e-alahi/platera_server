import { Router } from "express";
import authMiddleware, { UserRole } from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validateRequest";
import { OrderController } from "./order.controller";
import {
  checkoutPreviewSchema,
  createOrderSchema,
} from "./order.validation";

const router = Router();

//* /api/v1/orders/... */

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

router.get(
  "/my-orders",
  authMiddleware(UserRole.CUSTOMER),
  OrderController.getMyOrders
);

router.get(
  "/:id",
  authMiddleware(UserRole.CUSTOMER),
  OrderController.getMyOrderDetail
);

export const OrderRoutes: Router = router;