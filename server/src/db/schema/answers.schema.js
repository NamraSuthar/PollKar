import { pgTable, uuid, index } from "drizzle-orm/pg-core";

import { responses } from "./responses.schema.js";
import { questions } from "./questions.schema.js";
import { options } from "./options.schema.js";

export const answers = pgTable(
  "answers",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    responseId: uuid("response_id")
      .notNull()
      .references(() => responses.id, { onDelete: "cascade" }),

    questionId: uuid("question_id")
      .notNull()
      .references(() => questions.id, { onDelete: "restrict" }),

    optionId: uuid("option_id")
      .notNull()
      .references(() => options.id, { onDelete: "restrict" }),
  },
  (table) => ({
    responseIdx: index("answers_response_id_idx").on(table.responseId),
    questionIdx: index("answers_question_id_idx").on(table.questionId),
    optionIdx: index("answers_option_id_idx").on(table.optionId),
  })
);
