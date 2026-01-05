import {
	bigint,
	mysqlTable,
	serial,
	text,
	timestamp,
	uniqueIndex,
} from "drizzle-orm/mysql-core"

import { endpoint } from "./endpoints"

export const modelApiKey = mysqlTable(
	"model_api_key",
	{
		id: serial("id").primaryKey(),
		endpointId: bigint("endpoint_id", { mode: "number", unsigned: true })
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
