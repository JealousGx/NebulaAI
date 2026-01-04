import { relations } from "drizzle-orm"
import {
	boolean,
	mysqlTable,
	serial,
	uniqueIndex,
	varchar,
} from "drizzle-orm/mysql-core"
import { user } from "./auth"

export const notificationSettings = mysqlTable(
	"notification_settings",
	{
		id: serial("id").primaryKey(),
		emailNotifications: boolean("email_notifications").default(true).notNull(),
		costLimitAlerts: boolean("cost_limit_alerts").default(true).notNull(),
		errorRateAlerts: boolean("error_rate_alerts").default(true).notNull(),
		weeklyReports: boolean("weekly_reports").default(false).notNull(),
		userId: varchar("user_id", { length: 36 })
			.notNull()
			.references(() => user.id, { onDelete: "cascade" }),
	},
	(table) => ({
		userIdx: uniqueIndex("notification_settings_userId_idx").on(table.userId),
	}),
)

export const notificationSettingsRelations = relations(
	notificationSettings,
	({ one }) => ({
		user: one(user, {
			fields: [notificationSettings.userId],
			references: [user.id],
		}),
	}),
)
