export default class AppError<T extends object | null = null> extends Error {
    statusCode: number;
    readonly success: boolean;
    isOperational: boolean;
    readonly data: T | undefined | null;

    constructor(message: string, statusCode: number, data?: T) {
        super(message);

        this.statusCode = statusCode;
        this.success = false;
        this.isOperational = true;
        this.data = data;

        Object.setPrototypeOf(this, AppError.prototype);
        Error.captureStackTrace(this, this.constructor);
    }
}
