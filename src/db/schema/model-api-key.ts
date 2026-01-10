import { relations } from "drizzle-orm"
import {
	mysqlTable,
	text,
	timestamp,
	uniqueIndex,
	varchar,
} from "drizzle-orm/mysql-core"

import { prefixedId } from "@/lib/id"

import { endpoint } from "./endpoints"

export const modelApiKey = mysqlTable(
	"model_api_key",
	{
		id: varchar("id", { length: 36 })
			.primaryKey()
			.$defaultFn(() => prefixedId("mdl_api")),
		endpointId: varchar("endpoint_id", { length: 36 })
			.notNull()
			.references(() => endpoint.id, { onDelete: "cascade" }),
		encryptedKey: text("encrypted_key").notNull(),
		createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { fsp: 3 })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => ({
		endpointIdIdx: uniqueIndex("model_api_key_endpointId_idx").on(
			table.endpointId,
		),
	}),
)

export const modelApiKeyRelations = relations(modelApiKey, ({ one }) => ({
	endpoint: one(endpoint, {
		fields: [modelApiKey.endpointId],
		references: [endpoint.id],
	}),
}))
