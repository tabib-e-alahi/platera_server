import { ForbiddenError, NotFoundError } from "../errors/AppError";
import { prisma } from "../lib/prisma";

export const getMealOwnership = async (
  mealId: string,
  providerId: string
) => {
  const meal = await prisma.meal.findUnique({
    where: { id: mealId },
    select: { id: true, providerId: true },
  });

  if (!meal) {
    throw new NotFoundError("Meal not found.");
  }

  if (meal.providerId !== providerId) {
    throw new ForbiddenError(
      "You do not have permission to modify this meal."
    );
  }

  return meal;
};