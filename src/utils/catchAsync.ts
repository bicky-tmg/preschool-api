import type { NextFunction, Request, Response, RequestHandler } from 'express';

export const catchAsync =
    (fn: (_req: Request, _res: Response, _next: NextFunction) => Promise<void>): RequestHandler =>
    (req, res, next) => {
        fn(req, res, next).catch(next);
    };
