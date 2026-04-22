// src/modules/provider/provider.service.ts
import { prisma } from "../../lib/prisma";

import {
  BadRequestError,
  ConflictError,
  ForbiddenError,
  NotFoundError,
  UnprocessableError,
} from "../../errors/AppError";
import {
  TCreateProviderProfile,
  TUpdateProviderProfile,
  TDeleteImage,
} from "./provider.validation";
import { IProviderUploadedImages } from "../../utils/extractFiles";
import { deleteFromCloudinary, deleteMultipleFromCloudinary } from "../../utils/claudinary";
import { Prisma } from "../../../generated/prisma/client";
import { sendAdminApprovalRequestEmail } from "../../utils/emailTemplates.utils";


// ─── Get My Profile ───────────────────────────────────────────────────────────

const getMyProfile = async (userId: string) => {
  const profile = await prisma.providerProfile.findUnique({
    where: { userId },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          image: true,
          emailVerified: true,
          status: true,
        },
      },
    },
  });

  return profile;
};

// ─── Create Profile ───────────────────────────────────────────────────────────

const createProviderProfile = async (
  userId: string,
  payload: TCreateProviderProfile,
  images: IProviderUploadedImages
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      status: true,
      isDeleted: true,
      emailVerified: true,
    },
  });

  const uploadedUrls = Object.values(images).filter(
    (v): v is string => typeof v === "string"
  );

  const cleanupAndThrow = async (error: Error): Promise<never> => {
    await deleteMultipleFromCloudinary(uploadedUrls);
    throw error;
  };

  if (!user) {
    return cleanupAndThrow(new NotFoundError("User not found."));
  }
  if (user.isDeleted) {
    return cleanupAndThrow(
      new ForbiddenError("This account has been deleted.")
    );
  }
  if (user.status === "SUSPENDED") {
    return cleanupAndThrow(
      new ForbiddenError(
        "Your account is suspended. Please contact support."
      )
    );
  }

  if (!user.emailVerified) {
    return cleanupAndThrow(
      new ForbiddenError(
        "Please verify your email address before creating your profile."
      )
    );
  }
  if (user.role !== "PROVIDER") {
    return cleanupAndThrow(
      new ForbiddenError(
        "Only provider accounts can create a provider profile."
      )
    );
  }

  const existingProfile = await prisma.providerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (existingProfile) {
    return cleanupAndThrow(
      new ConflictError(
        "You already have a provider profile. Use the update endpoint instead."
      )
    );
  }

  // build NID JSON array
  const nidUrls = [
    images.nidImageFrontURL,
    images.nidImageBackURL,
  ].filter((v): v is string => typeof v === "string");

  const nidImageFront_and_BackURL =
    nidUrls.length > 0 ? JSON.stringify(nidUrls) : null;
  console.log(nidImageFront_and_BackURL);
  // explicit Prisma create payload — no spreading of Zod type
  // this avoids the undefined vs null conflict entirely
  const createData: Prisma.ProviderProfileCreateInput = {
    user: { connect: { id: userId } },
    businessName: payload.businessName,
    businessCategory: payload.businessCategory,
    phone: payload.phone,
    businessEmail: payload.businessEmail,
    bio: payload.bio ?? null,
    binNumber: payload.binNumber ?? null,
    city: payload.city,
    street: payload.street,
    houseNumber: payload.houseNumber,
    apartment: payload.apartment ?? null,
    postalCode: payload.postalCode,
    nidImageFront_and_BackURL,
    businessMainGateURL: images.businessMainGateURL ?? null,
    businessKitchenURL: images.businessKitchenURL ?? null,
    imageURL: images.profileImageURL ?? null,
  };

  const profile = await prisma.providerProfile.create({
    data: createData,
  });

  return profile;
};

// ─── Update Profile ───────────────────────────────────────────────────────────

