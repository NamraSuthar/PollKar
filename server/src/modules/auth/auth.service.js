import { AppError } from "../../common/errors/app-error.js";
import { comparePassword, hashPassword } from "../../common/utility/password.js";
import { signAccessToken } from "../../common/utility/jwt.js";

import { authRepository } from "./auth.repository.js";
import { toAuthResponseDto, toAuthUserDto } from "./dto/auth.dto.js";

class AuthService {
    async register(payload) {
        const existingUser = await authRepository.findUserByEmail(payload.email);

        if (existingUser) {
            throw new AppError('User with this email already exists', 409);
        }

        const passwordHash = await hashPassword(payload.password);
        const newUser = await authRepository.createUser({ ...payload, passwordHash });
        const accessToken = signAccessToken({ id: newUser.id, email: newUser.email });

        return toAuthResponseDto(newUser, accessToken);


    }


    async login(payload) {
        const user = await authRepository.findUserByEmail(payload.email);

        if (!user) {
            throw new AppError('Invalid email or password', 401);
        }

        if (!user.isActive) {
            throw new AppError('User account is inactive', 403);
        }

        const isPasswordValid = await comparePassword(payload.password, user.passwordHash);

        if (!isPasswordValid) {
            throw new AppError('Invalid email or password', 401);
        }

        const accessToken = signAccessToken({ id: user.id, email: user.email });

        return toAuthResponseDto(user, accessToken);
    }

    async getCurrentUser(userId) {
        const user = await authRepository.findUserById(userId);

        if (!user) {
            throw new AppError('User not found', 404);
        }

        return toAuthUserDto(user);
    }
}

export const authService = new AuthService();