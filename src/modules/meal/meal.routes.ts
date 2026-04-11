// src/modules/meal/meal.routes.ts

import { Router } from "express";
import { MealController } from "./meal.controller";
import authMiddleware, {
  UserRole,
} from "../../middlewares/auth.middleware";
import providerGuard from "../../middlewares/providerGuard.middleware";
import validateRequest from "../../middlewares/validateRequest";
import {
  uploadMealImages,
  uploadMealImagesOptional,
} from "../../middlewares/upload.middleware";
import {
  createMealSchema,
  updateMealSchema,
  toggleAvailabilitySchema,
} from "./meal.validation";

const router = Router();

// all meal routes require auth + providerGuard
// providerGuard ensures provider is APPROVED
router.use(
  authMiddleware(UserRole.PROVIDER),
  providerGuard
);

router.get(
  "/",
  MealController.getMyMeals
);

router.get(
  "/:id",
  MealController.getMyMealById
);

router.post(
  "/",
  uploadMealImages,                        // 1. process images
  validateRequest(createMealSchema),       // 2. validate text
  MealController.createMeal                // 3. handle
);

router.patch(
  "/:id",
  uploadMealImagesOptional,
  validateRequest(updateMealSchema),
  MealController.updateMeal
);

router.patch(
  "/:id/availability",
  validateRequest(toggleAvailabilitySchema),
  MealController.toggleAvailability
);

router.delete(
  "/:id",
  MealController.deleteMeal
);

router.delete(
  "/:id/gallery",
  MealController.deleteGalleryImage
);

export const MealRoutes: Router = router;
