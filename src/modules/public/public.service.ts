// src/modules/public/public.service.ts — COMPLETE REPLACEMENT

import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma";

/* ── Categories ──────────────────────────────────────────────────────────── */

const getCategories = async () => {
  return prisma.category.findMany({
    where: { isActive: { not: false } },
    orderBy: { displayOrder: "asc" },
  });
};

/* ── Restaurants (paginated) ─────────────────────────────────────────────── */

const getRestaurants = async (filters: {
  search?: string;
  city?: string;
  categoryId?: string;
  subcategory?: string;
  businessCategory?: string;
  page: number;
  limit: number;
}) => {
  const { search, city, categoryId, subcategory, businessCategory, page, limit } = filters;
  const skip = (page - 1) * limit;

  const where: Prisma.ProviderProfileWhereInput = {
    approvalStatus: "APPROVED",
    isActive: true,
    ...(city && { city: { equals: city, mode: "insensitive" } }),
    ...(businessCategory && { businessCategory: businessCategory as any }),
    ...(search && {
      OR: [
        { businessName: { contains: search, mode: "insensitive" } },
        { bio: { contains: search, mode: "insensitive" } },
      ],
    }),
    ...(categoryId && {
      meals: { some: { categoryId, isActive: true, isAvailable: true } },
    }),
    ...(subcategory && {
      meals: {
        some: {
          subcategory: { contains: subcategory, mode: "insensitive" },
          isActive: true,
          isAvailable: true,
        },
      },
    }),
  };

  const [restaurants, total] = await Promise.all([
    prisma.providerProfile.findMany({
      where,
      skip,
      take: limit,
      orderBy: { totalOrdersCompleted: "desc" },
      select: {
        id: true,
        businessName: true,
        businessCategory: true,
        bio: true,
        imageURL: true,
        city: true,
        street: true,
        totalOrdersCompleted: true,
        createdAt: true,
        _count: { select: { meals: true, reviews: true } },
        reviews: { select: { rating: true }, take: 1000 },
        meals: {
          where: { isActive: true, isAvailable: true },
          select: { subcategory: true, categoryId: true },
          take: 200,
        },
      },
    }),
    prisma.providerProfile.count({ where }),
  ]);

  const enriched = restaurants.map((r) => {
    const ratings = r.reviews.map((rv) => rv.rating);
    const avgRating =
      ratings.length > 0
        ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
        : 0;
    const subcategories = [...new Set(r.meals.map((m) => m.subcategory).filter(Boolean))];
    return {
      id: r.id,
      businessName: r.businessName,
      businessCategory: r.businessCategory,
      bio: r.bio,
      imageURL: r.imageURL,
      city: r.city,
      street: r.street,
      totalOrdersCompleted: r.totalOrdersCompleted,
      reviewCount: ratings.length,
      mealCount: r._count.meals,
      avgRating,
      subcategories,
    };
  });

  return {
    data: enriched,
    meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

/* ── Single restaurant ───────────────────────────────────────────────────── */

const getRestaurantById = async (
  restaurantId: string,
  mealFilters: {
    search?: string;
    categoryId?: string;
    subcategory?: string;
    dietary?: string;
    sortBy?: string;
  }
) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { id: restaurantId, approvalStatus: "APPROVED", isActive: true },
    select: {
      id: true,
      businessName: true,
      businessCategory: true,
      bio: true,
      imageURL: true,
      businessMainGateURL: true,
      businessKitchenURL: true,
      city: true,
      street: true,
      houseNumber: true,
      apartment: true,
      totalOrdersCompleted: true,
      createdAt: true,
      _count: { select: { meals: true, reviews: true } },
      reviews: {
        orderBy: { createdAt: "desc" },
        take: 10,
        select: {
          id: true,
          rating: true,
          feedback: true,
          createdAt: true,
          user: { select: { name: true, image: true } },
        },
      },
    },
  });

  if (!provider) return null;

  const ratings = (provider.reviews as any[]).map((r) => r.rating);
  const avgRating =
    ratings.length > 0
      ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
      : 0;

  let orderBy: Prisma.MealOrderByWithRelationInput = {};
  switch (mealFilters.sortBy) {
    case "price_asc":  orderBy = { basePrice: "asc" };      break;
    case "price_desc": orderBy = { basePrice: "desc" };     break;
    case "popular":    orderBy = { isBestseller: "desc" };  break;
    default:           orderBy = { createdAt: "desc" };
  }

  const mealWhere: Prisma.MealWhereInput = {
    providerId: restaurantId,
    isActive: true,
    isAvailable: true,
    ...(mealFilters.search && {
      OR: [
        { name: { contains: mealFilters.search, mode: "insensitive" } },
        { shortDescription: { contains: mealFilters.search, mode: "insensitive" } },
      ],
    }),
    ...(mealFilters.categoryId && { categoryId: mealFilters.categoryId }),
    ...(mealFilters.subcategory && {
      subcategory: { contains: mealFilters.subcategory, mode: "insensitive" },
    }),
    ...(mealFilters.dietary && {
      dietaryPreferences: { has: mealFilters.dietary as any },
    }),
  };

  const meals = await prisma.meal.findMany({
    where: mealWhere,
    orderBy,
    select: {
      id: true,
      name: true,
      subcategory: true,
      shortDescription: true,
      mainImageURL: true,
      basePrice: true,
      discountPrice: true,
      discountStartDate: true,
      discountEndDate: true,
      dietaryPreferences: true,
      isBestseller: true,
      isFeatured: true,
      isAvailable: true,
      preparationTimeMinutes: true,
      deliveryFee: true,
      tags: true,
      category: { select: { id: true, name: true, slug: true } },
      _count: { select: { orderItems: true } },
    },
  });

  const allMeals = await prisma.meal.findMany({
    where: { providerId: restaurantId, isActive: true, isAvailable: true },
    select: { subcategory: true, categoryId: true, category: { select: { name: true } } },
  });
  const uniqueSubcategories = [...new Set(allMeals.map((m) => m.subcategory).filter(Boolean))];
  const uniqueCategories = [
    ...new Map(allMeals.map((m) => [m.categoryId, m.category.name])).entries(),
  ].map(([id, name]) => ({ id, name }));

  return {
    restaurant: { ...provider, avgRating, reviewCount: ratings.length },
    meals,
    meta: { uniqueSubcategories, uniqueCategories, totalMeals: meals.length },
  };
};

