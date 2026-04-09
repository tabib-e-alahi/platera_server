// src/modules/provider/provider.controller.ts

import { Request, Response, NextFunction } from "express";
import { ProviderService } from "./provider.service";
import {
  TCreateProviderProfile,
  TUpdateProviderProfile,
  TDeleteImage,
} from "./provider.validation";
import status from "http-status";
import { sendResponse } from "../../utils/sendResponse";
import { extractProviderImages } from "../../utils/extractFiles";

const getMyProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const result = await ProviderService.getMyProfile(req.user.id);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: result
        ? "Profile fetched successfully."
        : "No profile found. Please complete your profile setup.",
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
    const payload = req.body as TCreateProviderProfile;
    const images = extractProviderImages(req);

    const result = await ProviderService.createProviderProfile(
      req.user.id,
      payload,
      images
    );

    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "Provider profile created successfully.",
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
    const payload = req.body as TUpdateProviderProfile;
    const images = extractProviderImages(req);

    const result = await ProviderService.updateProviderProfile(
      req.user.id,
      payload,
      images
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Profile updated successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deleteImage = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { imageType } = req.body as TDeleteImage;

    const result = await ProviderService.deleteProviderImage(
      req.user.id,
      imageType
    );

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Image deleted successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// const requestApproval = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<void> => {
//   try {
//     const result = await ProviderService.requestApproval(req.user.id);
//     sendResponse(res, {
//       httpStatusCode: status.OK,
//       success: true,
//       message:
//         "Approval request submitted. You will be notified once reviewed.",
//       data: result,
//     });
//   } catch (error) {
//     next(error);
//   }
// };

export const ProviderController = {
  getMyProfile,
  createProfile,
  updateProfile,
  deleteImage,
  // requestApproval,
};