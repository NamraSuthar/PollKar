import { Router } from 'express';

import { requiredAuth } from '../../common/middleware/auth.middleware.js';
import { validate } from '../../common/middleware/validate.middleware.js';

import { register, login, me } from './auth.controller.js';
import { registerSchema, loginSchema } from './validation/auth.validation.js';

const router = Router();

router.post('/register', validate(registerSchema), register)
router.post('/login', validate(loginSchema), login)
router.get('/me', requiredAuth, me)


export { router as authRouter }