import { userAccountStatus } from "../../../generated/prisma/enums";
import {
  AppError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
} from "../../errors/AppError";
import { auth } from "../../lib/auth";
import { prisma } from "../../lib/prisma";
import {
  ICustomerRegisterData,
  ILoginData,
  IProviderRegisterData,
} from "../../types/auth.type";
import status from "http-status";


const getMe = async (userId: string) => {
  const userData = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      role: true,
      status: true,
      isDeleted: true,
      emailVerified: true,
    },
  });
  return userData;
};

const sessionCheck = async (user: any) => {
  let hasProviderProfile = false;
  let providerProfileStatus: "DRAFT" | "PENDING" | "APPROVED" | "REJECTED" | null = null;

  if (user.role === "PROVIDER") {
    const profile = await prisma.providerProfile.findUnique({
      where: { userId: user.id },
      select: { approvalStatus: true },
    });

    if (profile) {
      hasProviderProfile = true;
      providerProfileStatus = profile.approvalStatus;
    }
  }

  return {
    isAuthenticated: true,
    user: {
      id: user.id,
      role: user.role,
      email: user.email,
      name: user.name,
    },
    hasProviderProfile,
    providerProfileStatus,
  };
};

const registerCustomer = async (payload: ICustomerRegisterData) => {
  const { name, email, password } = payload;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, isDeleted: true },
  });

  if (existingUser) {
    if (existingUser.isDeleted) {
      throw new ForbiddenError(
        "This email is associated with a deleted account. Please contact support."
      );
    }
    throw new ConflictError("An account with this email already exists.");
  }

  const result = await auth.api.signUpEmail({
    body: { name, email, password },
    headers: new Headers({ "x-intended-role": "CUSTOMER" }),
  });

  if (!result.user) {
    throw new BadRequestError("Failed to create your account.");
  }

  return result.user;
};

const registerProvider = async (payload: IProviderRegisterData) => {
  const { name, email, password } = payload;

  const existingUser = await prisma.user.findUnique({
    where: { email },
    select: { id: true, isDeleted: true },
  });

  if (existingUser) {
    if (existingUser.isDeleted) {
      throw new ForbiddenError(
        "This email is associated with a deleted account. Please contact support."
      );
    }
    throw new ConflictError("An account with this email already exists.");
  }

  const result = await auth.api.signUpEmail({
    body: { name, email, password },
    headers: new Headers({ "x-intended-role": "PROVIDER" }),
  });

  if (!result.user) {
    throw new BadRequestError("Failed to create provider account.");
  }

  return result.user;
};

const loginUser = async (payload: ILoginData, headers: Headers) => {
  const { email, password } = payload;

  const { headers: responseHeaders, response } = await auth.api.signInEmail({
    body: {
      email,
      password,
    },
    headers,
    returnHeaders: true,
  });

  if (response.user.status === userAccountStatus.SUSPENDED) {
    throw new AppError(
      "User is suspended. Please contact support.",
      status.FORBIDDEN
    );
  }

  if (response.user.isDeleted) {
    throw new AppError(
      "This user account was deleted. Please contact support.",
      status.NOT_FOUND
    );
  }
  const hasProviderProfile = await prisma.providerProfile.findUnique({
    where: {
      userId: response.user.id
    },
    select: {
      id: true
    }
  })

  return {
    data: response,
    headers: responseHeaders,
    hasProviderProfile
  };
};

const verifyEmail = async (email: string, otp: string) => {
  const result = await auth.api.verifyEmailOTP({
    body: { email, otp },
  });

  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    });
  }
};

const logoutUser = async (headers: Headers) => {
  return await auth.api.signOut({ headers, returnHeaders: true });
};

export const AuthService = {
  registerCustomer,
  registerProvider,
  loginUser,
  getMe,
  sessionCheck,
  logoutUser,
  verifyEmail,
};