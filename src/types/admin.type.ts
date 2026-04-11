// src/types/admin.type.ts

export interface IRejectProviderPayload {
  rejectionReason: string;
}

export interface ICreateAdminPayload {
  name: string;
  email: string;
  password: string;
}

export interface ISuspendUserPayload {
  reason?: string;
}

export type TUserListFilter = {
  role?: "CUSTOMER" | "PROVIDER" | "ADMIN" | "SUPER_ADMIN";
  status?: "ACTIVE" | "SUSPENDED";
  page?: number;
  limit?: number;
  search?: string;
};

export type TProviderListFilter = {
  approvalStatus?: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED";
  page?: number;
  limit?: number;
  search?: string;
};