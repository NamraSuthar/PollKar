import { AppError } from "../../common/errors/app-error.js";
import { appendSlugSuffix, createSlug } from "../../common/utility/slug.js";

import { toPollDetailDto, toPollSummaryDto } from "./dto/poll.dto.js";
import { pollRepository } from "./poll.repository.js";

export class PollService {
  async createPoll(creatorId, payload) {
    let slug = createSlug(payload.title);

    if (!slug) {
      slug = "poll";
    }

    const existingPoll = await pollRepository.findBySlug(slug);
    if (existingPoll) {
      slug = appendSlugSuffix(slug);
    }

    const poll = await pollRepository.createWithQuestions({
      poll: {
        creatorId,
        slug,
        title: payload.title,
        description: payload.description || null,
        responseMode: payload.responseMode,
        expiresAt: payload.expiresAt ? new Date(payload.expiresAt) : null,
      },
      questions: payload.questions,
    });

    const questions = await pollRepository.getQuestionsWithOptions(poll.id);
    return toPollDetailDto(poll, questions);
  }

  async listCreatorPolls(creatorId) {
    const creatorPolls = await pollRepository.findManyByCreator(creatorId);
    return creatorPolls.map(toPollSummaryDto);
  }

  async getCreatorPoll(id, creatorId) {
    const poll = await pollRepository.findByIdForCreator(id, creatorId);

    if (!poll) {
      throw new AppError("Poll not found", 404);
    }

    const questions = await pollRepository.getQuestionsWithOptions(poll.id);
    return toPollDetailDto(poll, questions);
  }

  async getPublicPoll(slug) {
    const poll = await pollRepository.findBySlug(slug);

    if (!poll) {
      throw new AppError("Poll not found", 404);
    }

    const isExpired = poll.expiresAt && new Date(poll.expiresAt) <= new Date();

    const questions = await pollRepository.getQuestionsWithOptions(poll.id);

    return {
      ...toPollDetailDto(poll, questions),
      isExpired,
      canRespond: !isExpired && !poll.isPublished,
      canViewResults: poll.isPublished,
    };
  }

  async updatePoll(id, creatorId, payload) {
    const data = {
      ...payload,
      expiresAt:
        payload.expiresAt === undefined
          ? undefined
          : payload.expiresAt
            ? new Date(payload.expiresAt)
            : null,
    };

    const poll = await pollRepository.updatePoll(id, creatorId, data);

    if (!poll) {
      throw new AppError("Poll not found", 404);
    }

    return toPollSummaryDto(poll);
  }

  async deletePoll(id, creatorId) {
    const poll = await pollRepository.softDelete(id, creatorId);

    if (!poll) {
      throw new AppError("Poll not found", 404);
    }

    return toPollSummaryDto(poll);
  }

  async publishResults(id, creatorId) {
    const poll = await pollRepository.publishResults(id, creatorId);

    if (!poll) {
      throw new AppError("Poll not found", 404);
    }

    return toPollSummaryDto(poll);
  }
}

export const pollService = new PollService();
