// src/modules/provider/provider.validation.ts

import { z } from "zod";

export const providerRegisterSchema = z.object({
  name: z
    .string("Name is required.")
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name cannot exceed 50 characters."),
  email: z.email("Please provide a valid email address."),
  password: z
    .string("Password is required.")
    .min(8, "Password must be at least 8 characters.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must contain uppercase, lowercase, number and special character."
    ),
});

export const createProviderProfileSchema = z
  .object({
    businessName: z
      .string("Business name is required.")
      .min(2, "Business name must be at least 2 characters.")
      .max(100, "Business name cannot exceed 100 characters."),
    businessCategory: z.enum(
      ["RESTAURANT", "SHOP", "HOME_KITCHEN", "STREET_FOOD"],
      { message: "Business category is required." }
    ),
    phone: z
      .string("Phone number is required.")
      .min(10, "Phone number must be at least 10 digits.")
      .max(15, "Phone number cannot exceed 15 digits."),
    bio: z
      .string()
      .max(500, "Bio cannot exceed 500 characters.")
      .optional(),
    binNumber: z.string().optional(),
    city: z
      .string("City is required.")
      .min(2, "City must be at least 2 characters."),
    street: z
      .string("Street is required.")
      .min(2, "Street must be at least 2 characters."),
    houseNumber: z
      .string("House number is required.")
      .min(1, "House number is required."),
    apartment: z.string().optional(),
    postalCode: z
      .string("Postal code is required.")
      .min(4, "Postal code must be at least 4 characters."),
  })
  .refine(
    (data) => {
      if (data.businessCategory === "RESTAURANT") {
        return !!data.binNumber && data.binNumber.trim().length > 0;
      }
      return true;
    },
    {
      message: "BIN/Tax number is mandatory for Restaurant category.",
      path: ["binNumber"],
    }
  );

export const updateProviderProfileSchema = z
  .object({
    businessName: z
      .string()
      .min(2, "Business name must be at least 2 characters.")
      .max(100, "Business name cannot exceed 100 characters.")
      .optional(),
    businessCategory: z
      .enum(["RESTAURANT", "SHOP", "HOME_KITCHEN", "STREET_FOOD"])
      .optional(),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 digits.")
      .max(15, "Phone number cannot exceed 15 digits.")
      .optional(),
    bio: z
      .string()
      .max(500, "Bio cannot exceed 500 characters.")
      .optional(),
    binNumber: z.string().optional(),
    city: z.string().min(2).optional(),
    street: z.string().min(2).optional(),
    houseNumber: z.string().min(1).optional(),
    apartment: z.string().optional(),
    postalCode: z.string().min(4).optional(),
  })
  .refine(
    (data) => {
      if (data.businessCategory === "RESTAURANT") {
        return !!data.binNumber && data.binNumber.trim().length > 0;
      }
      return true;
    },
    {
      message: "BIN/Tax number is mandatory for Restaurant category.",
      path: ["binNumber"],
    }
  );

export const rejectProviderSchema = z.object({
  rejectionReason: z
    .string({ message: "Rejection reason is required." })
    .min(10, "Please provide a meaningful rejection reason."),
});