const updateProviderProfile = async (
  userId: string,
  payload: TUpdateProviderProfile,
  newImages: IProviderUploadedImages
) => {
  const profile = await prisma.providerProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      approvalStatus: true,
      businessCategory: true,
      nidImageFront_and_BackURL: true,
      businessMainGateURL: true,
      businessKitchenURL: true,
      imageURL: true,
    },
  });

  const uploadedUrls = Object.values(newImages).filter(
    (v): v is string => typeof v === "string"
  );

  if (!profile) {
    await deleteMultipleFromCloudinary(uploadedUrls);
    throw new NotFoundError(
      "Provider profile not found. Please create your profile first."
    );
  }

  const finalCategory =
    payload.businessCategory ?? profile.businessCategory;

  if (
    finalCategory === "RESTAURANT" &&
    payload.binNumber !== undefined &&
    (payload.binNumber === null || payload.binNumber.trim() === "")
  ) {
    await deleteMultipleFromCloudinary(uploadedUrls);
    throw new UnprocessableError(
      "BIN/Tax number is mandatory for Restaurant category."
    );
  }

  const shouldResetApproval = profile.approvalStatus === "APPROVED";

  const updateData: Record<string, any> = {};

  // ─── text fields ─────────────────────────────────────────────
  // required fields — only include if present in payload
  if (payload.businessName !== undefined) {
    updateData.businessName = payload.businessName;
  }
  if (payload.businessCategory !== undefined) {
    updateData.businessCategory = payload.businessCategory;
  }
  if (payload.phone !== undefined) {
    updateData.phone = payload.phone;
  }
  if (payload.city !== undefined) {
    updateData.city = payload.city;
  }
  if (payload.street !== undefined) {
    updateData.street = payload.street;
  }
  if (payload.houseNumber !== undefined) {
    updateData.houseNumber = payload.houseNumber;
  }
  if (payload.postalCode !== undefined) {
    updateData.postalCode = payload.postalCode;
  }

  // nullable fields — include even if null (intentional clear)
  // but skip if undefined (not sent in request)
  if (payload.bio !== undefined) {
    updateData.bio = payload.bio ?? null;
  }
  if (payload.binNumber !== undefined) {
    updateData.binNumber = payload.binNumber ?? null;
  }
  if (payload.apartment !== undefined) {
    updateData.apartment = payload.apartment ?? null;
  }

  // ─── image fields ─────────────────────────────────────────────
  if (
    newImages.nidImageFrontURL !== undefined ||
    newImages.nidImageBackURL !== undefined
  ) {
    const existingNids: string[] = profile.nidImageFront_and_BackURL
      ? (JSON.parse(profile.nidImageFront_and_BackURL) as string[])
      : [];

    const updatedNids = [...existingNids];

    if (newImages.nidImageFrontURL !== undefined) {
      if (existingNids[0]) {
        await deleteFromCloudinary(existingNids[0]);
      }
      updatedNids[0] = newImages.nidImageFrontURL;
    }

    if (newImages.nidImageBackURL !== undefined) {
      if (existingNids[1]) {
        await deleteFromCloudinary(existingNids[1]);
      }
      updatedNids[1] = newImages.nidImageBackURL;
    }

    updateData.nidImageFront_and_BackURL = JSON.stringify(
      updatedNids.filter(Boolean)
    );
  }

  if (newImages.businessMainGateURL !== undefined) {
    if (profile.businessMainGateURL) {
      await deleteFromCloudinary(profile.businessMainGateURL);
    }
    updateData.businessMainGateURL = newImages.businessMainGateURL;
  }

  if (newImages.businessKitchenURL !== undefined) {
    if (profile.businessKitchenURL) {
      await deleteFromCloudinary(profile.businessKitchenURL);
    }
    updateData.businessKitchenURL = newImages.businessKitchenURL;
  }

  if (newImages.profileImageURL !== undefined) {
    if (profile.imageURL) {
      await deleteFromCloudinary(profile.imageURL);
    }
    updateData.imageURL = newImages.profileImageURL;
  }

  // ─── approval reset ───────────────────────────────────────────
  if (shouldResetApproval) {
    updateData.approvalStatus = "DRAFT";
    updateData.rejectionReason = null;
    updateData.reviewedBy = null;
    updateData.reviewedAt = null;
  }

  const updatedProfile = await prisma.providerProfile.update({
    where: { userId },
    data: updateData,
  });

  return updatedProfile;
};

// ─── Delete Specific Image ────────────────────────────────────────────────────

