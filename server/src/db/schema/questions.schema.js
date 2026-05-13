import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  boolean,
  integer,
  index,
} from "drizzle-orm/pg-core";

import { polls } from "./polls.schema.js";

export const questions = pgTable(
  "questions",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    pollId: uuid("poll_id")
      .notNull()
      .references(() => polls.id, { onDelete: "cascade" }),

    title: varchar("title", { length: 240 }).notNull(),

    isRequired: boolean("is_required").notNull().default(true),
    position: integer("position").notNull(),

    deletedAt: timestamp("deleted_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    pollIdx: index("questions_poll_id_idx").on(table.pollId),
  })
);
