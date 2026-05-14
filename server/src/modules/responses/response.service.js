import { AppError } from "../../common/errors/app-error.js";

import { toResponseSubmissionDto } from "./dto/response.dto.js";
import { responseRepository } from "./response.repository.js";

export class ResponseService {
    async submitResponse(slug, payload, user) {
        const poll = await responseRepository.findPollBySlug(slug);

        if (!poll) {
            throw new AppError("Poll not found", 404);
        }

        if (poll.isPublished) {
            throw new AppError("Poll results are already published", 409);
        }



        if (poll.responseMode === "authenticated" && !user) {
            throw new AppError("Authentication is required to respond to this poll", 401);
        }

        const respondentUserId = user?.id || null;
        const sessionToken =
            poll.responseMode === "anonymous" ? payload.sessionToken || null : null;

        const existingResponse = await responseRepository.findExistingResponse({
            pollId: poll.id,
            respondentUserId,
            sessionToken,
        });

        if (existingResponse) {
            throw new AppError("You have already submitted a response", 409);
        }

        const questions = await responseRepository.getActiveQuestionsWithOptions(poll.id);

        const questionMap = new Map(questions.map((question) => [question.id, question]));
        const answerMap = new Map(
            payload.answers.map((answer) => [answer.questionId, answer.optionId])
        );

        for (const question of questions) {
            if (question.isRequired && !answerMap.has(question.id)) {
                throw new AppError(`Required question is missing: ${question.title}`, 400);
            }
        }

        const normalizedAnswers = [];

        for (const [questionId, optionId] of answerMap.entries()) {
            const question = questionMap.get(questionId);

            if (!question) {
                throw new AppError("Answer contains a question that does not belong to this poll", 400);
            }

            const optionBelongsToQuestion = question.options.some(
                (option) => option.id === optionId
            );

            if (!optionBelongsToQuestion) {
                throw new AppError("Answer contains an invalid option for a question", 400);
            }

            normalizedAnswers.push({
                questionId,
                optionId,
            });
        }

        const result = await responseRepository.createResponseWithAnswers({
            poll,
            respondentUserId,
            sessionToken,
            answerRows: normalizedAnswers,
        });

        return toResponseSubmissionDto(result.response, result.poll);
    }
}

export const responseService = new ResponseService();
