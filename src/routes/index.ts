import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ProviderRoutes } from "../modules/provider/provider.routes";
import { AdminRoutes } from "../modules/admin/admin.routes";
import authMiddleware, { UserRole } from "../middlewares/auth.middleware";
import { adminGuard } from "../middlewares/adminGuard.middleware";
import { PublicRoutes } from "../modules/public/public.route";
import { MealRoutes } from "../modules/meal/meal.routes";
import { CustomerRoutes } from "../modules/customer/customer.routes";
import { CartRoutes } from "../modules/cart/cart.routes";


const router = Router()

router.use("/auth", AuthRoutes);
router.use("/public", PublicRoutes);
router.use("/customers", CustomerRoutes);
router.use("/cart", CartRoutes);
router.use("/provider/meals", MealRoutes)
router.use("/providers", ProviderRoutes)

router.use("/admins", authMiddleware(UserRole.ADMIN, UserRole.SUPER_ADMIN), adminGuard, AdminRoutes)

export const IndexRoutes: Router = router