// src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth";
import {
  UnauthorizedError,
  ForbiddenError,
} from "../errors/AppError";

export enum UserRole {
  CUSTOMER = "CUSTOMER",
  PROVIDER = "PROVIDER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

const authMiddleware = (...roles: UserRole[]) => {
  return async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      // pass req.headers so Better Auth can read the session cookie
      const session = await auth.api.getSession({
        headers: req.headers as unknown as Headers,
      });

      if (!session?.user) {
        throw new UnauthorizedError(
          "You are not logged in. Please log in to continue."
        );
      }

      const { user } = session;

      if ((user as any).isDeleted) {
        throw new ForbiddenError(
          "This account no longer exists. Please contact support."
        );
      }

      if ((user as any).status === "SUSPENDED") {
        throw new ForbiddenError(
          "Your account has been suspended. Please contact support."
        );
      }

      if (roles.length > 0) {
        const userRole = (user as any).role as UserRole;
        if (!roles.includes(userRole)) {
          throw new ForbiddenError(
            "You do not have permission to access this resource."
          );
        }
      }

      req.user = user as any;
      req.session = session.session as any;

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authMiddleware;