import { Router } from "express";
import authMiddleware, { UserRole } from "../../middlewares/auth.middleware";
import { PaymentController } from "./payment.controller";

const router = Router();

router.post(
  "/initiate",
  authMiddleware(UserRole.CUSTOMER),
  PaymentController.initiatePayment
);

router.post("/ipn", PaymentController.ipnHandler);

export const PaymentRoutes: Router = router;