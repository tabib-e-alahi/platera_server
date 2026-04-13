import { NextFunction, Request, Response } from "express";
import status from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { CustomerService } from "./customer.service";
import {
  TCreateCustomerProfile,
  TUpdateCustomerProfile,
} from "./customer.validation";

const getMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await CustomerService.getMyProfile(req.user.id);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: result
        ? "Customer profile fetched successfully."
        : "No customer profile found. Please complete your profile setup.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const createProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body as TCreateCustomerProfile;

    const result = await CustomerService.createCustomerProfile(
      req.user.id,
      payload
    );

    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "Customer profile created successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const updateProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body as TUpdateCustomerProfile;

    const result = await CustomerService.updateCustomerProfile(
      req.user.id,
      payload
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Customer profile updated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const CustomerController = {
  getMyProfile,
  createProfile,
  updateProfile,
};