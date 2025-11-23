import type { AuthUser } from '../../types/user.type.ts';

declare global {
    namespace Express {
        interface Request {
            user: AuthUser;
        }
        interface Response {
            sendResponse: <T>(data: T, message?: string, statusCode?: number) => void;
        }
    }
}
