// src/modules/public/public.route.ts — COMPLETE REPLACEMENT

import { Router } from "express";
import { PublicController } from "./public.controller";

const router = Router();

router.get("/categories", PublicController.getCategories);
router.get("/hero-stats", PublicController.getHeroStats);
router.get("/restaurants/featured", PublicController.getFeaturedRestaurants);
router.get("/restaurants",          PublicController.getRestaurants);
router.get("/restaurants/:id",      PublicController.getRestaurantById);
router.get("/top-dishes",   PublicController.getTopDishes);
router.get("/testimonials", PublicController.getHomeTestimonials);

export const PublicRoutes: Router = router;