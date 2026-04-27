import { Router } from "express";
import { ProviderController } from "./provider.controller";
import authMiddleware, { UserRole } from "../../middlewares/auth.middleware";
import validateRequest from "../../middlewares/validateRequest";
import {
  uploadProviderImages,
  uploadProviderImagesOptional,
} from "../../middlewares/upload.middleware";
import {
  createProviderProfileSchema,
  updateProviderProfileSchema,
  deleteImageSchema,
} from "./provider.validation";

const router = Router();

// ─── Profile setup — auth only, no providerGuard ──────────────────────────────
// provider must access these routes before getting approved

router.get(
  "/profile/me",
  authMiddleware(UserRole.PROVIDER),
  ProviderController.getMyProfile
);

router.get(
  "/dashboard/stats",
  authMiddleware(UserRole.PROVIDER),
  ProviderController.getDashboardStats
);

router.post(
  "/profile",
  authMiddleware(UserRole.PROVIDER),
  uploadProviderImages,                        
  validateRequest(createProviderProfileSchema),  
  ProviderController.createProfile             
);

router.patch(
  "/profile",
  authMiddleware(UserRole.PROVIDER),
  uploadProviderImagesOptional,
  validateRequest(updateProviderProfileSchema),
  ProviderController.updateProfile
);


router.delete(
  "/profile/image",
  authMiddleware(UserRole.PROVIDER),
  validateRequest(deleteImageSchema),
  ProviderController.deleteImage
);

router.post(
  "/profile/request-approval",
  authMiddleware(UserRole.PROVIDER),
  ProviderController.requestApproval
);

// ─── Business routes — auth + providerGuard ───────────────────────────────────
// only APPROVED providers reach here
// meal routes, order routes etc. go below

// example:
// router.get(
//   "/meals",
//   authMiddleware(UserRole.PROVIDER),
//   providerGuard,
//   MealController.getMyMeals
// );

export const ProviderRoutes: Router = router;