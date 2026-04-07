import { Router } from "express";
import { AuthControler } from "./auth.controller";
const router = Router()

//  api/v1/auth/.....
router.post("/register-customer", AuthControler.registerCustomer);

router.post("/login-user", AuthControler.loginUser);

export const AuthRoutes: Router = router