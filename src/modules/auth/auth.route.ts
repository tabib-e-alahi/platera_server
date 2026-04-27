import { Router } from "express";
import { AuthController } from "./auth.controller";
import validateRequest from "../../middlewares/validateRequest";
import { customerRegisterSchema, loginSchema, providerRegisterSchema } from "./auth.validation";
import authMiddleware, { UserRole } from "../../middlewares/auth.middleware";
const router = Router()

//  api/v1/auth/.....
router.get("/me", authMiddleware(UserRole.CUSTOMER, UserRole.PROVIDER, UserRole.ADMIN, UserRole.SUPER_ADMIN), AuthController.getMe)

router.get("/session-check", AuthController.sessionCheck)

router.post("/register-customer", validateRequest(customerRegisterSchema), AuthController.registerCustomer);

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


router.post("/verify-email", AuthController.verifyEmail)

router.post("/logout", AuthController.logout)


// router.get("/login/google", AuthController.googleLogin);
// router.get("/google/success", AuthController.googleLoginSuccess);
// router.get("/oauth/error", AuthController.handleOAuthError);

export const AuthRoutes: Router = router