// src/types/express.d.ts

import { Session } from "better-auth";
import { AuthSession, AuthUser } from "../lib/auth";

declare global {
  namespace Express {
    interface Request {
      user: AuthUser;
      session: AuthSession;
    }
  }
}