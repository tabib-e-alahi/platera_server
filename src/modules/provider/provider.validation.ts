// src/modules/provider/provider.validation.ts

import { z } from "zod";

export const createProviderProfileSchema = z
  .object({
    businessName: z
      .string()
      .min(1, "Business name is required.")
      .min(2, "Business name must be at least 2 characters.")
      .max(100, "Business name cannot exceed 100 characters."),

    businessCategory: z.enum(
      ["RESTAURANT", "SHOP", "HOME_KITCHEN", "STREET_FOOD"],
      {
        error: "Business category is required and must be one of: RESTAURANT, SHOP, HOME_KITCHEN, STREET_FOOD.",
      }
    ),

    phone: z
      .string()
      .min(1, "Phone number is required.")
      .min(10, "Phone number must be at least 10 digits.")
      .max(15, "Phone number cannot exceed 15 digits.")
      .regex(/^[0-9+\-\s()]+$/, "Please provide a valid phone number."),

    bio: z
      .string()
      .max(500, "Bio cannot exceed 500 characters.")
      .nullish(),

    binNumber: z
      .string()
      .nullish(),

    city: z
      .string()
      .min(1, "City is required.")
      .min(2, "City must be at least 2 characters."),

    street: z
      .string()
      .min(1, "Street is required.")
      .min(2, "Street must be at least 2 characters."),

    houseNumber: z
      .string()
      .min(1, "House number is required."),

    apartment: z
      .string()
      .nullish(),

    postalCode: z
      .string()
      .min(1, "Postal code is required.")
      .min(4, "Postal code must be at least 4 characters."),
  })
  .refine(
    (data) => {
      if (data.businessCategory === "RESTAURANT") {
        return (
          !!data.binNumber && data.binNumber.trim().length > 0
        );
      }
      return true;
    },
    {
      message:
        "BIN/Tax number is mandatory for Restaurant category.",
      path: ["binNumber"],
    }
  );

export const updateProviderProfileSchema = z
  .object({
    businessName: z
      .string()
      .min(2, "Business name must be at least 2 characters.")
      .max(100, "Business name cannot exceed 100 characters.")
      .nullish(),

    businessCategory: z
      .enum(["RESTAURANT", "SHOP", "HOME_KITCHEN", "STREET_FOOD"])
      .nullish(),

    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits.")
      .max(15, "Phone number cannot exceed 15 digits.")
      .regex(/^[0-9+\-\s()]+$/, "Please provide a valid phone number.")
      .nullish(),

    bio: z
      .string()
      .max(500, "Bio cannot exceed 500 characters.")
      .nullish(),

    binNumber: z
      .string()
      .nullish(),

    city: z
      .string()
      .min(2, "City must be at least 2 characters.")
      .nullish(),

    street: z
      .string()
      .min(2, "Street must be at least 2 characters.")
      .nullish(),

    houseNumber: z
      .string()
      .min(1, "House number is required.")
      .nullish(),

    apartment: z
      .string()
      .nullish(),

    postalCode: z
      .string()
      .min(4, "Postal code must be at least 4 characters.")
      .nullish(),
  })
  .refine(
    (data) => {
      if (data.businessCategory === "RESTAURANT") {
        return (
          !!data.binNumber && data.binNumber.trim().length > 0
        );
      }
      return true;
    },
    {
      message:
        "BIN/Tax number is mandatory for Restaurant category.",
      path: ["binNumber"],
    }
  );

export const deleteImageSchema = z.object({
  imageType: z.enum(
    [
      "nidImageFront",
      "nidImageBack",
      "businessMainGate",
      "businessKitchen",
      "profileImage",
    ],
    {
      error:
        "imageType must be one of: nidImageFront, nidImageBack, businessMainGate, businessKitchen, profileImage.",
    }
  ),
});

export const rejectProviderSchema = z.object({
  rejectionReason: z
    .string()
    .min(1, "Rejection reason is required.")
    .min(10, "Please provide a meaningful rejection reason."),
});

// inferred types for use in services and controllers
export type TCreateProviderProfile = z.infer<typeof createProviderProfileSchema>;
export type TUpdateProviderProfile = z.infer<typeof updateProviderProfileSchema>;

export type TDeleteImage = z.infer<typeof deleteImageSchema>;
export type TRejectProvider = z.infer<typeof rejectProviderSchema>;