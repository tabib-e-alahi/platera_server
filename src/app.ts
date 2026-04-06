import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './middlewares/globalErrorHandler.js';
import notFoundHandler from './middlewares/notFoundHandler.js';

const app: Application = express();

// parsers
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// application routes
// app.use('/api/v1', router);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Apollo Gears World!');
});

// 404 Not Found Handler - Must come before error handler
app.use(notFoundHandler);

// Global Error Handler - Must be the last middleware
app.use(globalErrorHandler);

export default app;
