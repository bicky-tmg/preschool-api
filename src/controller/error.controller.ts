import type { Response, Request, NextFunction } from 'express';
import type AppError from '../utils/appError.js';
import env from '../config/env.config.js';

const sentErrorDev = (err: AppError, res: Response) => {
    res.status(err.statusCode).json({
        success: false,
        message: err.message,
        ...(typeof err.data === 'object' && err.data !== null ? { data: err.data } : {}),
        error: err,
        stack: err.stack,
    });
};

const sentErrorProd = (err: AppError, res: Response) => {
    // Operational, trusted error: send message to client
    if (err.isOperational) {
        res.status(err.statusCode).json({
            success: err.success,
            message: err.message,
            ...(typeof err.data === 'object' && err.data !== null ? { data: err.data } : {}),
        });

        // Programming or other unknown error: don't leak error details
    } else {
        // 1) Log error
        console.error('ERROR 💥', err);

        // 2) Send generic message
        res.status(500).json({
            success: err.success,
            message: 'Something went wrong',
            ...(typeof err.data === 'object' && err.data !== null ? { data: err.data } : {}),
        });
    }
};

const globalErrorHandler = (err: AppError, req: Request, res: Response, next: NextFunction) => {
    err.statusCode = err.statusCode || 500;

    if (env.NODE_ENV === 'production') {
        const error = Object.create(err);
        sentErrorProd(error, res);
    } else {
        sentErrorDev(err, res);
    }
};

export default globalErrorHandler;
