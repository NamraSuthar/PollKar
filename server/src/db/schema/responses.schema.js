import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  index,
} from "drizzle-orm/pg-core";

import { polls } from "./polls.schema.js";
import { users } from "./users.schema.js";

export const responses = pgTable(
  "responses",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    pollId: uuid("poll_id")
      .notNull()
      .references(() => polls.id, { onDelete: "cascade" }),

    respondentUserId: uuid("respondent_user_id").references(() => users.id, {
      onDelete: "set null",
    }),

    sessionToken: varchar("session_token", { length: 255 }),

    submittedAt: timestamp("submitted_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    pollIdx: index("responses_poll_id_idx").on(table.pollId),
    respondentIdx: index("responses_respondent_user_id_idx").on(
      table.respondentUserId
    ),
    sessionTokenIdx: index("responses_session_token_idx").on(table.sessionToken),
  })
);