/* ── Featured restaurants (homepage) ────────────────────────────────────── */

const getFeaturedRestaurants = async () => {
  const restaurants = await prisma.providerProfile.findMany({
    where: { approvalStatus: "APPROVED", isActive: true },
    orderBy: { totalOrdersCompleted: "desc" },
    take: 8,
    select: {
      id: true,
      businessName: true,
      businessCategory: true,
      bio: true,
      imageURL: true,
      city: true,
      totalOrdersCompleted: true,
      reviews: { select: { rating: true } },
      _count: { select: { meals: true } },
      meals: {
        where: { isActive: true, isAvailable: true },
        select: { subcategory: true },
        take: 100,
      },
    },
  });

  return restaurants.map((r) => {
    const ratings = r.reviews.map((rv) => rv.rating);
    const avgRating =
      ratings.length > 0
        ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
        : 0;
    const subcategories = [...new Set(r.meals.map((m) => m.subcategory).filter(Boolean))];
    return {
      id: r.id,
      businessName: r.businessName,
      businessCategory: r.businessCategory,
      bio: r.bio,
      imageURL: r.imageURL,
      city: r.city,
      totalOrdersCompleted: r.totalOrdersCompleted,
      reviewCount: ratings.length,
      mealCount: r._count.meals,
      avgRating,
      subcategories,
    };
  });
};

/* ── Top dishes (homepage "Signature Collection") ────────────────────────── *
 * Logic:
 *   1. Prefer isFeatured = true OR isBestseller = true meals
 *   2. From approved, active providers only
 *   3. Sort by total orderItem count descending (most ordered = top)
 *   4. Include avg rating + review count from the provider's reviews
 *      filtered to this meal's mealId
 *   5. Limit to `limit` (default 9) for 3×3 grid
 * ─────────────────────────────────────────────────────────────────────────── */

