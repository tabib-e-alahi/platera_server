import { Router } from "express";
import { PublicController } from "./public.controller";

const router = Router()

router.get("/categories", PublicController.getCategories)

export const PublicRoutes: Router = router;