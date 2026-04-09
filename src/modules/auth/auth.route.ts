import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { customerRegisterSchema, loginSchema, providerRegisterSchema } from "./auth.validation";
const router = Router()

//  api/v1/auth/.....

router.post(
  "/register-customer",
  validateRequest(customerRegisterSchema),
  AuthController.registerCustomer
);

router.post(
  "/register-provider",
  validateRequest(providerRegisterSchema),
  AuthController.registerProvider
);

router.post(
  "/login",
  validateRequest(loginSchema),
  AuthController.loginUser
);

export const AuthRoutes: Router = router