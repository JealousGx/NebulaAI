import { type InferSelectModel, relations } from "drizzle-orm"
import {
	boolean,
	mysqlTable,
	text,
	uniqueIndex,
	varchar,
} from "drizzle-orm/mysql-core"

import { prefixedId } from "@/lib/id"

import { user } from "./auth"

export const workspace = mysqlTable(
	"workspace",
	{
		id: varchar("id", { length: 32 })
			.primaryKey()
			.$defaultFn(() => prefixedId("ws")),
		name: varchar("name", { length: 255 }).notNull(),
		webhookUrl: text("webhook_url"),
		autoDeleteLogs: boolean("auto_delete_logs").default(true).notNull(),
		enableCaching: boolean("enable_caching").default(false).notNull(),
		userId: varchar("user_id", { length: 36 })
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => ({
		userIdx: uniqueIndex("workspace_userId_idx").on(table.userId),
	}),
)

export const workspaceRelations = relations(workspace, ({ one }) => ({
	user: one(user, {
		fields: [workspace.userId],
		references: [user.id],
	}),
}))

export type Workspace = InferSelectModel<typeof workspace>
