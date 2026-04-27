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
  TUpdateProviderStatus,
  TUserListQuery,
} from "./admin.validation";
import {
  sendProviderApprovedEmail,
  sendProviderRejectedEmail,
} from "../../utils/emailTemplates.utils";
import { Prisma } from "../../../generated/prisma/client";


const getPendingProviders = async (query: TProviderListQuery) => {
  const { page, limit, search } = query;
  const skip = (page - 1) * limit;

  const where = {
    approvalStatus: "PENDING" as const,
    user: {
      isDeleted: false,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
        ],
      }),
    },
  };

  const [providers, total] = await Promise.all([
    prisma.providerProfile.findMany({
      where,
      include: {
        user: {
          select: { id: true, name: true, email: true, createdAt: true },
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
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

const getAllProviders = async (query: TProviderListQuery) => {
  const { page, limit, search, approvalStatus } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.ProviderProfileWhereInput = {
    ...(approvalStatus && { approvalStatus }),
    user: {
      isDeleted: false,
      ...(search && {
        OR: [
          { name: { contains: search, mode: "insensitive" as const } },
          { email: { contains: search, mode: "insensitive" as const } },
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
            id: true, name: true, email: true, status: true, createdAt: true,
          },
        },
        _count: { select: { meals: true, orders: true } },
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }),
    prisma.providerProfile.count({ where }),
  ]);

  return {
    providers: providers.map(p => ({
      ...p,
      mealCount: p._count.meals,
      orderCount: p._count.orders,
    })),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

const getProviderDetail = async (profileId: string) => {
  const profile = await prisma.providerProfile.findUnique({
    where: { id: profileId },
    include: {
      user: {
        select: {
          id: true, name: true, email: true, phone: true, image: true,
          status: true, isDeleted: true, createdAt: true, emailVerified: true,
        },
      },
      meals: { select: { id: true } },
      orders: { select: { id: true } },
      payments: {
        select: {
          id: true, amount: true, status: true, providerSettlementStatus: true,
        },
      },
    },
  });

  if (!profile) throw new NotFoundError("Provider profile not found.");

  return {
    ...profile,
    mealCount: profile.meals.length,
    orderCount: profile.orders.length,
    paymentCount: profile.payments.length,
  };
};

const approveProvider = async (profileId: string, adminId: string) => {
  const profile = await prisma.providerProfile.findUnique({
    where: { id: profileId },
    include: {
      user: {
        select: { id: true, name: true, email: true, status: true, isDeleted: true },
      },
    },
  });

  if (!profile) throw new NotFoundError("Provider profile not found.");
  if (profile.user.isDeleted) throw new ForbiddenError("This provider account has been deleted.");
  if (profile.user.status === "SUSPENDED") throw new ForbiddenError("This provider account is suspended.");
  if (profile.approvalStatus === "APPROVED") throw new ConflictError("Provider is already approved.");
  if (profile.approvalStatus !== "PENDING") throw new BadRequestError("Only PENDING profiles can be approved.");

  const updated = await prisma.providerProfile.update({
    where: { id: profileId },
    data: {
      approvalStatus: "APPROVED",
      rejectionReason: null,
      reviewedBy: adminId,
      reviewedAt: new Date(),
    },
  });

  await sendProviderApprovedEmail(profile.user.name, profile.user.email);
  return updated;
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
        select: { id: true, name: true, email: true, status: true, isDeleted: true },
      },
    },
  });

  if (!profile) throw new NotFoundError("Provider profile not found.");
  if (profile.user.isDeleted) throw new ForbiddenError("This provider account has been deleted.");
  if (profile.approvalStatus === "REJECTED") throw new ConflictError("Provider is already rejected.");
  if (profile.approvalStatus !== "PENDING") throw new BadRequestError("Only PENDING profiles can be rejected.");

  const updated = await prisma.providerProfile.update({
    where: { id: profileId },
    data: {
      approvalStatus: "REJECTED",
      rejectionReason,
      reviewedBy: adminId,
      reviewedAt: new Date(),
    },
  });

  await sendProviderRejectedEmail(profile.user.name, profile.user.email, rejectionReason);
  return updated;
};

const updateProviderStatus = async (
  profileId: string,
  adminId: string,
  payload: TUpdateProviderStatus
) => {
  const profile = await prisma.providerProfile.findUnique({
    where: { id: profileId },
    include: {
      user: {
        select: { id: true, name: true, email: true, status: true, isDeleted: true },
      },
    },
  });

  if (!profile) throw new NotFoundError("Provider profile not found.");
  if (profile.user.isDeleted) throw new ForbiddenError("This provider account has been deleted.");

  const { approvalStatus, userStatus, rejectionReason } = payload;

  const updated = await prisma.$transaction(async (tx) => {
    if (userStatus) {
      await tx.user.update({
        where: { id: profile.user.id },
        data: { status: userStatus },
      });
    }
    if (approvalStatus) {
      await tx.providerProfile.update({
        where: { id: profileId },
        data: {
          approvalStatus,
          rejectionReason: approvalStatus === "REJECTED" ? (rejectionReason ?? null) : null,
          reviewedBy: adminId,
          reviewedAt: new Date(),
        },
      });
    }
    return tx.providerProfile.findUnique({
      where: { id: profileId },
      include: {
        user: {
          select: { id: true, name: true, email: true, phone: true, status: true },
        },
      },
    });
  });

  return updated;
};


const getAllUsers = async (query: TUserListQuery) => {
  const { page, limit, role, status, search } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.UserWhereInput = {
    isDeleted: false,
    NOT: { role: "SUPER_ADMIN" as const },
    ...(role && { role }),
    ...(status && { status }),
    ...(search && {
      OR: [
        { name: { contains: search, mode: "insensitive" as const } },
        { email: { contains: search, mode: "insensitive" as const } },
      ],
    }),
  };

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      select: {
        id: true, name: true, email: true, role: true,
        status: true, emailVerified: true, createdAt: true,
        providerProfile: {
          select: { id: true, businessName: true, approvalStatus: true },
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
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

const getUserDetail = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId, isDeleted: false },
    select: {
      id: true, name: true, email: true, role: true, status: true,
      phone: true, image: true, emailVerified: true, createdAt: true,
      updatedAt: true, providerProfile: true,
    },
  });

  if (!user) throw new NotFoundError("User not found.");
  return user;
};

const suspendUser = async (targetUserId: string, adminId: string, reason?: string) => {
  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, role: true, status: true, isDeleted: true },
  });

  if (!user) throw new NotFoundError("User not found.");
  if (user.isDeleted) throw new ForbiddenError("Account has been deleted.");
  if (user.status === "SUSPENDED") throw new ConflictError("User is already suspended.");
  if (["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    throw new ForbiddenError("Admin accounts cannot be suspended through this endpoint.");
  }

  return prisma.user.update({
    where: { id: targetUserId },
    data: { status: "SUSPENDED" },
    select: { id: true, name: true, email: true, role: true, status: true },
  });
};

