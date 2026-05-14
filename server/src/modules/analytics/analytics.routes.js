import { Router } from "express";
import { z } from "zod";

import { requiredAuth } from "../../common/middleware/auth.middleware.js";
import { validate } from "../../common/middleware/validate.middleware.js";

import {
  getCreatorAnalytics,
  getPublicAnalytics,
} from "./analytics.controller.js";

const creatorAnalyticsSchema = z.object({
  params: z.object({
    pollId: z.string().uuid(),
  }),
});

const publicAnalyticsSchema = z.object({
  params: z.object({
    slug: z.string().trim().min(1).max(160),
  }),
});

const router = Router();

router.get("/public/:slug", validate(publicAnalyticsSchema), getPublicAnalytics);

router.get(
  "/polls/:pollId",
  requiredAuth,
  validate(creatorAnalyticsSchema),
  getCreatorAnalytics
);

export { router as analyticsRoutes };
