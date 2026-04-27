import { Router } from "express";
import authMiddleware, { UserRole } from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validateRequest";
import { ReviewController } from "./review.controller";
import { createReviewSchema } from "./review.validation";

const router = Router();

// ── Customer routes ───────────────────────────────────────────────────────────

// POST /reviews — submit a review (DELIVERED orders only)
router.post(
  "/",
  authMiddleware(UserRole.CUSTOMER),
  validateRequest(createReviewSchema),
  ReviewController.createReview
);

// GET /reviews/my — all reviews written by the logged-in customer
router.get(
  "/my",
  authMiddleware(UserRole.CUSTOMER),
  ReviewController.getMyReviews
);

// GET /reviews/can-review/:orderId — eligibility check (used by frontend button)
router.get(
  "/can-review/:orderId",
  authMiddleware(UserRole.CUSTOMER),
  ReviewController.canReviewOrder
);

// ── Provider routes ───────────────────────────────────────────────────────────

// GET /reviews/provider — paginated reviews for the authenticated provider
// ?page=1&limit=10&rating=5&mealId=xxx
router.get(
  "/provider",
  authMiddleware(UserRole.PROVIDER),
  ReviewController.getProviderReviews
);

// ── Public routes ─────────────────────────────────────────────────────────────

// GET /reviews/public/provider/:providerId — for restaurant listing page
router.get(
  "/public/provider/:providerId",
  ReviewController.getPublicProviderReviews
);

// GET /reviews/public/meal/:mealId — per-meal review list
router.get(
  "/public/meal/:mealId",
  ReviewController.getMealReviews
);

export const ReviewRoutes: Router = router;