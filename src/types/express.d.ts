// src/types/express.d.ts

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
        name: string;
        email: string;
        emailVerified: boolean;
        image: string | null | undefined;
        role: "CUSTOMER" | "PROVIDER" | "ADMIN" | "SUPER_ADMIN";
        status: "ACTIVE" | "SUSPENDED";
        isDeleted: boolean;
        phone: string | null | undefined;
        createdAt: Date;
        updatedAt: Date;
      };
      session: {
        id: string;
        token: string;
        userId: string;
        expiresAt: Date;
        ipAddress: string | null | undefined;
        userAgent: string | null | undefined;
        createdAt: Date;
        updatedAt: Date;
      };
    }
  }
}

export {}; // this line is required — makes the file a module
            // so the declare global block works correctly