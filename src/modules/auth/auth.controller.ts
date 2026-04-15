// src/modules/auth/auth.controller.ts

import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { ILoginData } from "../../types/auth.type";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { auth } from "../../lib/auth";

//* get current user data
const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user.id;
    const result = await AuthService.getMe(userId);

    return sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "You profile data fetched successfully.",
      data: result
    })

  } catch (error) {
    next(error)
  }
}

const sessionCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as unknown as Headers,
    })

    if (!session?.user) {
      sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "No session.",
        data: null,
      })
      return
    }

    const user = session.user as any
    const result = await AuthService.sessionCheck(user);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Session found.",
      data: result,
    })
  } catch (error) {
    next(error)
  }
}


const registerCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body;
    console.log(payload);
    const result = await AuthService.registerCustomer(payload);
    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "Customer registered successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const registerProvider = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body;
    const result = await AuthService.registerProvider(payload);
    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message:
        "Provider account created. Please check your email to verify your account.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body as ILoginData;

    // pass req and res so Better Auth can set the cookie
    const result = await AuthService.loginUser(payload, req as any, res as any);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Login successful.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;
    await AuthService.verifyEmail(email, otp);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Email verified successfully",
    });
  }
  catch (error) {
    next(error)
  }

}

export const AuthController = {
  registerCustomer,
  registerProvider,
  loginUser,
  getMe,
  sessionCheck,
  verifyEmail
};