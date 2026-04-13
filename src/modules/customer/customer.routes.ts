import { Router } from "express";
import authMiddleware, { UserRole } from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validateRequest";
import { CustomerController } from "./customer.controller";
import {
  createCustomerProfileSchema,
  updateCustomerProfileSchema,
} from "./customer.validation";

const router = Router();

router.get(
  "/profile/me",
  authMiddleware(UserRole.CUSTOMER),
  CustomerController.getMyProfile
);

router.post(
  "/profile",
  authMiddleware(UserRole.CUSTOMER),
  validateRequest(createCustomerProfileSchema),
  CustomerController.createProfile
);

router.patch(
  "/profile",
  authMiddleware(UserRole.CUSTOMER),
  validateRequest(updateCustomerProfileSchema),
  CustomerController.updateProfile
);

export const CustomerRoutes: Router = router;