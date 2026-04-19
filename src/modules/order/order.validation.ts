import { z } from "zod";

export const checkoutPreviewSchema = z.object({
  customerName: z.string().trim().min(2, "Customer name is required."),
  customerPhone: z.string().trim().min(8, "Phone number is required."),
  deliveryStreetAddress: z.string().trim().min(3, "Street address is required."),
  deliveryHouseNumber: z.string().trim().optional(),
  deliveryApartment: z.string().trim().optional(),
  deliveryPostalCode: z.string().trim().optional(),
  deliveryNote: z.string().trim().max(300, "Note cannot exceed 300 characters.").optional(),
});

export const createOrderSchema = z.object({
  customerName: z.string().trim().min(2, "Customer name is required."),
  customerPhone: z.string().trim().min(8, "Phone number is required."),
  deliveryStreetAddress: z.string().trim().min(3, "Street address is required."),
  deliveryHouseNumber: z.string().trim().optional(),
  deliveryApartment: z.string().trim().optional(),
  deliveryPostalCode: z.string().trim().optional(),
  deliveryNote: z.string().trim().max(300, "Note cannot exceed 300 characters.").optional(),
  paymentMethod: z.enum(["ONLINE", "COD"]),
});

export type TCheckoutPreviewPayload = z.infer<typeof checkoutPreviewSchema>;
export type TCreateOrderPayload = z.infer<typeof createOrderSchema>;