import { relations } from "drizzle-orm"
import {
	index,
	mysqlEnum,
	mysqlTable,
	serial,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core"
import { user } from "./auth"

export const endpoint = mysqlTable(
	"endpoint",
	{
		id: serial("id").primaryKey(),
		name: varchar("name", { length: 255 }).notNull(),
		provider: varchar("provider", { length: 255 }).notNull(),
		status: mysqlEnum("status", ["active", "error", "inactive"])
			.default("active")
			.notNull(),
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
}))
