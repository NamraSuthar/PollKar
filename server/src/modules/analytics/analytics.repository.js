import { and, asc, eq, isNull, sql } from "drizzle-orm";

import db from "../../db/index.js";
import {
    answers,
    options,
    polls,
    questions,
} from "../../db/schema/index.js";

export class AnalyticsRepository {
    async findPollByIdForCreator(pollId, creatorId) {
        const [poll] = await db
            .select()
            .from(polls)
            .where(
                and(
                    eq(polls.id, pollId),
                    eq(polls.creatorId, creatorId),
                    isNull(polls.deletedAt)
                )
            );

        return poll || null;
    }

    async findPublicPublishedPollBySlug(slug) {
        const [poll] = await db
            .select()
            .from(polls)
            .where(
                and(
                    eq(polls.slug, slug),
                    eq(polls.isPublished, true),
                    isNull(polls.deletedAt)
                )
            );

        return poll || null;
    }

    async getQuestionsWithOptions(pollId) {
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

    async getOptionCounts(pollId) {
        const rows = await db
            .select({
                optionId: answers.optionId,
                count: sql`count(${answers.id})`.mapWith(Number),
            })
            .from(answers)
            .innerJoin(questions, eq(answers.questionId, questions.id))
            .where(eq(questions.pollId, pollId))
            .groupBy(answers.optionId);

        return new Map(rows.map((row) => [row.optionId, row.count]));
    }
}

export const analyticsRepository = new AnalyticsRepository();
