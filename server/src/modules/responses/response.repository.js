import { and, asc, eq, inArray, isNull, sql } from "drizzle-orm";

import db from "../../db/index.js";
import {
    answers,
    options,
    polls,
    questions,
    responses,
} from "../../db/schema/index.js";

export class ResponseRepository {
    async findPollBySlug(slug) {
        const [poll] = await db
            .select()
            .from(polls)
            .where(and(eq(polls.slug, slug), isNull(polls.deletedAt)));

        return poll || null;
    }

    async getActiveQuestionsWithOptions(pollId) {
        const questionRows = await db
            .select()
            .from(questions)
            .where(and(eq(questions.pollId, pollId), isNull(questions.deletedAt)))
            .orderBy(asc(questions.position));

        const optionRows = await db
            .select()
            .from(options)
            .where(isNull(options.deletedAt))
            .orderBy(asc(options.position));

        return questionRows.map((question) => ({
            ...question,
            options: optionRows.filter((option) => option.questionId === question.id),
        }));
    }

    async findExistingResponse({ pollId, respondentUserId, sessionToken }) {
        if (respondentUserId) {
            const [existing] = await db
                .select()
                .from(responses)
                .where(
                    and(
                        eq(responses.pollId, pollId),
                        eq(responses.respondentUserId, respondentUserId)
                    )
                );

            return existing || null;
        }

        if (sessionToken) {
            const [existing] = await db
                .select()
                .from(responses)
                .where(
                    and(eq(responses.pollId, pollId), eq(responses.sessionToken, sessionToken))
                );

            return existing || null;
        }

        return null;
    }

    async createResponseWithAnswers({ poll, respondentUserId, sessionToken, answerRows }) {
        return db.transaction(async (tx) => {
            const [response] = await tx
                .insert(responses)
                .values({
                    pollId: poll.id,
                    respondentUserId: respondentUserId || null,
                    sessionToken: sessionToken || null,
                })
                .returning();

            await tx.insert(answers).values(
                answerRows.map((answer) => ({
                    responseId: response.id,
                    questionId: answer.questionId,
                    optionId: answer.optionId,
                }))
            );

            const [updatedPoll] = await tx
                .update(polls)
                .set({
                    responseCount: sql`${polls.responseCount} + 1`,
                    updatedAt: new Date(),
                })
                .where(eq(polls.id, poll.id))
                .returning();

            return {
                response,
                poll: updatedPoll,
            };
        });
    }
}

export const responseRepository = new ResponseRepository();
