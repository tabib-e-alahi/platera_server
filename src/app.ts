import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

import { IndexRoutes } from './routes/index.js';
import { toNodeHandler } from 'better-auth/node';
import envConfig from './config/index.js';
import { auth } from './lib/auth.js';

const app: Application = express();
app.use(cookieParser());

app.use(cors({
  origin: [
    envConfig.frontend_local_host,
    envConfig.frontend_production_host,
    envConfig.BETTER_AUTH_URL,
    "http://localhost:3000"
  ].filter(Boolean),
  credentials: true,
}));

app.all("/api/auth/*splat", toNodeHandler(auth));


app.use(express.urlencoded({ extended: true }));

app.use(express.json());

app.use("/api/v1", IndexRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Platera server side');
});

app.use(notFoundHandler);

app.use(globalErrorHandler);

export default app;
