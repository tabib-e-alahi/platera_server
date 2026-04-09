// src/middlewares/auth.middleware.ts

import { Request, Response, NextFunction } from "express";
import { auth } from "../lib/auth";
import { ForbiddenError, UnauthorizedError } from "../errors/AppError";

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
      const session = await auth.api.getSession({
        headers: req.headers as unknown as Headers,
      });

      if (!session?.user) {
        throw new UnauthorizedError(
          "You are not logged in. Please log in to continue."
        );
      }

      const { user } = session;

      // cast to any first then assign — avoids the type conflict
      // between Better Auth's inferred user type and our augmented type
      const typedUser = user as unknown as Express.Request["user"];

      if (typedUser.isDeleted) {
        throw new ForbiddenError(
          "This account no longer exists. Please contact support."
        );
      }

      if (typedUser.status === "SUSPENDED") {
        throw new ForbiddenError(
          "Your account has been suspended. Please contact support."
        );
      }

      if (roles.length > 0 && !roles.includes(typedUser.role as UserRole)) {
        throw new ForbiddenError(
          "You do not have permission to access this resource."
        );
      }

      // THIS is what makes req.user available in all subsequent middleware
      req.user = typedUser;
      req.session = session.session as unknown as Express.Request["session"];

      next();
    } catch (error) {
      next(error);
    }
  };
};

export default authMiddleware;