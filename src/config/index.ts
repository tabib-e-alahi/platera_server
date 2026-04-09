import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), ".env") });


const envConfig = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT) || 5000,
  // bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUND),
  database_url: process.env.DATABASE_URL,
  frontend_local_host: process.env.FRONTEND_LOCAL_HOST as string,
  BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET as string,
  BETTER_AUTH_URL: process.env.BETTER_AUTH_URL as string,
  SLACK_WEBHOOK_URL: process.env.SLACK_WEBHOOK_URL as string,
  CLAUDINARY_CLOUD_NAME: process.env.CLAUDINARY_CLOUD_NAME as string,
  CLAUDINARY_API_KEY: process.env.CLAUDINARY_API_KEY as string,
  CLAUDINARY_API_SECRET: process.env.CLAUDINARY_API_SECRET as string,
  // jwt_access_secret: process.env.JWT_ACCESS_SECRET,
  // jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN,
  // jwt_refresh_secret: process.env.JWT_REFRESH_SECRET,
  // jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN,
  // stripe_secret_key: process.env.STRIPE_SECRET_KEY,
};

export default envConfig