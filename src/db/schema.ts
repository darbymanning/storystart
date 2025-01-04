import { integer, jsonb, pgTable } from "drizzle-orm/pg-core"
import type { Components } from "../api"

export const spaces = pgTable("spaces", {
  id: integer().primaryKey(),
  content: jsonb().notNull().$type<Components>(),
})
