// src/modules/auth/auth.service.ts

import { Response as ExpressResponse } from "express";
import { userAccountStatus } from "../../../generated/prisma/enums";
import {
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


const getMe = async (userId: string) => {
  const userData = await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      role: true,
      status: true,
      isDeleted: true,
      emailVerified: true
    }
  })

  return userData;
}

const sessionCheck = async (user: any) => {
  let hasProviderProfile = false
  if (user.role === "PROVIDER") {
    const profile = await prisma.providerProfile.findUnique({
      where: { userId: user.id },
      select: { id: true },
    })
    hasProviderProfile = !!profile
  }

  return {
    id: user.id,
    role: user.role,
    status: user.status,
    isDeleted: user.isDeleted,
    emailVerified: user.emailVerified,
    hasProviderProfile,
  }
}

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
    throw new ConflictError(
      "An account with this email already exists."
    );
  }

  const result = await auth.api.signUpEmail({
    body: { name, email, password },
    headers: new Headers({
      "x-intended-role": "CUSTOMER",
    }),
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
    throw new ConflictError(
      "An account with this email already exists."
    );
  }

  const result = await auth.api.signUpEmail({
    body: { name, email, password },
    headers: new Headers({
      "x-intended-role": "PROVIDER",
    }),
  });

  if (!result.user) {
    throw new BadRequestError("Failed to create provider account.");
  }

  return result.user;
};

// loginUser now receives req and res to pass to Better Auth
// so it can properly set the session cookie on the response
const loginUser = async (
  payload: ILoginData,
  req: Request,
  res: ExpressResponse
) => {
  const { email, password } = payload;

  // check user status BEFORE attempting login
  const user = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      status: true,
      isDeleted: true,
    },
  });

  if (user) {
    if (user.isDeleted) {
      throw new ForbiddenError(
        "This account has been deleted. Please contact support."
      );
    }
    if (user.status === userAccountStatus.SUSPENDED) {
      throw new ForbiddenError(
        "Your account has been suspended. Please contact support."
      );
    }
  }

  // pass req.headers so Better Auth can set the cookie
  // on the actual HTTP response
  const loginData = await auth.api.signInEmail({
    body: { email, password },
    headers: req.headers as unknown as Headers,
    asResponse: true, // returns a full Response object with Set-Cookie header
  });

  // copy all headers from Better Auth response to Express response
  // this is what actually sets the session cookie
  loginData.headers.forEach((value, key) => {
    res.setHeader(key, value);
  });

  const body = await loginData.json() as {
    user: Record<string, unknown>;
    session: Record<string, unknown>;
  };

  return body;
};



const verifyEmail = async (email: string, otp: string) => {

  const result = await auth.api.verifyEmailOTP({
    body: {
      email,
      otp,
    }
  })

  if (result.status && !result.user.emailVerified) {
    await prisma.user.update({
      where: {
        email,
      },
      data: {
        emailVerified: true,
      }
    })
  }
}

export const AuthService = {
  registerCustomer,
  registerProvider,
  loginUser,
  getMe,
  sessionCheck,
  verifyEmail
};