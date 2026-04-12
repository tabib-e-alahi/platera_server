import { ForbiddenError, NotFoundError } from "../errors/AppError";
import { prisma } from "../lib/prisma";

export const getProviderProfile = async (userId: string) => {
  const profile = await prisma.providerProfile.findUnique({
    where: { userId },
    select: {
      id: true,
      approvalStatus: true,
      isActive: true,
    },
  });

  if (!profile) {
    throw new NotFoundError(
      "Provider profile not found."
    );
  }

  if (profile.approvalStatus !== "APPROVED") {
    throw new ForbiddenError(
      "Your provider profile must be approved before managing meals."
    );
  }

  return profile;
};