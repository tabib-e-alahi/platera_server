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
import { OrderRoutes } from "../modules/order/order.routes";
import { PaymentRoutes } from "../modules/payment/payment.routes";
import { ReviewRoutes } from "../modules/reviews/review.routes";
import { SupportAdminRoutes, SupportPublicRoutes } from "../modules/support/support.routes";


const router = Router()

router.use("/auth", AuthRoutes);

router.use("/public", PublicRoutes);
router.use("/support", SupportPublicRoutes);

router.use("/customers", CustomerRoutes);
router.use("/cart", CartRoutes);
router.use("/orders", OrderRoutes);
router.use("/payments", PaymentRoutes);
router.use("/reviews",  ReviewRoutes);

router.use("/provider/meals", MealRoutes)
router.use("/providers", ProviderRoutes)

router.use("/admins", authMiddleware(UserRole.ADMIN, UserRole.SUPER_ADMIN), adminGuard, AdminRoutes)
router.use(
  "/admins/support",
  authMiddleware(UserRole.ADMIN, UserRole.SUPER_ADMIN),
  adminGuard,
  SupportAdminRoutes
);

export const IndexRoutes: Router = router