// src/lib/auth.ts
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { userAccountStatus, UserRole } from "../../generated/prisma/enums";
import envConfig from "../config";
import { emailOTP, oAuthProxy } from "better-auth/plugins";
import { sendEmailVerificationOTP } from "../utils/emailTemplates.utils";


export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql",
    }),
    baseURL: envConfig.frontend_production_host,
    secret: envConfig.BETTER_AUTH_SECRET,

    advanced: {
        cookies: {
            session_token: {
                name: "session_token", // Force this exact name
                attributes: {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    partitioned: true,
                },
            },
            state: {
                name: "session_token", // Force this exact name
                attributes: {
                    httpOnly: true,
                    secure: true,
                    sameSite: "none",
                    partitioned: true,
                },
            },
        },
    },

    session: {
        expiresIn: 60 * 60 * 24 * 7,
        updateAge: 60 * 60 * 24,
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5,
        },
    },

    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },

    socialProviders: {
        google: {
            clientId: envConfig.GOOGLE_CLIENT_ID,
            clientSecret: envConfig.GOOGLE_CLIENT_SECRET,
            prompt: "select_account consent",
            mapProfileToUser: () => ({
                role: UserRole.CUSTOMER,
                status: userAccountStatus.ACTIVE,
                isDeleted: false,
                needPasswordChange: false,
                emailVerified: true,
            }),
        },
    },

    emailVerification: {
        sendOnSignUp: true,
        sendOnSignIn: true,
        autoSignInAfterVerification: true,
    },

    trustedOrigins: [
        envConfig.frontend_local_host,
        envConfig.frontend_production_host,
        envConfig.BACKEND_PROD_HOST,
        envConfig.BETTER_AUTH_URL,
        "http://localhost:3000",
        "http://localhost:5000",
    ].filter(Boolean),

    user: {
        additionalFields: {
            role: {
                type: "string",
                required: true,
                defaultValue: UserRole.CUSTOMER,
                input: false,
            },
            status: {
                type: "string",
                required: true,
                defaultValue: userAccountStatus.ACTIVE,
                input: false,
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
            },
        },
    },

    plugins: [
        emailOTP({
            overrideDefaultEmailVerification: true,
            async sendVerificationOTP({ email, otp, type }) {
                if (type === "email-verification") {
                    const user = await prisma.user.findUnique({ where: { email } });
                    if (user && !user.emailVerified) {
                        await sendEmailVerificationOTP(user.name, email, otp);
                    }
                }
            },
            expiresIn: 2 * 60,
        }),
        oAuthProxy()
    ],

    databaseHooks: {
        user: {
            create: {
                before: async (user, context) => {
                    const intendedRole =
                        context?.headers?.get("x-intended-role") || "CUSTOMER";
                    return {
                        data: { ...user, role: intendedRole },
                    };
                },
            },
        },
    },
});

export type AuthUser = typeof auth.$Infer.Session.user;
export type AuthSession = typeof auth.$Infer.Session.session;