import "dotenv/config";
import { defineConfig } from "prisma/config";
import envConfig from './src/config/index';


export default defineConfig({
  schema: "prisma/schema",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: envConfig.database_url,
  },
});
