// src/modules/review/review.validation.ts

import { z } from "zod";

// ── Create Review ─────────────────────────────────────────────────────────────
// Customer submits a review for a DELIVERED order.
// orderId + mealId both required: we verify both belong to the customer's order.

export const createReviewSchema = z.object({
  orderId: z.string().uuid("orderId must be a valid UUID"),
  mealId:  z.string().uuid("mealId must be a valid UUID"),
  rating:  z
    .number("Rating is required.")
    .min(1, "Rating must be at least 1.")
    .max(5, "Rating must be at most 5."),
  feedback: z.string().max(1000, "Feedback must be at most 1000 characters.").optional(),
});

export type TCreateReview = z.infer<typeof createReviewSchema>;

// ── Query: get provider reviews ───────────────────────────────────────────────

export const getProviderReviewsQuerySchema = z.object({
  page:    z.coerce.number().min(1).default(1),
  limit:   z.coerce.number().min(1).max(50).default(10),
  rating:  z.coerce.number().min(1).max(5).optional(), // filter by exact star
  mealId:  z.string().uuid().optional(),               // filter by meal
});

export type TGetProviderReviewsQuery = z.infer<typeof getProviderReviewsQuerySchema>;