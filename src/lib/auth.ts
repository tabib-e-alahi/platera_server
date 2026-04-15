import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";
import { userAccountStatus, UserRole } from "../../generated/prisma/enums";
import envConfig from "../config";
import { emailOTP } from "better-auth/plugins";
import { sendEmailVerificationOTP } from "../utils/emailTemplates.utils";

export const auth = betterAuth({
    database: prismaAdapter(prisma, {
        provider: "postgresql", // or "mysql", "postgresql", ...etc
    }),
    session: {
        expiresIn: 60 * 60 * 24 * 7,    // 7 days in seconds
        updateAge: 60 * 60 * 24,         // 1 day in seconds
        cookieCache: {
            enabled: true,
            maxAge: 60 * 5,                // re-validate against DB every 5 minutes
        },
    },
    emailAndPassword: {
        enabled: true,
        requireEmailVerification: true,
    },
    emailVerification: {
        sendOnSignUp: true,
        sendOnSignIn: true,
        autoSignInAfterVerification: true,
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

    plugins: [
        emailOTP({
            overrideDefaultEmailVerification: true,
            async sendVerificationOTP({ email, otp, type }) {
                if (type === "email-verification") {
                    const user = await prisma.user.findUnique({
                        where: {
                            email
                        }
                    })
                    if (user && !user.emailVerified) {
                        const name = user.name
                        await sendEmailVerificationOTP(name, email, otp);
                    }

                }
            },
            expiresIn: 2 * 60
        })
    ],

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