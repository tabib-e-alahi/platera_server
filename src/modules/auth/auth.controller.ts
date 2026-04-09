// src/modules/auth/auth.controller.ts

import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { ILoginData } from "../../types/auth.type";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";

const registerCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body;
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

export const AuthController = {
  registerCustomer,
  registerProvider,
  loginUser,
};