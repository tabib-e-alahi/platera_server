// src/modules/admin/admin.validation.ts

import { z } from "zod";

export const rejectProviderSchema = z.object({
  rejectionReason: z
    .string()
    .min(1, "Rejection reason is required.")
    .min(10, "Please provide a meaningful rejection reason.")
    .max(500, "Rejection reason cannot exceed 500 characters."),
});

export const createAdminSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required.")
    .min(2, "Name must be at least 2 characters.")
    .max(50, "Name cannot exceed 50 characters."),
  email: z
    .string()
    .min(1, "Email is required.")
    .email("Please provide a valid email address."),
  password: z
    .string()
    .min(1, "Password is required.")
    .min(8, "Password must be at least 8 characters.")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/,
      "Password must contain uppercase, lowercase, number and special character."
    ),
});

export const suspendUserSchema = z.object({
  reason: z
    .string()
    .max(300, "Reason cannot exceed 300 characters.")
    .optional(),
});

export const userListQuerySchema = z.object({
  role: z
    .enum(["CUSTOMER", "PROVIDER", "ADMIN", "SUPER_ADMIN"])
    .optional(),
  status: z.enum(["ACTIVE", "SUSPENDED"]).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

export const providerListQuerySchema = z.object({
  approvalStatus: z
    .enum(["DRAFT", "PENDING", "APPROVED", "REJECTED"])
    .optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

export const paymentListQuerySchema = z.object({
  status: z.enum(["PENDING", "SUCCESS", "FAILED", "CANCELLED", "REFUNDED"]).optional(),
  providerSettlementStatus: z.enum(["PENDING", "PAID"]).optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

export const orderListQuerySchema = z.object({
  status: z
    .enum([
      "PENDING_PAYMENT",
      "PLACED",
      "ACCEPTED",
      "PREPARING",
      "OUT_FOR_DELIVERY",
      "DELIVERED",
      "CANCELLED",
      "REFUNDED",
    ])
    .optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
});

export const markProviderPaidSchema = z.object({
  note: z.string().max(300).optional(),
});

export const updateProviderStatusSchema = z.object({
  approvalStatus: z.enum(["DRAFT", "PENDING", "APPROVED", "REJECTED"]).optional(),
  userStatus: z.enum(["ACTIVE", "SUSPENDED"]).optional(),
  rejectionReason: z.string().max(500).optional(),
});

export type TUpdateProviderStatus = z.infer<typeof updateProviderStatusSchema>;
export type TRejectProvider = z.infer<typeof rejectProviderSchema>;
export type TCreateAdmin = z.infer<typeof createAdminSchema>;
export type TSuspendUser = z.infer<typeof suspendUserSchema>;
export type TUserListQuery = z.infer<typeof userListQuerySchema>;
export type TProviderListQuery = z.infer<typeof providerListQuerySchema>;
export type TPaymentListQuery = z.infer<typeof paymentListQuerySchema>;
export type TOrderListQuery = z.infer<typeof orderListQuerySchema>;
export type TMarkProviderPaid = z.infer<typeof markProviderPaidSchema>;