import { type InferSelectModel, relations } from "drizzle-orm"
import {
	index,
	mysqlEnum,
	mysqlTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core"

import { prefixedId } from "@/lib/id"

import { user } from "./auth"
import { modelApiKey } from "./model-api-key"

export const endpoint = mysqlTable(
	"endpoint",
	{
		id: varchar("id", { length: 36 })
			.primaryKey()
			.$defaultFn(() => prefixedId("ep")),
		name: varchar("name", { length: 255 }).notNull(),
		provider: varchar("provider", { length: 255 }).notNull(),
		model: varchar("model", { length: 255 }).notNull(),
		status: mysqlEnum("status", ["active", "error", "inactive"])
			.default("active")
			.notNull(),
		description: text("description"),
		userId: varchar("user_id", { length: 36 })
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { fsp: 3 })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("endpoint_userId_idx").on(table.userId)],
)

export const endpointRelations = relations(endpoint, ({ one }) => ({
	user: one(user, {
		fields: [endpoint.userId],
		references: [user.id],
	}),
	modelApiKey: one(modelApiKey, {
		fields: [endpoint.id],
		references: [modelApiKey.endpointId],
	}),
}))

export type Endpoint = InferSelectModel<typeof endpoint>
