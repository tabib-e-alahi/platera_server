import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError.js';

export const notFoundHandler = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const error = new AppError(`Route ${req.originalUrl} not found!`, 404);
  next(error);
};

export default notFoundHandler;