const deleteProviderImage = async (
  userId: string,
  imageType: TDeleteImage["imageType"]
) => {
  const profile = await prisma.providerProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      approvalStatus: true,
      nidImageFront_and_BackURL: true,
      businessMainGateURL: true,
      businessKitchenURL: true,
      imageURL: true,
    },
  });

  if (!profile) {
    throw new NotFoundError("Provider profile not found.");
  }

  const updateData: Prisma.ProviderProfileUpdateInput = {};

  switch (imageType) {
    case "nidImageFront":
    case "nidImageBack": {
      const existingNids: string[] = profile.nidImageFront_and_BackURL
        ? (JSON.parse(
          profile.nidImageFront_and_BackURL
        ) as string[])
        : [];

      const index = imageType === "nidImageFront" ? 0 : 1;
      const label =
        imageType === "nidImageFront" ? "front" : "back";

      if (!existingNids[index]) {
        throw new NotFoundError(`NID ${label} image not found.`);
      }

      await deleteFromCloudinary(existingNids[index]);
      existingNids[index] = "";

      const remaining = existingNids.filter(Boolean);
      updateData.nidImageFront_and_BackURL =
        remaining.length > 0
          ? JSON.stringify(existingNids)
          : null;
      break;
    }

    case "businessMainGate": {
      if (!profile.businessMainGateURL) {
        throw new NotFoundError(
          "Business main gate image not found."
        );
      }
      await deleteFromCloudinary(profile.businessMainGateURL);
      updateData.businessMainGateURL = null;
      break;
    }

    case "businessKitchen": {
      if (!profile.businessKitchenURL) {
        throw new NotFoundError(
          "Business kitchen image not found."
        );
      }
      await deleteFromCloudinary(profile.businessKitchenURL);
      updateData.businessKitchenURL = null;
      break;
    }

    case "profileImage": {
      if (!profile.imageURL) {
        throw new NotFoundError("Profile image not found.");
      }
      await deleteFromCloudinary(profile.imageURL);
      updateData.imageURL = null;
      break;
    }
  }

  const shouldResetApproval = profile.approvalStatus === "APPROVED";

  const updatedProfile = await prisma.providerProfile.update({
    where: { userId },
    data: {
      ...updateData,
      ...(shouldResetApproval && {
        approvalStatus: "PENDING",
        rejectionReason: null,
        reviewedBy: null,
        reviewedAt: null,
      }),
    },
  });

  return updatedProfile;
};

// ─── Request Approval ─────────────────────────────────────────────────────────

const requestApproval = async (userId: string) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      status: true,
      isDeleted: true,
      emailVerified: true,
      phone: true,
    },
  });

  if (!user) throw new NotFoundError("User not found.");

  if (user.isDeleted) {
    throw new ForbiddenError("This account has been deleted.");
  }

  if (user.status === "SUSPENDED") {
    throw new ForbiddenError(
      "Your account is suspended. Please contact support."
    );
  }

  if (!user.emailVerified) {
    throw new ForbiddenError(
      "Please verify your email before requesting approval."
    );
  }

  const profile = await prisma.providerProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      approvalStatus: true,
      businessName: true,
      businessCategory: true,
      businessEmail: true,
      phone: true,
      city: true,
      street: true,
      houseNumber: true,
      apartment: true,
      postalCode: true,
      binNumber: true,
      nidImageFront_and_BackURL: true,
      businessMainGateURL: true,
      businessKitchenURL: true,
      imageURL: true,
      bio: true,
    },
  });

  if (!profile) {
    throw new NotFoundError(
      "Please complete your provider profile before requesting approval."
    );
  }

  // only DRAFT and REJECTED can request approval
  if (profile.approvalStatus === "APPROVED") {
    throw new ConflictError(
      "Your profile is already approved. No action needed."
    );
  }

  if (profile.approvalStatus === "PENDING") {
    throw new ConflictError(
      "Your approval request is already under review. Please wait for admin response."
    );
  }

  // profile.approvalStatus is DRAFT or REJECTED here — both allowed

  // BIN check for restaurant
  if (
    profile.businessCategory === "RESTAURANT" &&
    (!profile.binNumber || profile.binNumber.trim() === "")
  ) {
    throw new UnprocessableError(
      "BIN/Tax number is required for Restaurant category before requesting approval."
    );
  }

  // NID images check
  const nidUrls: string[] = profile.nidImageFront_and_BackURL
    ? (JSON.parse(profile.nidImageFront_and_BackURL) as string[])
    : [];

  if (nidUrls.filter(Boolean).length < 2) {
    throw new UnprocessableError(
      "Both front and back NID images are required before requesting approval."
    );
  }

  // main gate image check
  if (!profile.businessMainGateURL) {
    throw new UnprocessableError(
      "Business main gate image is required before requesting approval."
    );
  }

  // set to PENDING and clear any previous rejection data
  const updatedProfile = await prisma.providerProfile.update({
    where: { userId },
    data: {
      approvalStatus: "PENDING",
      rejectionReason: null,
      reviewedBy: null,
      reviewedAt: null,
    },
  });

  //* for testing purposes, send email to a specific address instead of all admins
  // sendAdminApprovalRequestEmail(
  //   "etabib.alahi@gmail.com",
  //   user.name,
  //   profile.businessName,
  //   profile.businessCategory
  // )

  // notify all active admins
  const admins = await prisma.user.findMany({
    where: {
      role: { in: ["ADMIN", "SUPER_ADMIN"] },
      status: "ACTIVE",
      isDeleted: false,
    },
    select: { email: true },
  });

  await Promise.all(
    admins.map((admin) =>
      sendAdminApprovalRequestEmail(admin.email, {
        providerName: user.name,
        providerEmail: user.email,
        providerPhone: profile.phone ?? user.phone ?? null,
        businessName: profile.businessName,
        businessCategory: profile.businessCategory,
        businessEmail: profile.businessEmail,
        city: profile.city,
        street: profile.street,
        houseNumber: profile.houseNumber,
        apartment: profile.apartment ?? null,
        postalCode: profile.postalCode,
        binNumber: profile.binNumber ?? null,
      })
    )
  );

  return updatedProfile;
};

