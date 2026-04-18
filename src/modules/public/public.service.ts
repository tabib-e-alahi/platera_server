import { Prisma } from "../../../generated/prisma/client";
import { prisma } from "../../lib/prisma"

const getCategories = async () => {
  const result = await prisma.category.findMany({
    where: {
      isActive: {
        not: false
      }
    },
    orderBy: { displayOrder: "asc" },
  });

  return result
}

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

  return { data: enriched, meta: { total, page, limit, totalPages: Math.ceil(total / limit) } };
};

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
          user: {
            select: {
              name: true,
              image: true
            },
          }
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
    case "price_asc": orderBy = { basePrice: "asc" }; break;
    case "price_desc": orderBy = { basePrice: "desc" }; break;
    case "popular": orderBy = { isBestseller: "desc" }; break;
    default: orderBy = { createdAt: "desc" };
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
      id: r.id, businessName: r.businessName, businessCategory: r.businessCategory,
      bio: r.bio, imageURL: r.imageURL, city: r.city,
      totalOrdersCompleted: r.totalOrdersCompleted,
      reviewCount: ratings.length, mealCount: r._count.meals, avgRating, subcategories,
    };
  });
};

export const PublicService = {
  getCategories, getRestaurants, getRestaurantById, getFeaturedRestaurants,
};
