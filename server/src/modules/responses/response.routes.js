import { Router } from "express";

import { optionalAuth } from "../../common/middleware/optional-auth.middleware.js";
import { validate } from "../../common/middleware/validate.middleware.js";

import { submitResponse } from "./response.controller.js";
import { submitResponseSchema } from "./validation/response.validation.js";

const router = Router();

router.post(
    "/polls/:slug",
    optionalAuth,
    validate(submitResponseSchema),
    submitResponse
);

export { router as responseRoutes };