// ─── Provider Dashboard Stats ─────────────────────────────────────────────────

const getProviderDashboardStats = async (userId: string) => {
  const profile = await prisma.providerProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      totalGrossRevenue: true,
      totalPlatformFee: true,
      totalProviderEarning: true,
      currentPayableAmount: true,
      totalOrdersCompleted: true,
      lastPaymentAt: true,
    },
  });

  if (!profile) throw new NotFoundError("Provider profile not found.");

  const [
    placedOrders,
    cancelledOrders,
    deliveredOrders,
    activeOrders,
    totalOrders,
    paidSettlements,
    pendingSettlements,
    monthlyRevenue,
  ] = await Promise.all([
    prisma.order.count({ where: { providerId: profile.id, status: "PLACED" } }),
    prisma.order.count({ where: { providerId: profile.id, status: "CANCELLED" } }),
    prisma.order.count({ where: { providerId: profile.id, status: "DELIVERED" } }),
    prisma.order.count({
      where: {
        providerId: profile.id,
        status: { in: ["PLACED", "ACCEPTED", "PREPARING", "OUT_FOR_DELIVERY"] },
      },
    }),
    prisma.order.count({ where: { providerId: profile.id } }),
    prisma.payment.aggregate({
      where: {
        providerId: profile.id,
        status: "SUCCESS",
        providerSettlementStatus: "PAID",
      },
      _sum: { providerShareAmount: true },
      _count: true,
    }),
    prisma.payment.aggregate({
      where: {
        providerId: profile.id,
        status: "SUCCESS",
        providerSettlementStatus: "PENDING",
      },
      _sum: { providerShareAmount: true },
      _count: true,
    }),
    prisma.$queryRaw<Array<{ month: string; gross: number; fee: number; net: number }>>`
      SELECT
        TO_CHAR(DATE_TRUNC('month', p."paidAt"), 'Mon YY') AS month,
        COALESCE(SUM(p.amount), 0)::float AS gross,
        COALESCE(SUM(p."platformFeeAmount"), 0)::float AS fee,
        COALESCE(SUM(p."providerShareAmount"), 0)::float AS net
      FROM payments p
      WHERE p."providerId" = ${profile.id}
        AND p.status = 'SUCCESS'
        AND p."paidAt" >= NOW() - INTERVAL '6 months'
      GROUP BY DATE_TRUNC('month', p."paidAt")
      ORDER BY DATE_TRUNC('month', p."paidAt") ASC
    `,
  ]);

  return {
    overview: {
      totalGrossRevenue: Number(profile.totalGrossRevenue),
      totalPlatformFee: Number(profile.totalPlatformFee),
      totalProviderEarning: Number(profile.totalProviderEarning),
      currentPayableAmount: Number(profile.currentPayableAmount),
      totalOrdersCompleted: profile.totalOrdersCompleted,
      lastPaymentAt: profile.lastPaymentAt,
    },
    orders: {
      total: totalOrders,
      placed: placedOrders,
      active: activeOrders,
      delivered: deliveredOrders,
      cancelled: cancelledOrders,
    },
    settlements: {
      paid: {
        count: paidSettlements._count,
        amount: Number(paidSettlements._sum.providerShareAmount ?? 0),
      },
      pending: {
        count: pendingSettlements._count,
        amount: Number(pendingSettlements._sum.providerShareAmount ?? 0),
      },
    },
    monthlyRevenue,
  };
};

export const ProviderService = {
  getMyProfile,
  createProviderProfile,
  updateProviderProfile,
  deleteProviderImage,
  requestApproval,
  getProviderDashboardStats,
};