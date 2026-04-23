// src/modules/public/public.route.ts — COMPLETE REPLACEMENT

import { Router } from "express";
import { PublicController } from "./public.controller";

const router = Router();

/* ── Categories ───────────────────────────────────────────────────────────── */
router.get("/categories", PublicController.getCategories);

/* ── Restaurants ──────────────────────────────────────────────────────────── */
// IMPORTANT: /restaurants/featured must be registered BEFORE /restaurants/:id
// to prevent Express matching "featured" as an :id param.
router.get("/restaurants/featured", PublicController.getFeaturedRestaurants);
router.get("/restaurants",          PublicController.getRestaurants);
router.get("/restaurants/:id",      PublicController.getRestaurantById);

/* ── Homepage sections ────────────────────────────────────────────────────── */
// GET /public/top-dishes?limit=9
router.get("/top-dishes",   PublicController.getTopDishes);

// GET /public/testimonials?limit=9
router.get("/testimonials", PublicController.getHomeTestimonials);

export const PublicRoutes: Router = router;