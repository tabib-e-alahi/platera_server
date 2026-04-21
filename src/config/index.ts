import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), ".env") });


const envConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  // bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUND),
  database_url: process.env.DATABASE_URL,
  BACKEND_LOCAL_HOST: process.env.BACKEND_LOCAL_HOST as string,
  frontend_local_host: process.env.FRONTEND_LOCAL_HOST as string,
  frontend_production_host: process.env.FRONTEND_PRODUCTION_HOST as string,

  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,

  SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL as string,

  CLAUDINARY_CLOUD_NAME: process.env.CLAUDINARY_CLOUD_NAME as string,
  CLAUDINARY_API_KEY: process.env.CLAUDINARY_API_KEY as string,
  CLAUDINARY_API_SECRET: process.env.CLAUDINARY_API_SECRET as string,

  SMTP_HOST: process.env.SMTP_HOST as string,
  SMTP_PORT: Number(process.env.SMTP_PORT) || 2525,
  SMTP_USER: process.env.SMTP_USER as string,
  SMTP_PASS: process.env.SMTP_PASS as string,
  SMTP_FROM: process.env.SMTP_FROM as string,

  SUPER_ADMIN_NAME: process.env.SUPER_ADMIN_NAME as string,
  SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
  SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,

  ADMIN_NAME: process.env.ADMIN_NAME as string,
  ADMIN_EMAIL: process.env.ADMIN_EMAIL as string,
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD as string,
  SSLCOMMERZ_API: process.env.SSLCOMMERZ_API as string,
  SSLCOMMERZ_VALIDATION_API: process.env.SSLCOMMERZ_VALIDATION_API as string,
  SSLCOMMERZ_STORE_ID: process.env.SSLCOMMERZ_STORE_ID as string,
  SSLCOMMERZ_STORE_PASSWORD: process.env.SSLCOMMERZ_STORE_PASSWORD as string,
  SSLCOMMERZ_IS_LIVE: process.env.SSLCOMMERZ_IS_LIVE === "true",
  SSLCOMMERZ_IPN_URL: process.env.SSLCOMMERZ_IPN_URL as string,
  SSLCOMMERZ_SUCCESS_URL: process.env.SSLCOMMERZ_SUCCESS_URL as string,
  SSLCOMMERZ_FAIL_URL: process.env.SSLCOMMERZ_FAIL_URL as string,
  SSLCOMMERZ_CANCEL_URL: process.env.SSLCOMMERZ_CANCEL_URL as string,

  // RESEND_API_KEY: process.env.RESEND_API_KEY as string,
  // EMAIL_FROM: process.env.EMAIL_FROM as string,
  // jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  // jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  // jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  // jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  // stripe_secret_key: process.env.STRIPE_SECRET_KEY,
};

export default envConfig