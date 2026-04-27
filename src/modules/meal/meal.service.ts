import { prisma } from "../../lib/prisma";
import {
  BadRequestError,
  ForbiddenError,
  NotFoundError,
} from "../../errors/AppError";
import { TCreateMeal, TUpdateMeal } from "./meal.validation";
import { Prisma } from "../../../generated/prisma/client";
import { deleteFromCloudinary, deleteMultipleFromCloudinary } from "../../utils/claudinary";
import { IMealUploadedImages } from "../../utils/extractFiles";
import { getProviderProfile } from "../../helpers/getProviderProfile";
import { getMealOwnership } from "../../helpers/getMealOwnership";


const getMyMeals = async (
  userId: string,
  filters: {
    isAvailable?: boolean;
    categoryId?: string;
    page: number;
    limit: number;
    search?: string;
  }
) => {
  const profile = await getProviderProfile(userId);
  const skip = (filters.page - 1) * filters.limit;

  const where: Prisma.MealWhereInput = {
    providerId: profile.id,
    isActive: true,
    ...(filters.isAvailable !== undefined && {
      isAvailable: filters.isAvailable,
    }),
    ...(filters.categoryId && {
      categoryId: filters.categoryId,
    }),
    ...(filters.search && {
      OR: [
        {
          name: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
        {
          shortDescription: {
            contains: filters.search,
            mode: "insensitive",
          },
        },
      ],
    }),
  };

  const [meals, total] = await Promise.all([
    prisma.meal.findMany({
      where,
      include: {
        category: { select: { id: true, name: true } },
        sizes: true,
        spiceLevels: true,
        addOns: true,
        removeOptions: true,
        ingredients: true,
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: filters.limit,
    }),
    prisma.meal.count({ where }),
  ]);

  return {
    meals,
    pagination: {
      total,
      page: filters.page,
      limit: filters.limit,
      totalPages: Math.ceil(total / filters.limit),
    },
  };
};


const getMyMealById = async (
  mealId: string,
  userId: string
) => {
  const profile = await getProviderProfile(userId);

  const meal = await prisma.meal.findUnique({
    where: { id: mealId, providerId: profile.id },
    include: {
      category: true,
      sizes: true,
      spiceLevels: true,
      addOns: true,
      removeOptions: true,
      ingredients: true,
    },
  });

  if (!meal) {
    throw new NotFoundError("Meal not found.");
  }

  return meal;
};


const createMeal = async (
  userId: string,
  payload: TCreateMeal,
  images: IMealUploadedImages
) => {
  const profile = await getProviderProfile(userId);

  // main image is required
  if (!images.mainImageURL) {
    throw new BadRequestError(
      "Main meal image is required."
    );
  }

  // verify category exists and is active
  const category = await prisma.category.findUnique({
    where: { id: payload.categoryId, isActive: true },
    select: { id: true },
  });

  if (!category) {
    await deleteMultipleFromCloudinary([
      images.mainImageURL,
      ...(images.galleryImageURLs ?? []),
    ]);
    throw new NotFoundError(
      "Selected category not found or is inactive."
    );
  }

  const meal = await prisma.$transaction(async (tx) => {
    // create the meal first
    const createdMeal = await tx.meal.create({
      data: {
        providerId: profile.id,
        categoryId: payload.categoryId,
        name: payload.name,
        subcategory: payload.subcategory ?? null,
        shortDescription: payload.shortDescription,
        fullDescription: payload.fullDescription ?? null,
        portionSize: payload.portionSize ?? null,
        mainImageURL: images.mainImageURL!,
        galleryImageURLs: images.galleryImageURLs ?? [],
        basePrice: payload.basePrice,
        discountPrice: payload.discountPrice ?? null,
        discountStartDate: payload.discountStartDate
          ? new Date(payload.discountStartDate)
          : null,
        discountEndDate: payload.discountEndDate
          ? new Date(payload.discountEndDate)
          : null,
        dietaryPreferences: payload.dietaryPreferences,
        allergens: payload.allergens,
        calories: payload.calories ?? null,
        protein: payload.protein ?? null,
        fat: payload.fat ?? null,
        carbohydrates: payload.carbohydrates ?? null,
        preparationTimeMinutes: payload.preparationTimeMinutes,
        deliveryFee: payload.deliveryFee,
        tags: payload.tags,
      },
    });

    // create related customization records
    if (payload.sizes.length > 0) {
      await tx.mealSize.createMany({
        data: payload.sizes.map((s) => ({
          mealId: createdMeal.id,
          name: s.name,
          extraPrice: s.extraPrice,
          isDefault: s.isDefault,
        })),
      });
    }

    if (payload.spiceLevels.length > 0) {
      await tx.mealSpiceLevel.createMany({
        data: payload.spiceLevels.map((s) => ({
          mealId: createdMeal.id,
          level: s.level,
          isDefault: s.isDefault,
        })),
      });
    }

    if (payload.addOns.length > 0) {
      await tx.mealAddOn.createMany({
        data: payload.addOns.map((a) => ({
          mealId: createdMeal.id,
          name: a.name,
          price: a.price,
        })),
      });
    }

    if (payload.removeOptions.length > 0) {
      await tx.mealRemoveOption.createMany({
        data: payload.removeOptions.map((r) => ({
          mealId: createdMeal.id,
          name: r.name,
        })),
      });
    }

    if (payload.ingredients.length > 0) {
      await tx.mealIngredient.createMany({
        data: payload.ingredients.map((i) => ({
          mealId: createdMeal.id,
          name: i.name,
        })),
      });
    }

    return createdMeal;
  });

  // return full meal with relations
  return prisma.meal.findUnique({
    where: { id: meal.id },
    include: {
      category: true,
      sizes: true,
      spiceLevels: true,
      addOns: true,
      removeOptions: true,
      ingredients: true,
    },
  });
};



const updateMeal = async (
  mealId: string,
  userId: string,
  payload: TUpdateMeal,
  newImages: IMealUploadedImages
) => {
  const profile = await getProviderProfile(userId);

  if (payload.categoryId) {
    const category = await prisma.category.findUnique({
      where: { id: payload.categoryId, isActive: true },
      select: { id: true },
    });

    if (!category) {
      await deleteMultipleFromCloudinary([
        ...(newImages.mainImageURL ? [newImages.mainImageURL] : []),
        ...(newImages.galleryImageURLs ?? []),
      ]);
      throw new NotFoundError(
        "Selected category not found or is inactive."
      );
    }
  }

  const existingMeal = await prisma.meal.findUnique({
    where: { id: mealId, providerId: profile.id },
    select: {
      mainImageURL: true,
      galleryImageURLs: true,
    },
  });

  if (!existingMeal) {
    throw new NotFoundError("Meal not found.");
  }

  const imageUpdateData: Record<string, unknown> = {};

  // replace main image
  if (newImages.mainImageURL) {
    await deleteFromCloudinary(existingMeal.mainImageURL);
    imageUpdateData.mainImageURL = newImages.mainImageURL;
  }

  // replace gallery — full replacement, not append
  if (newImages.galleryImageURLs && newImages.galleryImageURLs.length > 0) {
    await deleteMultipleFromCloudinary(existingMeal.galleryImageURLs);
    imageUpdateData.galleryImageURLs = newImages.galleryImageURLs;
  }

  const updateData: Record<string, unknown> = {
    ...imageUpdateData,
  };

  // text fields — only include if present
  if (payload.categoryId !== undefined) {
    updateData.categoryId = payload.categoryId;
  }
  if (payload.name !== undefined) updateData.name = payload.name;
  if (payload.subcategory !== undefined) {
    updateData.subcategory = payload.subcategory ?? null;
  }
  if (payload.shortDescription !== undefined) {
    updateData.shortDescription = payload.shortDescription;
  }
  if (payload.fullDescription !== undefined) {
    updateData.fullDescription = payload.fullDescription ?? null;
  }
  if (payload.portionSize !== undefined) {
    updateData.portionSize = payload.portionSize ?? null;
  }
  if (payload.basePrice !== undefined) {
    updateData.basePrice = payload.basePrice;
  }
  if (payload.discountPrice !== undefined) {
    updateData.discountPrice = payload.discountPrice ?? null;
  }
  if (payload.discountStartDate !== undefined) {
    updateData.discountStartDate = payload.discountStartDate
      ? new Date(payload.discountStartDate)
      : null;
  }
  if (payload.discountEndDate !== undefined) {
    updateData.discountEndDate = payload.discountEndDate
      ? new Date(payload.discountEndDate)
      : null;
  }
  if (payload.dietaryPreferences !== undefined) {
    updateData.dietaryPreferences = payload.dietaryPreferences;
  }
  if (payload.allergens !== undefined) {
    updateData.allergens = payload.allergens;
  }
  if (payload.calories !== undefined) {
    updateData.calories = payload.calories ?? null;
  }
  if (payload.protein !== undefined) {
    updateData.protein = payload.protein ?? null;
  }
  if (payload.fat !== undefined) {
    updateData.fat = payload.fat ?? null;
  }
  if (payload.carbohydrates !== undefined) {
    updateData.carbohydrates = payload.carbohydrates ?? null;
  }
  if (payload.preparationTimeMinutes !== undefined) {
    updateData.preparationTimeMinutes = payload.preparationTimeMinutes;
  }
  if (payload.deliveryFee !== undefined) {
    updateData.deliveryFee = payload.deliveryFee;
  }
  if (payload.tags !== undefined) {
    updateData.tags = payload.tags;
  }
  if (payload.isAvailable !== undefined) {
    updateData.isAvailable = payload.isAvailable;
  }

  // update the meal and replace customization in a transaction
  await prisma.$transaction(async (tx) => {
    await tx.meal.update({
      where: { id: mealId },
      data: updateData,
    });

    // for customization — full replacement strategy
    // delete all existing then recreate
    // simpler than diffing individual records

    if (payload.sizes !== undefined) {
      await tx.mealSize.deleteMany({ where: { mealId } });
      if (payload.sizes.length > 0) {
        await tx.mealSize.createMany({
          data: payload.sizes.map((s) => ({
            mealId,
            name: s.name,
            extraPrice: s.extraPrice,
            isDefault: s.isDefault,
          })),
        });
      }
    }

    if (payload.spiceLevels !== undefined) {
      await tx.mealSpiceLevel.deleteMany({ where: { mealId } });
      if (payload.spiceLevels.length > 0) {
        await tx.mealSpiceLevel.createMany({
          data: payload.spiceLevels.map((s) => ({
            mealId,
            level: s.level,
            isDefault: s.isDefault,
          })),
        });
      }
    }

    if (payload.addOns !== undefined) {
      await tx.mealAddOn.deleteMany({ where: { mealId } });
      if (payload.addOns.length > 0) {
        await tx.mealAddOn.createMany({
          data: payload.addOns.map((a) => ({
            mealId,
            name: a.name,
            price: a.price,
          })),
        });
      }
    }

    if (payload.removeOptions !== undefined) {
      await tx.mealRemoveOption.deleteMany({ where: { mealId } });
      if (payload.removeOptions.length > 0) {
        await tx.mealRemoveOption.createMany({
          data: payload.removeOptions.map((r) => ({
            mealId,
            name: r.name,
          })),
        });
      }
    }

    if (payload.ingredients !== undefined) {
      await tx.mealIngredient.deleteMany({ where: { mealId } });
      if (payload.ingredients.length > 0) {
        await tx.mealIngredient.createMany({
          data: payload.ingredients.map((i) => ({
            mealId,
            name: i.name,
          })),
        });
      }
    }
  });

  return prisma.meal.findUnique({
    where: { id: mealId },
    include: {
      category: true,
      sizes: true,
      spiceLevels: true,
      addOns: true,
      removeOptions: true,
      ingredients: true,
    },
  });
};

// ─── Toggle availability ──────────────────────────────────────────────────────

const toggleAvailability = async (
  mealId: string,
  userId: string,
  isAvailable: boolean
) => {
  const profile = await getProviderProfile(userId);
  await getMealOwnership(mealId, profile.id);

  const updated = await prisma.meal.update({
    where: { id: mealId },
    data: { isAvailable },
    select: {
      id: true,
      name: true,
      isAvailable: true,
    },
  });

  return updated;
};

// ─── Delete meal ──────────────────────────────────────────────────────────────

const deleteMeal = async (
  mealId: string,
  userId: string
) => {
  const profile = await getProviderProfile(userId);
  await getMealOwnership(mealId, profile.id);

  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
    select: {
      mainImageURL: true,
      galleryImageURLs: true,
    },
  });

  if (!meal) throw new NotFoundError("Meal not found.");

  // soft delete — set isActive false
  await prisma.meal.update({
    where: { id: mealId },
    data: { isActive: false },
  });

  // delete images from Cloudinary
  await deleteFromCloudinary(meal.mainImageURL);
  await deleteMultipleFromCloudinary(meal.galleryImageURLs);
};

// ─── Delete gallery image ─────────────────────────────────────────────────────

const deleteGalleryImage = async (
  mealId: string,
  userId: string,
  imageURL: string
) => {
  const profile = await getProviderProfile(userId);
  await getMealOwnership(mealId, profile.id);

  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
    select: { galleryImageURLs: true },
  });

  if (!meal) throw new NotFoundError("Meal not found.");

  if (!meal.galleryImageURLs.includes(imageURL)) {
    throw new NotFoundError(
      "Image not found in gallery."
    );
  }

  await deleteFromCloudinary(imageURL);

  const updatedGallery = meal.galleryImageURLs.filter(
    (url) => url !== imageURL
  );

  const updated = await prisma.meal.update({
    where: { id: mealId },
    data: { galleryImageURLs: updatedGallery },
    select: {
      id: true,
      galleryImageURLs: true,
    },
  });

  return updated;
};

export const MealService = {
  getMyMeals,
  getMyMealById,
  createMeal,
  updateMeal,
  toggleAvailability,
  deleteMeal,
  deleteGalleryImage,
};