// src/middlewares/validateRequest.ts — update to handle JSON string fields

import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const JSON_FIELDS = [
  "sizes",
  "spiceLevels",
  "addOns",
  "removeOptions",
  "ingredients",
  "dietaryPreferences",
  "allergens",
  "tags",
  "galleryImageURLs",
];

const validateRequest = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    // parse JSON string fields from multipart/form-data
    for (const field of JSON_FIELDS) {
      if (
        req.body[field] !== undefined &&
        typeof req.body[field] === "string"
      ) {
        try {
          req.body[field] = JSON.parse(req.body[field]);
        } catch {
          // not valid JSON — leave as is, Zod will reject it
        }
      }
    }

    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(result.error);
      return;
    }

    req.body = result.data;
    next();
  };
};

export default validateRequest;