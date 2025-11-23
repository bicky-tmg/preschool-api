import type { Request, Response, NextFunction } from 'express';

const responseHandler = (req: Request, res: Response, next: NextFunction) => {
    res.sendResponse = <T>(
        data: T,
        message: string = 'Success',
        statusCode: number = 200,
    ): void => {
        res.status(statusCode).json({
            success: true,
            message,
            data,
        });
    };

    next();
};

export default responseHandler;
