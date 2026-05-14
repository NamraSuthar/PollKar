import { AppError } from "../../common/errors/app-error.js";

import { analyticsRepository } from "./analytics.repository.js";
import { toAnalyticsDto } from "./dto/analytics.dto.js";

export class AnalyticsService {
  async getCreatorAnalytics(pollId, creatorId) {
    const poll = await analyticsRepository.findPollByIdForCreator(
      pollId,
      creatorId
    );

    if (!poll) {
      throw new AppError("Poll not found", 404);
    }

    const questions = await analyticsRepository.getQuestionsWithOptions(poll.id);
    const optionCounts = await analyticsRepository.getOptionCounts(poll.id);

    return toAnalyticsDto({
      poll,
      questions,
      totalResponses: poll.responseCount,
      optionCounts,
    });
  }

  async getPublicAnalytics(slug) {
    const poll = await analyticsRepository.findPublicPublishedPollBySlug(slug);

    if (!poll) {
      throw new AppError("Published results not found", 404);
    }

    const questions = await analyticsRepository.getQuestionsWithOptions(poll.id);
    const optionCounts = await analyticsRepository.getOptionCounts(poll.id);

    return toAnalyticsDto({
      poll,
      questions,
      totalResponses: poll.responseCount,
      optionCounts,
    });
  }
}

export const analyticsService = new AnalyticsService();
