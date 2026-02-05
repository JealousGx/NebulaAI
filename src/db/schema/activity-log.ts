import { type InferSelectModel, relations } from "drizzle-orm"
import {
	decimal,
	index,
	int,
	mysqlTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core"

import { prefixedId } from "@/lib/id"

import { user } from "./auth"
import { model } from "./model"

export const activityLog = mysqlTable(
	"activity_log",
	{
		id: varchar("id", { length: 36 })
			.primaryKey()
			.$defaultFn(() => prefixedId("act")),
		timestamp: timestamp("timestamp", { fsp: 3 }).defaultNow().notNull(),
		method: varchar("method", { length: 10 }).notNull(),
		modelId: varchar("model_id", { length: 36 }).references(() => model.id),
		status: int("status").notNull(),
		latency: int("latency").notNull(),
		cost: decimal("cost", { precision: 10, scale: 4 }).notNull(),
		ip: varchar("ip", { length: 45 }),
		request: text("request"),
		response: text("response"),
		traceId: varchar("trace_id", { length: 255 }),
		groupId: varchar("group_id", { length: 255 }),
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
	model: one(model, {
		fields: [activityLog.modelId],
		references: [model.id],
	}),
}))

export type ActivityLog = InferSelectModel<typeof activityLog>
