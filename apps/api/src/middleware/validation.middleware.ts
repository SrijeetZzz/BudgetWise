import { NextFunction, Request, Response } from "express";
import { ZodTypeAny } from "zod";

import { AppError } from "../common/exceptions/AppError";

export const validate =
  (schema: ZodTypeAny) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new AppError(
          400,
          result.error.issues.map((issue) => issue.message).join(", "),
        ),
      );
    }

    req.body = result.data;

    next();
  };
