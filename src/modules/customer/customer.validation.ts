import { z } from "zod";

const emptyToUndefined = (value: unknown) => {
  if (typeof value === "string" && value.trim() === "") {
    return undefined;
  }
  return value;
};

export const createCustomerProfileSchema = z.object({
  phone: z
    .preprocess(emptyToUndefined, z.string()
      .min(8, "Phone number must be at least 8 digits.")
      .max(14, "Phone number cannot exceed 14 digits.")
      .regex(/^[0-9+\-\s()]+$/, "Please provide a valid phone number.")),

  city: z
    .string()
    .trim()
    .min(2, "City is required and must be at least 2 characters."),

  streetAddress: z
    .string()
    .trim()
    .min(3, "Street address is required."),

  houseNumber: z
    .preprocess(emptyToUndefined, z.string().trim().min(1, "House number is required")),

  apartment: z
    .preprocess(emptyToUndefined, z.string().trim().optional()),

  postalCode: z
    .preprocess(emptyToUndefined, z.string().trim()),

  latitude: z
    .preprocess(
      (value) => (value === "" || value === undefined || value === null ? undefined : Number(value)),
      z.number().min(-90).max(90).optional()
    ),

  longitude: z
    .preprocess(
      (value) => (value === "" || value === undefined || value === null ? undefined : Number(value)),
      z.number().min(-180).max(180).optional()
    ),
});

export const updateCustomerProfileSchema = z.object({
  phone: z
    .preprocess(emptyToUndefined, z.string()
      .min(8, "Phone number must be at least 8 digits.")
      .max(14, "Phone number cannot exceed 14 digits.")
      .regex(/^[0-9+\-\s()]+$/, "Please provide a valid phone number.")
      .optional()),

  city: z
    .string()
    .trim()
    .min(2, "City must be at least 2 characters.")
    .optional(),

  streetAddress: z
    .string()
    .trim()
    .min(3, "Street address must be at least 3 characters.")
    .optional(),

  houseNumber: z
    .preprocess(emptyToUndefined, z.string().trim().optional()),

  apartment: z
    .preprocess(emptyToUndefined, z.string().trim().optional()),

  postalCode: z
    .preprocess(emptyToUndefined, z.string().trim().optional()),

  latitude: z
    .preprocess(
      (value) => (value === "" || value === undefined || value === null ? undefined : Number(value)),
      z.number().min(-90).max(90).optional()
    ),

  longitude: z
    .preprocess(
      (value) => (value === "" || value === undefined || value === null ? undefined : Number(value)),
      z.number().min(-180).max(180).optional()
    ),
});

export type TCreateCustomerProfile = z.infer<typeof createCustomerProfileSchema>;
export type TUpdateCustomerProfile = z.infer<typeof updateCustomerProfileSchema>;