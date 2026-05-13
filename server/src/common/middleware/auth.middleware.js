import { AppError } from "../errors/app-error.js";
import { verifyAccessToken } from "../utility/jwt.js";


export function requiredAuth(req, res, next) {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError('Authorization header missing or malformed', 401));
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
    return next(new AppError('Token missing', 401));
    }

    try {
        const payload = verifyAccessToken(token);
        req.user = payload;
        return next();
    } catch {
        return next(new AppError('Invalid token', 401));
    }
}