import { Router } from "express";
import authMiddleware, { UserRole } from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validateRequest";
import { CartController } from "./cart.controller";
import {
  addCartItemSchema,
  updateCartItemQuantitySchema,
} from "./cart.validation";

const router = Router();

router.get(
  "/",
  authMiddleware(UserRole.CUSTOMER),
  CartController.getMyCart
);

router.post(
  "/items",
  authMiddleware(UserRole.CUSTOMER),
  validateRequest(addCartItemSchema),
  CartController.addItem
);

router.patch(
  "/items/:itemId",
  authMiddleware(UserRole.CUSTOMER),
  validateRequest(updateCartItemQuantitySchema),
  CartController.updateItemQuantity
);

router.delete(
  "/items/:itemId",
  authMiddleware(UserRole.CUSTOMER),
  CartController.removeItem
);

router.delete(
  "/",
  authMiddleware(UserRole.CUSTOMER),
  CartController.clearCart
);

export const CartRoutes: Router = router;