import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

export function signAccessToken(payload) {
    return jwt.sign(payload, env.jwtAccessSecret, { expiresIn: env.jwtAccessExpiresIn });
}

export function verifyAccessToken(token) {
    return jwt.verify(token, env.jwtAccessSecret);
}