const getTopDishes = async (limit = 9) => {
  // Step 1: fetch candidates — featured or bestseller meals from approved providers
  const meals = await prisma.meal.findMany({
    where: {
      isActive: true,
      isAvailable: true,
      OR: [{ isFeatured: true }, { isBestseller: true }],
      provider: { approvalStatus: "APPROVED", isActive: true },
    },
    select: {
      id: true,
      name: true,
      shortDescription: true,
      mainImageURL: true,
      basePrice: true,
      discountPrice: true,
      discountStartDate: true,
      discountEndDate: true,
      isBestseller: true,
      isFeatured: true,
      preparationTimeMinutes: true,
      deliveryFee: true,
      subcategory: true,
      tags: true,
      category: { select: { id: true, name: true, slug: true } },
      provider: {
        select: {
          id: true,
          businessName: true,
          city: true,
          imageURL: true,
        },
      },
      reviews: {
        select: { rating: true },
      },
      _count: { select: { orderItems: true } },
    },
    orderBy: [
      // isFeatured first, then isBestseller
      { isFeatured: "desc" },
      { isBestseller: "desc" },
    ],
    take: limit * 3, // fetch more, then sort in JS by orderCount
  });

  // Step 2: enrich with avg rating and sort by order count
  const enriched = meals
    .map((m) => {
      const ratings = m.reviews.map((r) => r.rating);
      const avgRating =
        ratings.length > 0
          ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
          : 0;

      return {
        id: m.id,
        name: m.name,
        shortDescription: m.shortDescription,
        mainImageURL: m.mainImageURL,
        basePrice: m.basePrice,
        discountPrice: m.discountPrice ?? null,
        discountStartDate: m.discountStartDate?.toISOString() ?? null,
        discountEndDate: m.discountEndDate?.toISOString() ?? null,
        isBestseller: m.isBestseller,
        isFeatured: m.isFeatured,
        preparationTimeMinutes: m.preparationTimeMinutes,
        deliveryFee: m.deliveryFee,
        subcategory: m.subcategory ?? null,
        tags: m.tags,
        orderCount: m._count.orderItems,
        avgRating,
        reviewCount: ratings.length,
        category: m.category,
        provider: m.provider,
      };
    })
    .sort((a, b) => b.orderCount - a.orderCount)  // most ordered first
    .slice(0, limit);

  // Step 3: if not enough featured/bestseller meals, backfill with most ordered
  if (enriched.length < limit) {
    const existingIds = new Set(enriched.map((m) => m.id));
    const backfill = await prisma.meal.findMany({
      where: {
        isActive: true,
        isAvailable: true,
        id: { notIn: Array.from(existingIds) },
        provider: { approvalStatus: "APPROVED", isActive: true },
      },
      select: {
        id: true,
        name: true,
        shortDescription: true,
        mainImageURL: true,
        basePrice: true,
        discountPrice: true,
        discountStartDate: true,
        discountEndDate: true,
        isBestseller: true,
        isFeatured: true,
        preparationTimeMinutes: true,
        deliveryFee: true,
        subcategory: true,
        tags: true,
        category: { select: { id: true, name: true, slug: true } },
        provider: {
          select: { id: true, businessName: true, city: true, imageURL: true },
        },
        reviews: { select: { rating: true } },
        _count: { select: { orderItems: true } },
      },
      orderBy: { orderItems: { _count: "desc" } },
      take: limit - enriched.length,
    });

    for (const m of backfill) {
      const ratings = m.reviews.map((r) => r.rating);
      const avgRating =
        ratings.length > 0
          ? Math.round((ratings.reduce((a, b) => a + b, 0) / ratings.length) * 10) / 10
          : 0;
      enriched.push({
        id: m.id,
        name: m.name,
        shortDescription: m.shortDescription,
        mainImageURL: m.mainImageURL,
        basePrice: m.basePrice,
        discountPrice: m.discountPrice ?? null,
        discountStartDate: m.discountStartDate?.toISOString() ?? null,
        discountEndDate: m.discountEndDate?.toISOString() ?? null,
        isBestseller: m.isBestseller,
        isFeatured: m.isFeatured,
        preparationTimeMinutes: m.preparationTimeMinutes,
        deliveryFee: m.deliveryFee,
        subcategory: m.subcategory ?? null,
        tags: m.tags,
        orderCount: m._count.orderItems,
        avgRating,
        reviewCount: ratings.length,
        category: m.category,
        provider: m.provider,
      });
    }
  }

  return enriched;
};

/* ── Homepage testimonials ───────────────────────────────────────────────── *
 * Logic:
 *   - Reviews with rating >= 4 AND non-empty feedback
 *   - From approved providers only
 *   - Order by rating desc, then createdAt desc (newest 5-stars first)
 *   - Include meal name and provider name for context
 *   - Deduplicate by user (one review per user shown)
 * ─────────────────────────────────────────────────────────────────────────── */

const getHomeTestimonials = async (limit = 9) => {
  const reviews = await prisma.review.findMany({
    where: {
      rating: { gte: 4 },
      feedback: { not: null, notIn: ["", " "] },
      provider: { approvalStatus: "APPROVED", isActive: true },
    },
    orderBy: [{ rating: "desc" }, { createdAt: "desc" }],
    take: limit * 3, // fetch more, deduplicate by user
    select: {
      id: true,
      rating: true,
      feedback: true,
      createdAt: true,
      user: { select: { name: true, image: true } },
      meal: { select: { name: true } },
      provider: { select: { businessName: true, city: true } },
    },
  });

  // Deduplicate: one review per userId (keep highest-rated)
  const seen = new Set<string>();
  const deduped = reviews.filter((r) => {
    // Use user name as proxy since userId isn't in the select
    const key = r.user.name;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return deduped.slice(0, limit).map((r) => ({
    id: r.id,
    rating: r.rating,
    feedback: r.feedback!,
    createdAt: r.createdAt.toISOString(),
    user: { name: r.user.name, image: r.user.image ?? null },
    meal: { name: r.meal.name },
    provider: {
      businessName: r.provider.businessName,
      city: r.provider.city,
    },
  }));
};

export const PublicService = {
  getCategories,
  getRestaurants,
  getRestaurantById,
  getFeaturedRestaurants,
  getTopDishes,
  getHomeTestimonials,
};