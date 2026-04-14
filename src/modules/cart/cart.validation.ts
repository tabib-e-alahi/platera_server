import { z } from "zod";

export const addCartItemSchema = z.object({
  mealId: z.uuid("Valid mealId is required."),
  quantity: z.number().int().min(1).max(20).default(1),
});

export const updateCartItemQuantitySchema = z.object({
  quantity: z.number().int().min(1).max(20),
});

export type TAddCartItem = z.infer<typeof addCartItemSchema>;
export type TUpdateCartItemQuantity = z.infer<typeof updateCartItemQuantitySchema>;