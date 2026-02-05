import { type InferSelectModel, relations } from "drizzle-orm"
import {
	boolean,
	index,
	mysqlTable,
	text,
	timestamp,
	varchar,
} from "drizzle-orm/mysql-core"

import { activityLog } from "./activity-log"
import { apiKey } from "./api-key"
import { model } from "./model"
import { notificationSettings } from "./notification-settings"
import { workspace } from "./workspace"

export const user = mysqlTable("user", {
	id: varchar("id", { length: 36 }).primaryKey(),
	name: varchar("name", { length: 255 }).notNull(),
	email: varchar("email", { length: 255 }).notNull().unique(),
	emailVerified: boolean("email_verified").default(false).notNull(),
	image: text("image"),
	bio: text("bio"),
	location: varchar("location", { length: 255 }),
	website: varchar("website", { length: 255 }),
	createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { fsp: 3 })
		.defaultNow()
		.$onUpdate(() => /* @__PURE__ */ new Date())
		.notNull(),
})

export const session = mysqlTable(
	"session",
	{
		id: varchar("id", { length: 36 }).primaryKey(),
		expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
		token: varchar("token", { length: 255 }).notNull().unique(),
		createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { fsp: 3 })
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: varchar("user_id", { length: 36 })
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => [index("session_userId_idx").on(table.userId)],
)

export const account = mysqlTable(
	"account",
	{
		id: varchar("id", { length: 36 }).primaryKey(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: varchar("user_id", { length: 36 })
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at", { fsp: 3 }),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { fsp: 3 }),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { fsp: 3 })
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("account_userId_idx").on(table.userId)],
)

export const verification = mysqlTable(
	"verification",
	{
		id: varchar("id", { length: 36 }).primaryKey(),
		identifier: varchar("identifier", { length: 255 }).notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at", { fsp: 3 }).notNull(),
		createdAt: timestamp("created_at", { fsp: 3 }).defaultNow().notNull(),
		updatedAt: timestamp("updated_at", { fsp: 3 })
			.defaultNow()
			.$onUpdate(() => /* @__PURE__ */ new Date())
			.notNull(),
	},
	(table) => [index("verification_identifier_idx").on(table.identifier)],
)

export const userRelations = relations(user, ({ one, many }) => ({
	sessions: many(session),
	accounts: many(account),
	models: many(model),
	activityLogs: many(activityLog),
	workspace: one(workspace, {
		fields: [user.id],
		references: [workspace.userId],
	}),
	notificationSettings: one(notificationSettings, {
		fields: [user.id],
		references: [notificationSettings.userId],
	}),
	apiKeys: many(apiKey),
}))

export const sessionRelations = relations(session, ({ one }) => ({
	user: one(user, {
		fields: [session.userId],
		references: [user.id],
	}),
}))

export const accountRelations = relations(account, ({ one }) => ({
	user: one(user, {
		fields: [account.userId],
		references: [user.id],
	}),
}))

export type User = InferSelectModel<typeof user>
