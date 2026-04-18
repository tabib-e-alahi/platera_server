// src/modules/admin/admin.service.ts

import { prisma } from "../../lib/prisma";
import { auth } from "../../lib/auth";

import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../errors/AppError";
import {
  TCreateAdmin,
  TOrderListQuery,
  TPaymentListQuery,
  TProviderListQuery,
  TUserListQuery,
} from "./admin.validation";
import { sendProviderApprovedEmail, sendProviderRejectedEmail } from "../../utils/emailTemplates.utils";
import { Prisma } from "../../../generated/prisma/client";

// ─── Provider approval management ────────────────────────────────────────────

const getPendingProviders = async (query: TProviderListQuery) => {
  const { page, limit, search } = query;
  const skip = (page - 1) * limit;

  const where = {
    approvalStatus: "PENDING" as const,
    user: {
      isDeleted: false,
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      }),
    },
  };

  const [providers, total] = await Promise.all([
    prisma.providerProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "asc" }, // oldest first — fairness
      skip,
      take: limit,
    }),
    prisma.providerProfile.count({ where }),
  ]);

  return {
    providers,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getAllProviders = async (query: TProviderListQuery) => {
  const { page, limit, search, approvalStatus } = query;
  const skip = (page - 1) * limit;

  const where = {
    ...(approvalStatus && { approvalStatus }),
    user: {
      isDeleted: false,
      ...(search && {
        OR: [
          {
            name: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
          {
            email: {
              contains: search,
              mode: "insensitive" as const,
            },
          },
        ],
      }),
    },
  };

  const [providers, total] = await Promise.all([
    prisma.providerProfile.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.providerProfile.count({ where }),
  ]);

  return {
    providers,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getProviderDetail = async (profileId: string) => {
  const profile = await prisma.providerProfile.findUnique({
    where: { id: profileId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          status: true,
          isDeleted: true,
          createdAt: true,
          emailVerified: true,
        },
      },
    },
  });

  if (!profile) {
    throw new NotFoundError("Provider profile not found.");
  }

  return profile;
};

const approveProvider = async (
  profileId: string,
  adminId: string
) => {
  const profile = await prisma.providerProfile.findUnique({
    where: { id: profileId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          isDeleted: true,
        },
      },
    },
  });

  if (!profile) {
    throw new NotFoundError("Provider profile not found.");
  }

  if (profile.user.isDeleted) {
    throw new ForbiddenError(
      "This provider account has been deleted."
    );
  }

  if (profile.user.status === "SUSPENDED") {
    throw new ForbiddenError(
      "This provider account is currently suspended."
    );
  }

  if (profile.approvalStatus === "APPROVED") {
    throw new ConflictError("This provider is already approved.");
  }

  if (profile.approvalStatus !== "PENDING") {
    throw new BadRequestError(
      "Only profiles with PENDING status can be approved."
    );
  }

  const updatedProfile = await prisma.providerProfile.update({
    where: { id: profileId },
    data: {
      approvalStatus: "APPROVED",
      rejectionReason: null,
      reviewedBy: adminId,
      reviewedAt: new Date(),
    },
  });

  await sendProviderApprovedEmail(
    profile.user.name,
    profile.user.email
  );

  return updatedProfile;
};

const rejectProvider = async (
  profileId: string,
  adminId: string,
  rejectionReason: string
) => {
  const profile = await prisma.providerProfile.findUnique({
    where: { id: profileId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          status: true,
          isDeleted: true,
        },
      },
    },
  });

  if (!profile) {
    throw new NotFoundError("Provider profile not found.");
  }

  if (profile.user.isDeleted) {
    throw new ForbiddenError(
      "This provider account has been deleted."
    );
  }

  if (profile.approvalStatus === "REJECTED") {
    throw new ConflictError(
      "This provider profile is already rejected."
    );
  }

  if (profile.approvalStatus !== "PENDING") {
    throw new BadRequestError(
      "Only profiles with PENDING status can be rejected."
    );
  }

  const updatedProfile = await prisma.providerProfile.update({
    where: { id: profileId },
    data: {
      approvalStatus: "REJECTED",
      rejectionReason,
      reviewedBy: adminId,
      reviewedAt: new Date(),
    },
  });

  await sendProviderRejectedEmail(
    profile.user.name,
    profile.user.email,
    rejectionReason
  );

  return updatedProfile;
};

// ─── User management ──────────────────────────────────────────────────────────

