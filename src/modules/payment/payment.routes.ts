// src/modules/payment/payment.routes.ts

import { Router } from "express";
import authMiddleware, { UserRole } from "../../middlewares/auth.middleware";
import { PaymentController } from "./payment.controller";

const router = Router();

// ── Customer routes ───────────────────────────────────────────────────────────

// Initiate SSLCommerz session for an order
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
router.post(
  "/sslcommerz/ipn",
  PaymentController.handleIPNNotification
);



// Initiate
router.post("/initiate/:orderId", paymentController.initiatePayment);

// Callbacks from SSLCommerz
router.post("/sslcommerz/success", paymentController.handleSuccess);
router.post("/sslcommerz/fail", paymentController.handleFail);
router.post("/sslcommerz/cancel", paymentController.handleCancel);

// IPN (backup)
router.post("/sslcommerz/ipn", paymentController.handleIPN);

export const paymentRoutes = router;

export const PaymentRoutes: Router = router;