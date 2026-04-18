import { Router } from "express";
import { PublicController } from "./public.controller";

const router = Router()

router.get("/categories", PublicController.getCategories)

router.get("/restaurants", PublicController.getRestaurants);
router.get("/restaurants/featured", PublicController.getFeaturedRestaurants);
router.get("/restaurants/:id", PublicController.getRestaurantById);

export const PublicRoutes: Router = router;