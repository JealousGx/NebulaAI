import { type InferSelectModel, relations } from "drizzle-orm"
import {
	index,
	json,
	mysqlEnum,
	mysqlTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core"

import { prefixedId } from "@/lib/id"

import { user } from "./auth"
import { modelApiKey } from "./model-api-key"

export const model = mysqlTable(
	"model",
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
		meta: json("meta").$type<Record<string, unknown> | null>().default(null),
		transformation: text("transformation"),
		userId: varchar("user_id", { length: 36 })
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { fsp: 3 })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("model_userId_idx").on(table.userId)],
)

export const modelRelations = relations(model, ({ one }) => ({
	user: one(user, {
		fields: [model.userId],
		references: [user.id],
	}),
	modelApiKey: one(modelApiKey, {
		fields: [model.id],
		references: [modelApiKey.modelId],
	}),
}))

export type Model = InferSelectModel<typeof model>
