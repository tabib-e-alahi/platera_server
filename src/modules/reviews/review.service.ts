// src/modules/review/review.service.ts

import { prisma } from "../../lib/prisma";
import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../errors/AppError";
import { getProviderProfile } from "../../helpers/getProviderProfile";
import { TCreateReview, TGetProviderReviewsQuery } from "./review.validation";
import { Prisma } from "../../../generated/prisma/client";

// ─── createReview ─────────────────────────────────────────────────────────────
// Rules:
//   1. The order must exist and belong to the requesting customer.
//   2. The order status must be DELIVERED.
//   3. The mealId must be in that order's orderItems.
//   4. No existing review for (userId, orderId) — enforced by DB unique constraint
//      but we check early for a clean error message.

const createReview = async (userId: string, payload: TCreateReview) => {
  const { orderId, mealId, rating, feedback } = payload;

  // 1. Load order with items, verify ownership
  const order = await prisma.order.findFirst({
    where: { id: orderId, customerId: userId },
    include: {
      orderItems: { select: { mealId: true } },
    },
  });

  if (!order) {
    throw new NotFoundError("Order not found.");
  }

  // 2. Only DELIVERED orders can be reviewed
  if (order.status !== "DELIVERED") {
    throw new BadRequestError(
      "You can only review orders that have been delivered."
    );
  }

  // 3. Validate mealId belongs to this order
  const mealInOrder = order.orderItems.some((item) => item.mealId === mealId);
  if (!mealInOrder) {
    throw new BadRequestError("This meal was not part of the specified order.");
  }

  // 4. Check for duplicate (give a clear message before hitting DB constraint)
  const existing = await prisma.review.findUnique({
    where: { userId_orderId: { userId, orderId } },
  });
  if (existing) {
    throw new ConflictError("You have already reviewed this order.");
  }

  // 5. Fetch meal to get providerId (denormalise)
  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
    select: { id: true, providerId: true },
  });
  if (!meal) throw new NotFoundError("Meal not found.");

  // 6. Create review
  const review = await prisma.review.create({
    data: {
      orderId,
      mealId,
      userId,
      providerId: meal.providerId,
      rating,
      feedback: feedback ?? null,
      images: [],
    },
    include: {
      user: { select: { id: true, name: true, image: true } },
      meal: { select: { id: true, name: true, mainImageURL: true } },
    },
  });

  return review;
};

// ─── getMyReviews ─────────────────────────────────────────────────────────────
// Customer can see all reviews they have written.

const getMyReviews = async (userId: string) => {
  const reviews = await prisma.review.findMany({
    where: { userId },
    include: {
      meal:     { select: { id: true, name: true, mainImageURL: true } },
      provider: { select: { id: true, businessName: true, imageURL: true } },
    },
    orderBy: { createdAt: "desc" },
  });
  return reviews;
};

// ─── canReviewOrder ───────────────────────────────────────────────────────────
// Lightweight check the frontend calls before showing "Write a Review" button.
// Returns { canReview, reason?, existingReview? }

const canReviewOrder = async (userId: string, orderId: string) => {
  const order = await prisma.order.findFirst({
    where: { id: orderId, customerId: userId },
    select: { status: true },
  });

  if (!order) return { canReview: false, reason: "Order not found." };
  if (order.status !== "DELIVERED") {
    return { canReview: false, reason: "Order not yet delivered." };
  }

  const existing = await prisma.review.findUnique({
    where: { userId_orderId: { userId, orderId } },
    include: {
      meal: { select: { id: true, name: true } },
    },
  });

  if (existing) {
    return { canReview: false, reason: "Already reviewed.", existingReview: existing };
  }

  return { canReview: true };
};

// ─── getProviderReviews ───────────────────────────────────────────────────────
// Provider dashboard: paginated review list with rating breakdown.

