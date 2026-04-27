import { Request, Response, NextFunction } from "express";
import { AuthService } from "./auth.service";
import { ILoginData } from "../../types/auth.type";
import { sendResponse } from "../../utils/sendResponse";
import status from "http-status";
import { auth } from "../../lib/auth";

const getMe = async (req: Request, res: Response, next: NextFunction) => {
  console.log("Hittted from geME");
  try {
    console.log("Hittted from geME ");
    const userId = req.user.id;
    console.log(userId);
    const result = await AuthService.getMe(userId);

    return sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Your profile data fetched successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const sessionCheck = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const session = await auth.api.getSession({
      headers: req.headers as unknown as Headers,
    });

    console.log("session check", session);

    if (!session?.user) {
      sendResponse(res, {
        httpStatusCode: status.OK,
        success: true,
        message: "No session.",
        data: null,
      });
      return;
    }

    const user = session.user as any;
    const result = await AuthService.sessionCheck(user);
    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Session found.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const registerCustomer = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body;
    const result = await AuthService.registerCustomer(payload);
    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message: "Customer registered successfully.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const registerProvider = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body;
    const result = await AuthService.registerProvider(payload);
    sendResponse(res, {
      httpStatusCode: status.CREATED,
      success: true,
      message:
        "Provider account created. Please check your email to verify your account.",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const buildHeaders = (req: Request) => {
  const headers = new Headers();

  const copy = (key: string) => {
    const val = req.headers[key];
    if (!val) return;

    if (Array.isArray(val)) {
      headers.set(key, val.join(", "));
    } else {
      headers.set(key, String(val));
    }
  };

  copy("cookie");
  copy("user-agent");
  copy("origin");
  copy("host");
  copy("x-forwarded-for");
  copy("x-forwarded-host");
  copy("x-forwarded-proto");

  return headers;
};

const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const payload = req.body as ILoginData;

    const result = await AuthService.loginUser(payload, buildHeaders(req));

    const setCookies =
      typeof result.headers.getSetCookie === "function"
        ? result.headers.getSetCookie()
        : (() => {
          const single = result.headers.get("set-cookie");
          return single ? [single] : [];
        })();

    for (const cookie of setCookies) {
      res.append("Set-Cookie", cookie);
    }

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Login successful.",
      data: {
        data: result.data,
        hasProviderProfile: result.hasProviderProfile
      },
    });
  } catch (error) {
    next(error);
  }
};

const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, otp } = req.body;
    await AuthService.verifyEmail(email, otp);

    sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    next(error);
  }
};


const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await AuthService.logoutUser(buildHeaders(req));

    const setCookies =
      typeof result.headers.getSetCookie === "function"
        ? result.headers.getSetCookie()
        : (() => {
          const single = result.headers.get("set-cookie");
          return single ? [single] : [];
        })();

    for (const cookie of setCookies) {
      res.append("Set-Cookie", cookie);
    }

    return sendResponse(res, {
      httpStatusCode: status.OK,
      success: true,
      message: "Logged out successfully",
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

// /api/v1/auth/login/google?redirect=/profile
// const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const redirectPath = req.query.redirect || "/dashboard";

//     const encodedRedirectPath = encodeURIComponent(redirectPath as string);

//     const callbackURL = `${envConfig.BETTER_AUTH_URL}/api/v1/auth/google/success?redirect=${encodedRedirectPath}`;

//     res.render("googleRedirect", {
//       callbackURL: callbackURL,
//       betterAuthUrl: envConfig.BETTER_AUTH_URL,
//     })
//   } catch (error) {
//     next(error)
//   }
// }

// const googleLoginSuccess = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const redirectPath = req.query.redirect as string || "/dashboard";

//     const sessionToken = req.cookies["better-auth.session_token"];

//     if (!sessionToken) {
//       return res.redirect(`${envConfig.frontend_local_host}/login?error=oauth_failed`);
//     }

//     const session = await auth.api.getSession({
//       headers: {
//         "Cookie": `better-auth.session_token=${sessionToken}`
//       }
//     })

//     if (!session) {
//       return res.redirect(`${envConfig.frontend_local_host}/login?error=no_session_found`);
//     }


//     if (session && !session.user) {
//       return res.redirect(`${envConfig.frontend_local_host}/login?error=no_user_found`);
//     }

//     const result = await AuthService.googleLoginSuccess(session);

//     const { accessToken, refreshToken } = result;

//     tokenUtils.setAccessTokenCookie(res, accessToken);
//     tokenUtils.setRefreshTokenCookie(res, refreshToken);
//     // ?redirect=//profile -> /profile
//     const isValidRedirectPath = redirectPath.startsWith("/") && !redirectPath.startsWith("//");
//     const finalRedirectPath = isValidRedirectPath ? redirectPath : "/dashboard";

//     res.redirect(`${envConfig.frontend_local_host}${finalRedirectPath}`);
//   } catch (error) {
//     next(error)
//   }
// }

// const handleOAuthError = async (req: Request, res: Response, next: NextFunction) => {
//   try {
//     const error = req.query.error as string || "oauth_failed";
//     res.redirect(`${envConfig.frontend_local_host}/login?error=${error}`);
//   } catch (error) {
//     next(error)
//   }
// }

export const AuthController = {
  registerCustomer,
  registerProvider,
  loginUser,
  getMe,
  sessionCheck,
  verifyEmail,
  logout,
};