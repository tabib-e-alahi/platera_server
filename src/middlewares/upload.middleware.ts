// src/middlewares/upload.middleware.ts

import { Request, Response, NextFunction } from "express";
import { mealImageUpload, providerProfileUpload } from "../config/multer.config";
import { BadRequestError } from "../errors/AppError";

// used for profile creation — images go with text fields
export const uploadProviderImages = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const upload = providerProfileUpload.fields([
    { name: "nidImages", maxCount: 2 },
    { name: "businessMainGate", maxCount: 1 },
    { name: "businessKitchen", maxCount: 1 },
     { name: "profileImage", maxCount: 1 },
  ]);

  upload(req, res, (err) => {
    if (err) {
      return next(new BadRequestError(err.message));
    }
    next();
  });
};

// used for profile updates — all image fields optional
export const uploadProviderImagesOptional = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const upload = providerProfileUpload.fields([
    { name: "nidImages", maxCount: 2 },
    { name: "businessMainGate", maxCount: 1 },
    { name: "businessKitchen", maxCount: 1 },
    { name: "profileImage", maxCount: 1 },
  ]);

  upload(req, res, (err) => {
    if (err) {
      return next(new BadRequestError(err.message));
    }
    next();
  });
};

// src/middlewares/upload.middleware.ts — add this

export const uploadMealImages = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const upload = mealImageUpload.fields([
    { name: "mainImage", maxCount: 1 },      // required
    { name: "galleryImages", maxCount: 5 },  // optional, max 5
  ]);

  upload(req, res, (err) => {
    if (err) {
      return next(new BadRequestError(err.message));
    }
    next();
  });
};

export const uploadMealImagesOptional = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const upload = mealImageUpload.fields([
    { name: "mainImage", maxCount: 1 },
    { name: "galleryImages", maxCount: 5 },
  ]);

  upload(req, res, (err) => {
    if (err) {
      return next(new BadRequestError(err.message));
    }
    next();
  });
};