const getProviderReviews = async (
  userId: string,
  query: TGetProviderReviewsQuery
) => {
  const provider = await getProviderProfile(userId);

  const { page, limit, rating, mealId } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.ReviewWhereInput = {
    providerId: provider.id,
    ...(rating  && { rating: { gte: rating, lt: rating + 1 } }),
    ...(mealId  && { mealId }),
  };

  const [reviews, total, ratingStats] = await Promise.all([
    prisma.review.findMany({
      where,
      include: {
        user: { select: { id: true, name: true, image: true } },
        meal: { select: { id: true, name: true, mainImageURL: true } },
        order: { select: { id: true, orderNumber: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.review.count({ where }),
    // Aggregate breakdown — always computed on full provider dataset, not filtered view
    prisma.review.aggregate({
      where: { providerId: provider.id },
      _avg:   { rating: true },
      _count: { rating: true },
    }),
  ]);

  // Breakdown by star (1–5)
  const breakdown = await prisma.review.groupBy({
    by:      ["rating"],
    where:   { providerId: provider.id },
    _count:  { rating: true },
  });

  // Normalise: floor rating to bucket (1-2=1, 2-3=2, …)
  const starBuckets: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const b of breakdown) {
    const star = Math.ceil(b.rating); // 4.7 → 5, 4.0 → 4
    const clamped = Math.max(1, Math.min(5, star));
    starBuckets[clamped] = (starBuckets[clamped] ?? 0) + b._count.rating;
  }

  return {
    reviews,
    pagination: {
      total,
      page,
      limit,
      totalPages:  Math.ceil(total / limit),
      hasNextPage: skip + limit < total,
      hasPrevPage: page > 1,
    },
    stats: {
      averageRating: ratingStats._avg.rating
        ? Math.round(ratingStats._avg.rating * 10) / 10
        : 0,
      totalReviews: ratingStats._count.rating,
      breakdown:    starBuckets,
    },
  };
};

// ─── getPublicProviderReviews ─────────────────────────────────────────────────
// Public endpoint: customers browsing a restaurant see its reviews.

const getPublicProviderReviews = async (
  providerId: string,
  query: { page?: number; limit?: number }
) => {
  const page  = Math.max(1, query.page ?? 1);
  const limit = Math.min(20, Math.max(1, query.limit ?? 6));
  const skip  = (page - 1) * limit;

  const provider = await prisma.providerProfile.findUnique({
    where: { id: providerId },
    select: { id: true },
  });
  if (!provider) throw new NotFoundError("Provider not found.");

  const [reviews, total, agg] = await Promise.all([
    prisma.review.findMany({
      where:   { providerId },
      include: {
        user: { select: { id: true, name: true, image: true } },
        meal: { select: { id: true, name: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.review.count({ where: { providerId } }),
    prisma.review.aggregate({
      where: { providerId },
      _avg:  { rating: true },
    }),
  ]);

  return {
    reviews,
    pagination: {
      total,
      page,
      limit,
      totalPages:  Math.ceil(total / limit),
      hasNextPage: skip + limit < total,
      hasPrevPage: page > 1,
    },
    averageRating: agg._avg.rating
      ? Math.round(agg._avg.rating * 10) / 10
      : 0,
  };
};

// ─── getMealReviews ───────────────────────────────────────────────────────────
// Public: reviews for a specific meal on the restaurant page.

const getMealReviews = async (
  mealId: string,
  query: { page?: number; limit?: number }
) => {
  const page  = Math.max(1, query.page ?? 1);
  const limit = Math.min(20, Math.max(1, query.limit ?? 6));
  const skip  = (page - 1) * limit;

  const [reviews, total, agg] = await Promise.all([
    prisma.review.findMany({
      where:   { mealId },
      include: { user: { select: { id: true, name: true, image: true } } },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.review.count({ where: { mealId } }),
    prisma.review.aggregate({
      where: { mealId },
      _avg:  { rating: true },
    }),
  ]);

  return {
    reviews,
    averageRating: agg._avg.rating
      ? Math.round(agg._avg.rating * 10) / 10
      : 0,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const ReviewService = {
  createReview,
  getMyReviews,
  canReviewOrder,
  getProviderReviews,
  getPublicProviderReviews,
  getMealReviews,
};