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

export const PaymentRoutes: Router = router;