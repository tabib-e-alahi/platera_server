// src/utils/extractFiles.util.ts

import { Request } from "express";

export interface IProviderUploadedImages {
  nidImageFrontURL?: string;
  nidImageBackURL?: string;
  businessMainGateURL?: string;
  businessKitchenURL?: string;
  profileImageURL?: string;
}

export const extractProviderImages = (
  req: Request
): IProviderUploadedImages => {
  // multer-storage-cloudinary sets .path as the Cloudinary secure URL
  const files = req.files as
    | Record<string, Express.Multer.File[]>
    | undefined;

  if (!files) return {};

  const result: IProviderUploadedImages = {};

  if (files.nidImages) {
    if (files.nidImages[0]) {
      result.nidImageFrontURL = files.nidImages[0].path;
    }
    if (files.nidImages[1]) {
      result.nidImageBackURL = files.nidImages[1].path;
    }
  }

  if (files.businessMainGate?.[0]) {
    result.businessMainGateURL = files.businessMainGate[0].path;
  }

  if (files.businessKitchen?.[0]) {
    result.businessKitchenURL = files.businessKitchen[0].path;
  }

  if (files.profileImage?.[0]) {
    result.profileImageURL = files.profileImage[0].path;
  }

  return result;
};