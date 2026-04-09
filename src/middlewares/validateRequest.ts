// src/middlewares/validateRequest.ts

import { Request, Response, NextFunction } from "express";
import { z } from "zod";

const validateRequest = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      next(result.error);
      return;
    }

    req.body = result.data;
    next();
  };
};

export { validateRequest };
export default validateRequest;