// src/modules/meal/meal.validation.ts

import { z } from "zod";

const mealSizeSchema = z.object({
  name: z
    .string()
    .min(1, "Size name is required.")
    .max(30, "Size name too long."),
  extraPrice: z.coerce
    .number()
    .int("Extra price must be a whole number.")
    .min(0, "Extra price cannot be negative.")
    .default(0),
  isDefault: z.boolean().default(false),
});

const mealSpiceLevelSchema = z.object({
  level: z
    .string()
    .min(1, "Spice level name is required.")
    .max(30, "Spice level name too long."),
  isDefault: z.boolean().default(false),
});

const mealAddOnSchema = z.object({
  name: z
    .string()
    .min(1, "Add-on name is required.")
    .max(50, "Add-on name too long."),
  price: z.coerce
    .number()
    .int("Price must be a whole number.")
    .min(1, "Add-on price must be at least 1."),
});

const mealRemoveOptionSchema = z.object({
  name: z
    .string()
    .min(1, "Remove option name is required.")
    .max(50, "Remove option name too long."),
});

const mealIngredientSchema = z.object({
  name: z
    .string()
    .min(1, "Ingredient name is required.")
    .max(100, "Ingredient name too long."),
});

export const createMealSchema = z
  .object({
    categoryId: z.uuid("Invalid category ID."),

    name: z
      .string()
      .min(1, "Meal name is required.")
      .min(2, "Meal name must be at least 2 characters.")
      .max(100, "Meal name cannot exceed 100 characters."),

    subcategory: z
      .string()
      .max(50, "Subcategory cannot exceed 50 characters.")
      .nullish(),

    shortDescription: z
      .string()
      .min(1, "Short description is required.")
      .min(10, "Short description must be at least 10 characters.")
      .max(200, "Short description cannot exceed 200 characters."),

    fullDescription: z
      .string()
      .max(2000, "Full description cannot exceed 2000 characters.")
      .nullish(),

    portionSize: z
      .string()
      .max(50, "Portion size cannot exceed 50 characters.")
      .nullish(),

    basePrice: z.coerce
      .number()
      .int("Base price must be a whole number.")
      .min(1, "Base price must be at least 1 BDT."),

    discountPrice: z.coerce
      .number()
      .int("Discount price must be a whole number.")
      .min(0, "Discount price cannot be negative.")
      .nullish(),

    dietaryPreferences: z
      .array(
        z.enum([
          "VEGAN",
          "VEGETARIAN",
          "HALAL",
          "GLUTEN_FREE",
          "DAIRY_FREE",
          "NUT_FREE",
          "ORGANIC",
          "LOW_CARB",
          "KETO",
          "PALEO",
          "LOW_FAT",
          "HIGH_PROTEIN",
          "LOW_SUGAR",
          "SUGAR_FREE",
          "FODMAP_FREE",
        ])
      )
      .default([]),

    allergens: z
      .array(z.string().min(1).max(50))
      .default([]),

    // nutrition — all optional
    calories: z.coerce
      .number()
      .int()
      .min(0)
      .nullish(),
    protein: z.coerce.number().min(0).nullish(),
    fat: z.coerce.number().min(0).nullish(),
    carbohydrates: z.coerce.number().min(0).nullish(),

    preparationTimeMinutes: z.coerce
      .number()
      .int()
      .min(1, "Preparation time must be at least 1 minute.")
      .max(180, "Preparation time cannot exceed 180 minutes.")
      .default(15),

    deliveryFee: z.coerce
      .number()
      .int()
      .min(0)
      .default(0),

    tags: z
      .array(z.string().min(1).max(30))
      .max(10, "Cannot have more than 10 tags.")
      .default([]),

    // customization
    sizes: z
      .array(mealSizeSchema)
      .max(5, "Cannot have more than 5 size options.")
      .default([]),

    spiceLevels: z
      .array(mealSpiceLevelSchema)
      .max(5, "Cannot have more than 5 spice levels.")
      .default([]),

    addOns: z
      .array(mealAddOnSchema)
      .max(10, "Cannot have more than 10 add-ons.")
      .default([]),

    removeOptions: z
      .array(mealRemoveOptionSchema)
      .max(10, "Cannot have more than 10 remove options.")
      .default([]),

    ingredients: z
      .array(mealIngredientSchema)
      .max(30, "Cannot have more than 30 ingredients.")
      .default([]),
  })
  .refine(
    (data) => {
      if (
        data.discountPrice !== null &&
        data.discountPrice !== undefined &&
        data.discountPrice >= data.basePrice
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Discount price must be less than base price.",
      path: ["discountPrice"],
    }
  )
  .refine(
    (data) => {
      // if sizes exist, exactly one must be default
      if (data.sizes.length > 0) {
        const defaultCount = data.sizes.filter(
          (s) => s.isDefault
        ).length;
        return defaultCount === 1;
      }
      return true;
    },
    {
      message:
        "Exactly one size must be marked as default when sizes are provided.",
      path: ["sizes"],
    }
  )
  .refine(
    (data) => {
      if (data.spiceLevels.length > 0) {
        const defaultCount = data.spiceLevels.filter(
          (s) => s.isDefault
        ).length;
        return defaultCount === 1;
      }
      return true;
    },
    {
      message:
        "Exactly one spice level must be marked as default when spice levels are provided.",
      path: ["spiceLevels"],
    }
  );

export const updateMealSchema = z
  .object({
    categoryId: z.uuid("Invalid category ID.").optional(),
    name: z.string().min(2).max(100).optional(),
    subcategory: z.string().max(50).nullish(),
    shortDescription: z.string().min(10).max(200).optional(),
    fullDescription: z.string().max(2000).nullish(),
    portionSize: z.string().max(50).nullish(),
    basePrice: z.coerce.number().int().min(1).optional(),
    discountPrice: z.coerce.number().int().min(0).nullish(),
    dietaryPreferences: z
      .array(
        z.enum([
          "VEGAN",
          "VEGETARIAN",
          "HALAL",
          "GLUTEN_FREE",
          "DAIRY_FREE",
          "NUT_FREE",
        ])
      )
      .optional(),
    allergens: z.array(z.string().min(1).max(50)).optional(),
    calories: z.coerce.number().int().min(0).nullish(),
    protein: z.coerce.number().min(0).nullish(),
    fat: z.coerce.number().min(0).nullish(),
    carbohydrates: z.coerce.number().min(0).nullish(),
    preparationTimeMinutes: z.coerce.number().int().min(1).max(180).optional(),
    deliveryFee: z.coerce.number().int().min(0).optional(),
    tags: z.array(z.string().min(1).max(30)).max(10).optional(),
    isAvailable: z.boolean().optional(),
    sizes: z.array(mealSizeSchema).max(5).optional(),
    spiceLevels: z.array(mealSpiceLevelSchema).max(5).optional(),
    addOns: z.array(mealAddOnSchema).max(10).optional(),
    removeOptions: z.array(mealRemoveOptionSchema).max(10).optional(),
    ingredients: z.array(mealIngredientSchema).max(30).optional(),
  })
  .refine(
    (data) => {
      if (
        data.discountPrice !== null &&
        data.discountPrice !== undefined &&
        data.basePrice !== undefined &&
        data.discountPrice >= data.basePrice
      ) {
        return false;
      }
      return true;
    },
    {
      message: "Discount price must be less than base price.",
      path: ["discountPrice"],
    }
  );

export const toggleAvailabilitySchema = z.object({
  isAvailable: z.boolean({
    error: "isAvailable must be a boolean.",
  }),
});

export type TCreateMeal = z.infer<typeof createMealSchema>;
export type TUpdateMeal = z.infer<typeof updateMealSchema>;
export type TToggleAvailability = z.infer<typeof toggleAvailabilitySchema>;