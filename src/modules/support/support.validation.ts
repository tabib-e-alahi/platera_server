// src/modules/support/support.validation.ts

import { z } from "zod";

export const createSupportMessageSchema = z.object({
  name: z
    .string()
    .min(2, "Name must be at least 2 characters.")
    .max(80, "Name cannot exceed 80 characters."),
  email: z
    .string()
    .email("Please provide a valid email address.")
    .max(150, "Email cannot exceed 150 characters."),
  subject: z
    .string()
    .max(150, "Subject cannot exceed 150 characters.")
    .optional(),
  category: z.enum(
    ["ORDER", "REFUND", "PROVIDER", "ACCOUNT", "PARTNERSHIP", "OTHER"],
    { error: "Please select a valid category." }
  ),
  message: z
    .string()
    .min(10, "Message must be at least 10 characters.")
    .max(1000, "Message cannot exceed 1000 characters."),
});

export const supportMessageListQuerySchema = z.object({
  page:     z.coerce.number().int().min(1).default(1),
  limit:    z.coerce.number().int().min(1).max(50).default(20),
  status:   z.enum(["UNREAD", "READ", "RESOLVED"]).optional(),
  category: z
    .enum(["ORDER", "REFUND", "PROVIDER", "ACCOUNT", "PARTNERSHIP", "OTHER"])
    .optional(),
  search:   z.string().optional(),
});

export const updateSupportMessageStatusSchema = z.object({
  status: z.enum(["UNREAD", "READ", "RESOLVED"]),
  note:   z.string().max(500).optional(),
});

export type TCreateSupportMessage     = z.infer<typeof createSupportMessageSchema>;
export type TSupportMessageListQuery  = z.infer<typeof supportMessageListQuerySchema>;
export type TUpdateSupportMessageStatus = z.infer<typeof updateSupportMessageStatusSchema>;
