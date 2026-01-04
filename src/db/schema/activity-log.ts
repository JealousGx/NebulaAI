import { relations } from "drizzle-orm"
import {
	decimal,
	index,
	int,
	mysqlTable,
	serial,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core"
import { user } from "./auth"

export const activityLog = mysqlTable(
	"activity_log",
	{
		id: serial("id").primaryKey(),
		timestamp: timestamp("timestamp", { fsp: 3 }).defaultNow().notNull(),
		method: varchar("method", { length: 10 }).notNull(),
		endpoint: varchar("endpoint", { length: 255 }).notNull(),
		status: int("status").notNull(),
		latency: int("latency").notNull(),
		cost: decimal("cost", { precision: 10, scale: 4 }).notNull(),
		ip: varchar("ip", { length: 45 }),
		request: text("request"),
		response: text("response"),
		userId: varchar("user_id", { length: 36 })
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { fsp: 3 })
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => [index("activity_log_userId_idx").on(table.userId)],
)

export const activityLogRelations = relations(activityLog, ({ one }) => ({
	user: one(user, {
		fields: [activityLog.userId],
		references: [user.id],
	}),
}))
