import { type InferSelectModel, relations } from "drizzle-orm"
import { index, mysqlTable, timestamp, varchar } from "drizzle-orm/mysql-core"

import { prefixedId } from "@/lib/id"

import { user } from "./auth"

export const apiKey = mysqlTable(
	"api_key",
	{
		id: varchar("id", { length: 36 })
			.primaryKey()
			.$defaultFn(() => prefixedId("key")),
		name: varchar("name", { length: 255 }).notNull(),
		key: varchar("key", { length: 255 }).notNull().unique(),
		createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
		userId: varchar("user_id", { length: 36 })
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [index("api_key_userId_idx").on(table.userId)],
)

export const apiKeyRelations = relations(apiKey, ({ one }) => ({
	user: one(user, {
		fields: [apiKey.userId],
		references: [user.id],
	}),
}))

export type ApiKey = InferSelectModel<typeof apiKey>
