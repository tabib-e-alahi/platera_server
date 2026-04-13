import { prisma } from "../../lib/prisma";
import {
  ConflictError,
  ForbiddenError,
  NotFoundError,
} from "../../errors/AppError";
import {
  TCreateCustomerProfile,
  TUpdateCustomerProfile,
} from "./customer.validation";

const normalizeCity = (city: string) => city.trim().toUpperCase();

const getMyProfile = async (userId: string) => {
  const profile = await prisma.customerProfile.findUnique({
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
          role: true,
        },
      },
    },
  });

  return profile;
};

const createCustomerProfile = async (
  userId: string,
  payload: TCreateCustomerProfile
) => {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      status: true,
      isDeleted: true,
      emailVerified: true,
      phone: true,
    },
  });

  if (!user) {
    throw new NotFoundError("User not found.");
  }

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
      "Please verify your email address before creating your profile."
    );
  }

  if (user.role !== "CUSTOMER") {
    throw new ForbiddenError(
      "Only customer accounts can create a customer profile."
    );
  }

  const existingProfile = await prisma.customerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (existingProfile) {
    throw new ConflictError(
      "You already have a customer profile. Use the update endpoint instead."
    );
  }

  const profile = await prisma.customerProfile.create({
    data: {
      user: { connect: { id: userId } },
      phone: payload.phone ?? user.phone ?? null,
      city: normalizeCity(payload.city),
      streetAddress: payload.streetAddress,
      houseNumber: payload.houseNumber ?? null,
      apartment: payload.apartment ?? null,
      postalCode: payload.postalCode ?? null,
      latitude: payload.latitude ?? null,
      longitude: payload.longitude ?? null,
    },
  });

  return profile;
};

const updateCustomerProfile = async (
  userId: string,
  payload: TUpdateCustomerProfile
) => {
  const profile = await prisma.customerProfile.findUnique({
    where: { userId },
    select: { id: true },
  });

  if (!profile) {
    throw new NotFoundError(
      "Customer profile not found. Please create your profile first."
    );
  }

  const updateData: Record<string, unknown> = {};

  if (payload.phone !== undefined) {
    updateData.phone = payload.phone ?? null;
  }

  if (payload.city !== undefined) {
    updateData.city = normalizeCity(payload.city);
  }

  if (payload.streetAddress !== undefined) {
    updateData.streetAddress = payload.streetAddress;
  }

  if (payload.houseNumber !== undefined) {
    updateData.houseNumber = payload.houseNumber ?? null;
  }

  if (payload.apartment !== undefined) {
    updateData.apartment = payload.apartment ?? null;
  }

  if (payload.postalCode !== undefined) {
    updateData.postalCode = payload.postalCode ?? null;
  }

  if (payload.latitude !== undefined) {
    updateData.latitude = payload.latitude;
  }

  if (payload.longitude !== undefined) {
    updateData.longitude = payload.longitude;
  }

  const updatedProfile = await prisma.customerProfile.update({
    where: { userId },
    data: updateData,
  });

  return updatedProfile;
};

export const CustomerService = {
  getMyProfile,
  createCustomerProfile,
  updateCustomerProfile,
};