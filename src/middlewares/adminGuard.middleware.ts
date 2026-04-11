// src/middlewares/adminGuard.middleware.ts

import { Request, Response, NextFunction } from "express";
import { ForbiddenError } from "../errors/AppError";

// basic admin guard — ADMIN and SUPER_ADMIN both allowed
export const adminGuard = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const role = req.user.role;

  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    throw new ForbiddenError(
      "Access restricted to admin accounts only."
    );
  }

  next();
};

// super admin only guard — for sensitive operations
export const superAdminGuard = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  const role = req.user.role;

  if (role !== "SUPER_ADMIN") {
    throw new ForbiddenError(
      "Access restricted to super admin only."
    );
  }

  next();
};