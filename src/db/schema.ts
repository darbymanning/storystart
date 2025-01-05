import { integer, pgTable, text } from "drizzle-orm/pg-core"

export const spaces = pgTable("spaces", {
  id: integer().primaryKey(),
  content: text().notNull(),
})