const getAllUsers = async (query: TUserListQuery) => {
  const { page, limit, role, status, search } = query;
  const skip = (page - 1) * limit;

  const where = {
    isDeleted: false,
    // exclude super admins from regular admin view
    NOT: { role: "SUPER_ADMIN" as const },
    ...(role && { role }),
    ...(status && { status }),
    ...(search && {
      OR: [
        {
          name: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
        {
          email: {
            contains: search,
            mode: "insensitive" as const,
          },
        },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        status: true,
        emailVerified: true,
        createdAt: true,
        providerProfile: {
          select: {
            id: true,
            businessName: true,
            approvalStatus: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.user.count({ where }),
  ]);

  return {
    users,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getUserDetail = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isDeleted: false },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      phone: true,
      image: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
      providerProfile: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  return user;
};

const suspendUser = async (
  targetUserId: string,
  adminId: string,
  reason?: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: {
      id: true,
      role: true,
      status: true,
      isDeleted: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  if (user.isDeleted) {
    throw new ForbiddenError("This account has been deleted.");
  }

  if (user.status === "SUSPENDED") {
    throw new ConflictError("This user is already suspended.");
  }

  // admin cannot suspend another admin or super admin
  if (
    user.role === "ADMIN" ||
    user.role === "SUPER_ADMIN"
  ) {
    throw new ForbiddenError(
      "Admin accounts cannot be suspended through this endpoint."
    );
  }

  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: { status: "SUSPENDED" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  return updatedUser;
};

const reactivateUser = async (
  targetUserId: string,
  adminId: string
) => {
  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: {
      id: true,
      role: true,
      status: true,
      isDeleted: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found.");
  }

  if (user.isDeleted) {
    throw new ForbiddenError("This account has been deleted.");
  }

  if (user.status === "ACTIVE") {
    throw new ConflictError("This user is already active.");
  }

  const updatedUser = await prisma.user.update({
    where: { id: targetUserId },
    data: { status: "ACTIVE" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
    },
  });

  return updatedUser;
};

// ─── Super admin only ─────────────────────────────────────────────────────────

const getAllAdmins = async () => {
  const admins = await prisma.user.findMany({
    where: {
      role: { in: ["ADMIN", "SUPER_ADMIN"] },
      isDeleted: false,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      status: true,
      emailVerified: true,
      createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });

  return admins;
};

const createAdmin = async (
  payload: TCreateAdmin,
  createdById: string
) => {
  const existing = await prisma.user.findUnique({
    where: { email: payload.email },
    select: { id: true, isDeleted: true },
  });

  if (existing) {
    if (existing.isDeleted) {
      throw new ForbiddenError(
        "This email is associated with a deleted account."
      );
    }
    throw new ConflictError(
      "An account with this email already exists."
    );
  }

  const result = await auth.api.signUpEmail({
    body: {
      name: payload.name,
      email: payload.email,
      password: payload.password,
    },
    headers: new Headers({
      "x-intended-role": "ADMIN",
    }),
  });

  if (!result.user) {
    throw new BadRequestError("Failed to create admin account.");
  }

  // admins do not need email verification
  await prisma.user.update({
    where: { id: result.user.id },
    data: { emailVerified: true },
  });

  return result.user;
};

// ─── Dashboard stats ──────────────────────────────────────────────────────────

const getDashboardStats = async () => {
  const [
    totalUsers,
    totalCustomers,
    totalProviders,
    pendingProviders,
    approvedProviders,
    rejectedProviders,
    suspendedUsers,
  ] = await Promise.all([
    prisma.user.count({
      where: { isDeleted: false, role: { in: ["CUSTOMER", "PROVIDER"] } },
    }),
    prisma.user.count({
      where: { isDeleted: false, role: "CUSTOMER" },
    }),
    prisma.user.count({
      where: { isDeleted: false, role: "PROVIDER" },
    }),
    prisma.providerProfile.count({
      where: { approvalStatus: "PENDING" },
    }),
    prisma.providerProfile.count({
      where: { approvalStatus: "APPROVED" },
    }),
    prisma.providerProfile.count({
      where: { approvalStatus: "REJECTED" },
    }),
    prisma.user.count({
      where: { isDeleted: false, status: "SUSPENDED" },
    }),
  ]);

  return {
    users: {
      total: totalUsers,
      customers: totalCustomers,
      providers: totalProviders,
      suspended: suspendedUsers,
    },
    providers: {
      pending: pendingProviders,
      approved: approvedProviders,
      rejected: rejectedProviders,
    },
  };
};


//* ------ Payment list ========================================
const getAllPayments = async (query: TPaymentListQuery) => {
  const { page, limit, search, status, providerSettlementStatus } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.PaymentWhereInput = {
    ...(status && { status }),
    ...(providerSettlementStatus && { providerSettlementStatus }),
    ...(search && {
      OR: [
        { transactionId: { contains: search, mode: "insensitive" } },
        { gatewayName: { contains: search, mode: "insensitive" } },
        {
          provider: {
            businessName: { contains: search, mode: "insensitive" },
          },
        },
        {
          customer: {
            name: { contains: search, mode: "insensitive" },
          },
        },
        {
          customer: {
            email: { contains: search, mode: "insensitive" },
          },
        },
      ],
    }),
  };

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            businessEmail: true,
            city: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        order: {
          select: {
            id: true,
            orderNumber: true,
            status: true,
            totalAmount: true,
            createdAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.payment.count({ where }),
  ]);

  return {
    payments,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getPaymentDetail = async (paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      provider: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
      },
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      order: {
        include: {
          items: true,
        },
      },
    },
  });

  if (!payment) {
    throw new NotFoundError("Payment not found.");
  }

  return payment;
};

const getAllOrders = async (query: TOrderListQuery) => {
  const { page, limit, search, status } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.OrderWhereInput = {
    ...(status && { status }),
    ...(search && {
      OR: [
        { orderNumber: { contains: search, mode: "insensitive" } },
        {
          provider: {
            businessName: { contains: search, mode: "insensitive" },
          },
        },
        {
          customer: {
            name: { contains: search, mode: "insensitive" },
          },
        },
        {
          customer: {
            email: { contains: search, mode: "insensitive" },
          },
        },
      ],
    }),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        provider: {
          select: {
            id: true,
            businessName: true,
            city: true,
          },
        },
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        payments: {
          select: {
            id: true,
            status: true,
            amount: true,
            providerSettlementStatus: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.order.count({ where }),
  ]);

  return {
    orders,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  };
};

const getOrderDetail = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      provider: {
        select: {
          id: true,
          businessName: true,
          businessEmail: true,
          city: true,
        },
      },
      customer: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
      items: true,
      payments: true,
    },
  });

  if (!order) {
    throw new NotFoundError("Order not found.");
  }

  return order;
};

const getProviderPayablesSummary = async () => {
  const providers = await prisma.providerProfile.findMany({
    where: {
      currentPayableAmount: {
        gt: 0,
      },
    },
    select: {
      id: true,
      businessName: true,
      businessEmail: true,
      city: true,
      totalGrossRevenue: true,
      totalPlatformFee: true,
      totalProviderEarning: true,
      currentPayableAmount: true,
      lastPaymentAt: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
        },
      },
    },
    orderBy: {
      currentPayableAmount: "desc",
    },
  });

  const pendingSettlementCount = await prisma.payment.count({
    where: {
      status: "SUCCESS",
      providerSettlementStatus: "PENDING",
    },
  });

  return {
    providers,
    pendingSettlementCount,
  };
};

const markPaymentAsProviderPaid = async (
  paymentId: string,
  adminId: string,
  note?: string
) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      provider: true,
    },
  });

  if (!payment) {
    throw new NotFoundError("Payment not found.");
  }

  if (payment.status !== "SUCCESS") {
    throw new BadRequestError(
      "Only successful payments can be marked as provider paid."
    );
  }

  if (payment.providerSettlementStatus === "PAID") {
    throw new ConflictError("This payment is already marked as provider paid.");
  }

  const updated = await prisma.$transaction(async (tx) => {
    const updatedPayment = await tx.payment.update({
      where: { id: paymentId },
      data: {
        providerSettlementStatus: "PAID",
        providerSettledAt: new Date(),
        providerSettledBy: adminId,
        providerSettlementNote: note ?? null,
      },
    });

    await tx.providerProfile.update({
      where: { id: payment.providerId },
      data: {
        currentPayableAmount: {
          decrement: payment.providerShareAmount,
        },
      },
    });

    return updatedPayment;
  });

  return updated;
};

export const AdminService = {
  getPendingProviders,
  getAllProviders,
  getProviderDetail,
  approveProvider,
  rejectProvider,
  getAllUsers,
  getUserDetail,
  suspendUser,
  reactivateUser,
  getAllAdmins,
  createAdmin,
  getDashboardStats,
  getAllPayments,
  getPaymentDetail,
  getAllOrders,
  getOrderDetail,
  getProviderPayablesSummary,
  markPaymentAsProviderPaid,
};