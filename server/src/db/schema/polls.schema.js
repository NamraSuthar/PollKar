import {
  pgTable,
  uuid,
  varchar,
  text,
  timestamp,
  boolean,
  integer,
  pgEnum,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

import { users } from "./users.schema.js";

export const responseModeEnum = pgEnum("response_mode", [
  "anonymous",
  "authenticated",
]);

export const polls = pgTable(
  "polls",
  {
    id: uuid("id").defaultRandom().primaryKey(),

    creatorId: uuid("creator_id")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),

    slug: varchar("slug", { length: 160 }).notNull(),

    title: varchar("title", { length: 180 }).notNull(),
    description: text("description"),

    responseMode: responseModeEnum("response_mode").notNull().default("anonymous"),

    expiresAt: timestamp("expires_at", { withTimezone: true }),
    isPublished: boolean("is_published").notNull().default(false),
    publishedAt: timestamp("published_at", { withTimezone: true }),

    responseCount: integer("response_count").notNull().default(0),

    deletedAt: timestamp("deleted_at", { withTimezone: true }),

    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),

    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    slugUniqueIdx: uniqueIndex("polls_slug_unique_idx").on(table.slug),
    creatorIdx: index("polls_creator_id_idx").on(table.creatorId),
    expiresAtIdx: index("polls_expires_at_idx").on(table.expiresAt),
    deletedAtIdx: index("polls_deleted_at_idx").on(table.deletedAt),
  })
);