const reactivateUser = async (targetUserId: string, adminId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: targetUserId },
    select: { id: true, role: true, status: true, isDeleted: true },
  });

  if (!user) throw new NotFoundError("User not found.");
  if (user.isDeleted) throw new ForbiddenError("Account has been deleted.");
  if (user.status === "ACTIVE") throw new ConflictError("User is already active.");

  return prisma.user.update({
    where: { id: targetUserId },
    data: { status: "ACTIVE" },
    select: { id: true, name: true, email: true, role: true, status: true },
  });
};

const toggleUserStatus = async (userId: string, adminId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, status: true, role: true, isDeleted: true },
  });

  if (!user) throw new NotFoundError("User not found.");
  if (user.isDeleted) throw new ForbiddenError("Account has been deleted.");
  if (["ADMIN", "SUPER_ADMIN"].includes(user.role)) {
    throw new ForbiddenError("Admin accounts cannot be toggled through this endpoint.");
  }

  const newStatus = user.status === "ACTIVE" ? "SUSPENDED" : "ACTIVE";
  return prisma.user.update({
    where: { id: userId },
    data: { status: newStatus },
    select: { id: true, name: true, email: true, role: true, status: true },
  });
};


const getDashboardStats = async () => {
  const [
    totalUsers,
    totalCustomers,
    totalProviders,
    pendingProviders,
    approvedProviders,
    rejectedProviders,
    suspendedUsers,
    totalOrders,
    placedOrders,
    activeOrders,
    deliveredOrders,
    cancelledOrders,
    grossRevenue,
    totalFeeAgg,
    totalProviderShareAgg,
    paidToProvidersAgg,
    unpaidToProvidersAgg,
    monthlyRevenue,
    userGrowth,
  ] = await Promise.all([
    prisma.user.count({ where: { isDeleted: false, role: { in: ["CUSTOMER", "PROVIDER"] } } }),
    prisma.user.count({ where: { isDeleted: false, role: "CUSTOMER" } }),
    prisma.user.count({ where: { isDeleted: false, role: "PROVIDER" } }),
    prisma.providerProfile.count({ where: { approvalStatus: "PENDING" } }),
    prisma.providerProfile.count({ where: { approvalStatus: "APPROVED" } }),
    prisma.providerProfile.count({ where: { approvalStatus: "REJECTED" } }),
    prisma.user.count({ where: { isDeleted: false, status: "SUSPENDED" } }),
    prisma.order.count(),
    prisma.order.count({ where: { status: "PLACED" } }),
    prisma.order.count({ where: { status: { in: ["PLACED", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY"] } } }),
    prisma.order.count({ where: { status: "DELIVERED" } }),
    prisma.order.count({ where: { status: "CANCELLED" } }),
    prisma.payment.aggregate({ where: { status: "SUCCESS" }, _sum: { amount: true } }),
    prisma.payment.aggregate({ where: { status: "SUCCESS" }, _sum: { platformFeeAmount: true } }),
    prisma.payment.aggregate({ where: { status: "SUCCESS" }, _sum: { providerShareAmount: true } }),
    prisma.payment.aggregate({ where: { status: "SUCCESS", providerSettlementStatus: "PAID" }, _sum: { providerShareAmount: true } }),
    prisma.payment.aggregate({ where: { status: "SUCCESS", providerSettlementStatus: "PENDING" }, _sum: { providerShareAmount: true } }),
    prisma.$queryRaw<Array<{ month: string; gross: number; fee: number; net: number; orders: number }>>`
      SELECT
        TO_CHAR(DATE_TRUNC('month', p."paidAt"), 'Mon YY') AS month,
        COALESCE(SUM(p.amount), 0)::float AS gross,
        COALESCE(SUM(p."platformFeeAmount"), 0)::float AS fee,
        COALESCE(SUM(p."providerShareAmount"), 0)::float AS net,
        COUNT(DISTINCT p."orderId")::int AS orders
      FROM payments p
      WHERE p.status = 'SUCCESS'
        AND p."paidAt" >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', p."paidAt")
      ORDER BY DATE_TRUNC('month', p."paidAt") ASC
    `,
    prisma.$queryRaw<Array<{ month: string; customers: number; providers: number }>>`
      SELECT
        TO_CHAR(DATE_TRUNC('month', u."createdAt"), 'Mon YY') AS month,
        COUNT(CASE WHEN u.role = 'CUSTOMER' THEN 1 END)::int AS customers,
        COUNT(CASE WHEN u.role = 'PROVIDER' THEN 1 END)::int AS providers
      FROM "user" as u
      WHERE u."isDeleted" = false
        AND u."createdAt" >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', u."createdAt")
      ORDER BY DATE_TRUNC('month', u."createdAt") ASC
    `,
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
    orders: {
      total: totalOrders,
      placed: placedOrders,
      active: activeOrders,
      delivered: deliveredOrders,
      cancelled: cancelledOrders,
    },
    revenue: {
      gross: Number(grossRevenue._sum.amount ?? 0),
      platformFee: Number(totalFeeAgg._sum.platformFeeAmount ?? 0),
      providerShare: Number(totalProviderShareAgg._sum.providerShareAmount ?? 0),
      paidToProviders: Number(paidToProvidersAgg._sum.providerShareAmount ?? 0),
      unpaidToProviders: Number(unpaidToProvidersAgg._sum.providerShareAmount ?? 0),
    },
    monthlyRevenue,
    userGrowth,
  };
};


const getAllOrders = async (query: TOrderListQuery) => {
  const { page, limit, search, status } = query;
  const skip = (page - 1) * limit;

  const where: Prisma.OrderWhereInput = {
    ...(status && { status }),
    ...(search && {
      OR: [
        { orderNumber: { contains: search, mode: "insensitive" } },
        { provider: { businessName: { contains: search, mode: "insensitive" } } },
        { customer: { name: { contains: search, mode: "insensitive" } } },
        { customer: { email: { contains: search, mode: "insensitive" } } },
      ],
    }),
  };

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where,
      include: {
        provider: { select: { id: true, businessName: true, city: true, businessEmail: true } },
        customer: { select: { id: true, name: true, email: true } },
        payments: {
          select: {
            id: true, status: true, amount: true,
            providerSettlementStatus: true, gatewayName: true,
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
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

const getOrderDetail = async (orderId: string) => {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      provider: { select: { id: true, businessName: true, businessEmail: true, city: true } },
      customer: { select: { id: true, name: true, email: true, phone: true } },
      orderItems: true,
      payments: true,
      orderStatusHistories: { orderBy: { createdAt: "asc" } },
    },
  });

  if (!order) throw new NotFoundError("Order not found.");
  return order;
};

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
        { provider: { businessName: { contains: search, mode: "insensitive" } } },
        { customer: { name: { contains: search, mode: "insensitive" } } },
        { customer: { email: { contains: search, mode: "insensitive" } } },
      ],
    }),
  };

  const [payments, total] = await Promise.all([
    prisma.payment.findMany({
      where,
      include: {
        provider: {
          select: { id: true, businessName: true, businessEmail: true, city: true },
        },
        customer: { select: { id: true, name: true, email: true } },
        order: {
          select: {
            id: true, orderNumber: true, status: true,
            totalAmount: true, createdAt: true,
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
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

const getPaymentDetail = async (paymentId: string) => {
  const payment = await prisma.payment.findUnique({
    where: { id: paymentId },
    include: {
      provider: {
        include: {
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
      },
      customer: { select: { id: true, name: true, email: true, phone: true } },
      order: { include: { orderItems: true } },
    },
  });

  if (!payment) throw new NotFoundError("Payment not found.");
  return payment;
};

const getProviderPayablesSummary = async () => {
  const providers = await prisma.providerProfile.findMany({
    where: { currentPayableAmount: { gt: 0 } },
    select: {
      id: true, businessName: true, businessEmail: true, city: true,
      totalGrossRevenue: true, totalPlatformFee: true,
      totalProviderEarning: true, currentPayableAmount: true, lastPaymentAt: true,
      user: { select: { id: true, name: true, email: true, phone: true } },
    },
    orderBy: { currentPayableAmount: "desc" },
  });

  const pendingSettlementCount = await prisma.payment.count({
    where: { status: "SUCCESS", providerSettlementStatus: "PENDING" },
  });

  return { providers, pendingSettlementCount };
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
      order: { select: { id: true, orderNumber: true, status: true } },
    },
  });

  if (!payment) throw new NotFoundError("Payment not found.");
  if (payment.status !== "SUCCESS") throw new BadRequestError("Only successful payments can be settled.");
  if (payment.providerSettlementStatus === "PAID") throw new ConflictError("Payment already settled.");
  const settleableOrderStatuses = ["DELIVERED"];
  if (!settleableOrderStatuses.includes(payment.order?.status ?? "")) {
    throw new BadRequestError(
      `Cannot settle payment for order #${payment.order?.orderNumber} — ` +
      `order must be DELIVERED before settlement. ` +
      `Current status: ${payment.order?.status ?? "unknown"}.`
    );
  }

  return prisma.$transaction(async (tx) => {
    const updated = await tx.payment.update({
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
      data: { currentPayableAmount: { decrement: payment.providerShareAmount }, lastPaymentAt: new Date() },
    });

    return updated;
  });
};

const bulkSettleProvider = async (
  providerId: string,
  adminId: string,
  note?: string
) => {
  const provider = await prisma.providerProfile.findUnique({
    where: { id: providerId },
    select: { id: true, businessName: true, currentPayableAmount: true },
  });

  if (!provider) throw new NotFoundError("Provider not found.");
  if (Number(provider.currentPayableAmount) <= 0) throw new BadRequestError("Provider has no pending settlements.");

  const pending = await prisma.payment.findMany({
    where: {
      providerId,
      status: "SUCCESS",
      providerSettlementStatus: "PENDING",
      order: { status: "DELIVERED" },
    },
    select: { id: true, providerShareAmount: true },
  });

  if (pending.length === 0) {
    throw new BadRequestError(
      "No settleable payments found for this provider. " +
      "Only payments linked to DELIVERED orders can be settled."
    );
  }

  const total = pending.reduce((s, p) => s + Number(p.providerShareAmount), 0);

  return prisma.$transaction(async (tx) => {
    await tx.payment.updateMany({
      where: {
        providerId,
        status: "SUCCESS",
        providerSettlementStatus: "PENDING",
        order: { status: "DELIVERED" },
      },
      data: {
        providerSettlementStatus: "PAID",
        providerSettledAt: new Date(),
        providerSettledBy: adminId,
        providerSettlementNote: note ?? null,
      },
    });

    await tx.providerProfile.update({
      where: { id: providerId },
      data: {
        currentPayableAmount: { decrement: total },
        lastPaymentAt: new Date(),
      },
    });

    const settled = await tx.payment.findMany({
      where: { providerId, providerSettledBy: adminId },
      include: { order: { select: { id: true, orderNumber: true } } },
      orderBy: { providerSettledAt: "desc" },
      take: pending.length,
    });

    return {
      provider: { id: provider.id, businessName: provider.businessName },
      settledPayments: settled,
      totalSettledAmount: total,
      paymentCount: settled.length,
    };
  });
};


const getAllCategories = async () =>
  prisma.category.findMany({
    orderBy: { displayOrder: "asc" },
    include: { _count: { select: { meals: true } } },
  });

const createCategory = async (payload: {
  name: string; slug: string; imageURL: string; displayOrder?: number;
}) => {
  const existing = await prisma.category.findFirst({
    where: { OR: [{ name: payload.name }, { slug: payload.slug }] },
    select: { id: true },
  });

  if (existing) throw new ConflictError("A category with this name or slug already exists.");

  return prisma.category.create({
    data: { ...payload, displayOrder: payload.displayOrder ?? 0 },
  });
};

const updateCategory = async (
  categoryId: string,
  payload: { name?: string; slug?: string; imageURL?: string; displayOrder?: number; isActive?: boolean }
) => {
  const cat = await prisma.category.findUnique({ where: { id: categoryId }, select: { id: true } });
  if (!cat) throw new NotFoundError("Category not found.");
  return prisma.category.update({ where: { id: categoryId }, data: payload });
};

const deleteCategory = async (categoryId: string) => {
  const cat = await prisma.category.findUnique({
    where: { id: categoryId },
    include: { _count: { select: { meals: true } } },
  });

  if (!cat) throw new NotFoundError("Category not found.");
  if (cat._count.meals > 0) {
    throw new BadRequestError(`Cannot delete category with ${cat._count.meals} meal(s). Reassign first.`);
  }

  return prisma.category.delete({ where: { id: categoryId } });
};

const toggleCategoryStatus = async (categoryId: string) => {
  const cat = await prisma.category.findUnique({
    where: { id: categoryId },
    select: { id: true, isActive: true },
  });
  if (!cat) throw new NotFoundError("Category not found.");
  return prisma.category.update({
    where: { id: categoryId },
    data: { isActive: !cat.isActive },
  });
};


// ─── Admin management (SUPER_ADMIN only) ─────────────────────────────────────

const getAllAdmins = async () =>
  prisma.user.findMany({
    where: { role: { in: ["ADMIN", "SUPER_ADMIN"] }, isDeleted: false },
    select: {
      id: true, name: true, email: true, role: true,
      status: true, emailVerified: true, createdAt: true,
    },
    orderBy: { createdAt: "asc" },
  });


const createAdmin = async (payload: TCreateAdmin, createdById: string) => {
  const existing = await prisma.user.findUnique({
    where: { email: payload.email },
    select: { id: true, isDeleted: true },
  });

  if (existing) {
    if (existing.isDeleted) throw new ForbiddenError("Email is associated with a deleted account.");
    throw new ConflictError("An account with this email already exists.");
  }

  const result = await auth.api.signUpEmail({
    body: { name: payload.name, email: payload.email, password: payload.password },
    headers: new Headers({ "x-intended-role": "ADMIN" }),
  });

  if (!result.user) throw new BadRequestError("Failed to create admin account.");

  await prisma.user.update({
    where: { id: result.user.id },
    data: { emailVerified: true },
  });

  return result.user;
};

/**
 * Suspend an ADMIN account. Cannot suspend SUPER_ADMIN accounts.
 * Only callable by SUPER_ADMIN (enforced at route level via superAdminGuard).
 */
const suspendAdmin = async (targetAdminId: string, requesterId: string) => {
  const target = await prisma.user.findUnique({
    where: { id: targetAdminId },
    select: { id: true, role: true, status: true, isDeleted: true },
  });

  if (!target) throw new NotFoundError("Admin account not found.");
  if (target.isDeleted) throw new ForbiddenError("This account has been deleted.");
  if (target.role === "SUPER_ADMIN") throw new ForbiddenError("Super admin accounts cannot be suspended.");
  if (target.role !== "ADMIN") throw new ForbiddenError("Target account is not an admin.");
  if (target.status === "SUSPENDED") throw new ConflictError("Admin is already suspended.");

  return prisma.user.update({
    where: { id: targetAdminId },
    data: { status: "SUSPENDED" },
    select: { id: true, name: true, email: true, role: true, status: true },
  });
};

/**
 * Reactivate a suspended ADMIN account.
 * Only callable by SUPER_ADMIN (enforced at route level).
 */
const reactivateAdmin = async (targetAdminId: string, requesterId: string) => {
  const target = await prisma.user.findUnique({
    where: { id: targetAdminId },
    select: { id: true, role: true, status: true, isDeleted: true },
  });

  if (!target) throw new NotFoundError("Admin account not found.");
  if (target.isDeleted) throw new ForbiddenError("This account has been deleted.");
  if (target.role !== "ADMIN") throw new ForbiddenError("Target account is not an admin.");
  if (target.status === "ACTIVE") throw new ConflictError("Admin is already active.");

  return prisma.user.update({
    where: { id: targetAdminId },
    data: { status: "ACTIVE" },
    select: { id: true, name: true, email: true, role: true, status: true },
  });
};

/**
 * Soft-delete an ADMIN account. Cannot delete SUPER_ADMIN accounts.
 * All sessions are invalidated automatically via CASCADE on the Session model.
 * Only callable by SUPER_ADMIN.
 */
const deleteAdmin = async (targetAdminId: string, requesterId: string) => {
  if (targetAdminId === requesterId) {
    throw new ForbiddenError("You cannot delete your own account.");
  }

  const target = await prisma.user.findUnique({
    where: { id: targetAdminId },
    select: { id: true, role: true, isDeleted: true },
  });

  if (!target) throw new NotFoundError("Admin account not found.");
  if (target.isDeleted) throw new ConflictError("Account has already been deleted.");
  if (target.role === "SUPER_ADMIN") throw new ForbiddenError("Super admin accounts cannot be deleted.");
  if (target.role !== "ADMIN") throw new ForbiddenError("Target account is not an admin.");

  // Invalidate all active sessions first
  await prisma.session.deleteMany({ where: { userId: targetAdminId } });

  // Soft-delete the user record
  await prisma.user.update({
    where: { id: targetAdminId },
    data: { isDeleted: true, deletedAt: new Date(), status: "SUSPENDED" },
  });
};


export const AdminService = {
  getPendingProviders,
  getAllProviders,
  getProviderDetail,
  approveProvider,
  rejectProvider,
  updateProviderStatus,
  getAllUsers,
  getUserDetail,
  suspendUser,
  reactivateUser,
  toggleUserStatus,
  getAllAdmins,
  createAdmin,
  suspendAdmin,     
  reactivateAdmin,
  deleteAdmin,
  getDashboardStats,
  getAllOrders,
  getOrderDetail,
  getAllPayments,
  getPaymentDetail,
  getProviderPayablesSummary,
  markPaymentAsProviderPaid,
  bulkSettleProvider,
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
};