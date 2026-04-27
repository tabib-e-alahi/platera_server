// src/modules/support/support.routes.ts

import { Router } from "express";
import { SupportController } from "./support.controller";
import validateRequest from "../../middlewares/validateRequest";
import { createSupportMessageSchema } from "./support.validation";

const router = Router();

// Public — no auth required (contact form submission)
router.post(
  "/",
  validateRequest(createSupportMessageSchema),
  SupportController.createMessage
);

export const SupportPublicRoutes: Router = router;

// ─── Admin routes (mounted separately with auth guard in index.ts) ─────────────

const adminRouter = Router();

adminRouter.get("/",        SupportController.getMessages);
adminRouter.get("/:id",     SupportController.getMessageById);
adminRouter.patch("/:id",   SupportController.updateMessageStatus);
adminRouter.delete("/:id",  SupportController.deleteMessage);

export const SupportAdminRoutes: Router = adminRouter;
