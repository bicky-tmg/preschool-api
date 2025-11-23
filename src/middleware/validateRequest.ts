import type { Request, Response, NextFunction } from 'express';
import { ZodError, type ZodObject, type ZodRawShape } from 'zod';
import AppError from '../utils/appError.js';

export const validateRequest =
    (schema: ZodObject<ZodRawShape>, source: 'body' | 'query' | 'params' = 'body') =>
    (req: Request, res: Response, next: NextFunction) => {
        try {
            const parsed = schema.parse(req[source]);
            Object.assign(req[source], parsed);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const data = error.issues.map((issue) => ({
                    field: issue.path.join('.'),
                    message: issue.message,
                }));
                return next(new AppError(`Invalid data: ${source}`, 400, data));
            }
            next(error);
        }
    };
