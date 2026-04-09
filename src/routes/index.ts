import { Router } from "express";
import { AuthRoutes } from "../modules/auth/auth.route";
import { ProviderRoutes } from "../modules/provider/provider.routes";


const router = Router()

router.use("/auth", AuthRoutes);
router.use("/providers", ProviderRoutes)

export const IndexRoutes: Router = router