import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { userAccountStatus, UserRole } from "../../generated/prisma/enums";
import envConfig from "../config";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    emailAndPassword: {
        enabled: true,
        // requireEmailVerification: true,
    },
    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: UserRole.CUSTOMER,
                input: false, // never accept from client, I will set it in the code
            },
            status: {
                type: "string",
                required: true,
                defaultValue: userAccountStatus.ACTIVE,
                input: false,   // never accept from client, I will set it in the code
            },
            phone: {
                type: "string",
                required: false,
                input: true,
            },
            needPasswordChange: {
                type: "boolean",
                required: false,
                defaultValue: false,
            },
            isDeleted: {
                type: "boolean",
                required: false,
                defaultValue: false,
            },
            deletedAt: {
                type: "date",
                required: false,
                defaultValue: null,
            }

        }
    },

    trustedOrigins: [
    envConfig.frontend_local_host,
    "http://localhost:5000",  // allow Postman requests
    "http://localhost:3000",  // frontend dev server
  ],

    // advanced: {
    //     disableCSRFCheck: true, // Disable CSRF check for testing purposes. In production, you should handle CSRF properly.
    // }
    // src/lib/auth.ts

    databaseHooks: {
        user: {
            create: {
                before: async (user, context) => {
                    const intendedRole =
                        context?.headers?.get("x-intended-role") || "CUSTOMER";

                    return {
                        data: {
                            ...user,
                            role: intendedRole,
                        },
                    };
                },
            },
            
        },
    },
});

export type AuthUser = typeof auth.$Infer.Session.user;
export type AuthSession = typeof auth.$Infer.Session.session;