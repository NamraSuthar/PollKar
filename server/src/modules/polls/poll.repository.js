import { and, asc, eq, isNull } from "drizzle-orm";

import  db  from "../../db/index.js";
import { options, polls, questions } from "../../db/schema/index.js";

export class PollRepository {
  async findBySlug(slug) {
    const [poll] = await db
      .select()
      .from(polls)
      .where(and(eq(polls.slug, slug), isNull(polls.deletedAt)));

    return poll || null;
  }

  async findByIdForCreator(id, creatorId) {
    const [poll] = await db
      .select()
      .from(polls)
      .where(
        and(eq(polls.id, id), eq(polls.creatorId, creatorId), isNull(polls.deletedAt))
      );

    return poll || null;
  }

  async findManyByCreator(creatorId) {
    return db
      .select()
      .from(polls)
      .where(and(eq(polls.creatorId, creatorId), isNull(polls.deletedAt)))
      .orderBy(asc(polls.createdAt));
  }

  async createWithQuestions(payload) {
    return db.transaction(async (tx) => {
      const [poll] = await tx.insert(polls).values(payload.poll).returning();

      for (const [questionIndex, question] of payload.questions.entries()) {
        const [createdQuestion] = await tx
          .insert(questions)
          .values({
            pollId: poll.id,
            title: question.title,
            isRequired: question.isRequired,
            position: questionIndex,
          })
          .returning();

        await tx.insert(options).values(
          question.options.map((option, optionIndex) => ({
            questionId: createdQuestion.id,
            label: option.label,
            position: optionIndex,
          }))
        );
      }

      return poll;
    });
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

  async updatePoll(id, creatorId, data) {
    const [poll] = await db
      .update(polls)
      .set({ ...data, updatedAt: new Date() })
      .where(
        and(eq(polls.id, id), eq(polls.creatorId, creatorId), isNull(polls.deletedAt))
      )
      .returning();

    return poll || null;
  }

  async softDelete(id, creatorId) {
    const [poll] = await db
      .update(polls)
      .set({ deletedAt: new Date(), updatedAt: new Date() })
      .where(
        and(eq(polls.id, id), eq(polls.creatorId, creatorId), isNull(polls.deletedAt))
      )
      .returning();

    return poll || null;
  }

  async publishResults(id, creatorId) {
    const [poll] = await db
      .update(polls)
      .set({
        isPublished: true,
        publishedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(
        and(eq(polls.id, id), eq(polls.creatorId, creatorId), isNull(polls.deletedAt))
      )
      .returning();

    return poll || null;
  }
}

export const pollRepository = new PollRepository();
