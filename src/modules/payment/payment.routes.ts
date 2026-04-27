// src/modules/payment/payment.routes.ts

import { Router } from "express";
import authMiddleware, { UserRole } from "../../middlewares/auth.middleware";
import { PaymentController } from "./payment.controller";

const router = Router();


router.post(
  "/initiate/:orderId",
  authMiddleware(UserRole.CUSTOMER),
  PaymentController.initiateSSLPayment
);

// Get payment status for an order
router.get(
  "/status/:orderId",
  authMiddleware(UserRole.CUSTOMER),
  PaymentController.getPaymentStatus
);

// ── SSLCommerz server-to-server IPN callback ──────────────────────────────────
// NO auth middleware — SSLCommerz calls this directly
// router.post(
//   "/sslcommerz/ipn",
//   PaymentController.handleIPNNotification
// );

// Callbacks from SSLCommerz
router.post("/sslcommerz/success", PaymentController.handleSuccess);
router.post("/sslcommerz/fail", PaymentController.handleFail);
router.post("/sslcommerz/cancel", PaymentController.handleCancel);

// IPN (backup)
router.post("/sslcommerz/ipn", PaymentController.handleIPN);



export const PaymentRoutes: Router = router;