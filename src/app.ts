import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';
import { IndexRoutes } from './routes/index.js';

const app: Application = express();

// Enable URL-encoded form data parsing
app.use(express.urlencoded({ extended: true }));
// parsers
app.use(express.json());
// app.use(cors({
//   origin: "*", // Allow all origins for testing; in production, specify your frontend URL
//   credentials: true, // Allow cookies to be sent in cross-origin requests
// }));
// app.use(cookieParser());

// application routes
app.use("/api/v1", IndexRoutes);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Apollo Gears World!');
});

// 404 Not Found Handler - Must come before error handler
app.use(notFoundHandler);

// Global Error Handler - Must be the last middleware
app.use(globalErrorHandler);

export default app;
