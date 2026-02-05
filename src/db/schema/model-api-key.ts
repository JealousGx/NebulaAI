import { relations } from "drizzle-orm"
import {
	mysqlTable,
	text,
	timestamp,
	uniqueIndex,
	varchar,
} from "drizzle-orm/mysql-core"

import { prefixedId } from "@/lib/id"

import { model } from "./model"

export const modelApiKey = mysqlTable(
	"model_api_key",
	{
		id: varchar("id", { length: 36 })
			.primaryKey()
			.$defaultFn(() => prefixedId("mdl_api")),
		modelId: varchar("model_id", { length: 36 })
			.notNull()
			.references(() => model.id, { onDelete: "cascade" }),
		encryptedKey: text("encrypted_key").notNull(),
		createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { fsp: 3 })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => ({
		modelIdIdx: uniqueIndex("model_api_key_modelId_idx").on(table.modelId),
	}),
)

export const modelApiKeyRelations = relations(modelApiKey, ({ one }) => ({
	model: one(model, {
		fields: [modelApiKey.modelId],
		references: [model.id],
	}),
}))
