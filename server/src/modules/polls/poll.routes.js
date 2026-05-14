import { Router } from "express";

import { requiredAuth } from "../../common/middleware/auth.middleware.js";
import { validate } from "../../common/middleware/validate.middleware.js";

import {
  createPoll,
  deletePoll,
  getPoll,
  getPublicPoll,
  listPolls,
  publishResults,
  updatePoll,
} from "./poll.controller.js";

import {
  createPollSchema,
  pollIdSchema,
  publicPollSchema,
  updatePollSchema,
} from "./validation/poll.validation.js";

const router = Router();

router.get("/public/:slug", validate(publicPollSchema), getPublicPoll);

router.use(requiredAuth);

router.post("/", validate(createPollSchema), createPoll);
router.get("/", listPolls);
router.get("/:id", validate(pollIdSchema), getPoll);
router.patch("/:id", validate(updatePollSchema), updatePoll);
router.delete("/:id", validate(pollIdSchema), deletePoll);
router.patch("/:id/publish-results", validate(pollIdSchema), publishResults);

export { router as pollRoutes };
