// src/middlewares/providerGuard.middleware.ts

import { Request, Response, NextFunction } from "express"; // missing import
import { ForbiddenError, NotFoundError } from "../errors/AppError";
import { prisma } from "../lib/prisma";

const providerGuard = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const profile = await prisma.providerProfile.findUnique({
      where: { userId: req.user.id },
      select: {
        approvalStatus: true,
        rejectionReason: true,
      },
    });

    if (!profile) {
      throw new NotFoundError(
        "Please complete your provider profile first."
      );
    }

    if (profile.approvalStatus === "DRAFT") {
      throw new ForbiddenError(
        "Please complete your profile and request approval before accessing this feature."
      );
    }

    if (profile.approvalStatus === "PENDING") {
      throw new ForbiddenError(
        "Your provider profile is under review. You will be notified once approved."
      );
    }

    if (profile.approvalStatus === "REJECTED") {
      throw new ForbiddenError(
        `Your provider profile was rejected. Reason: ${
          profile.rejectionReason ?? "No reason provided"
        }. Please update and resubmit.`
      );
    }

    next();
  } catch (error) {
    next(error);
  }
};

export default providerGuard;