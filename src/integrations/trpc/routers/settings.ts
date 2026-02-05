import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import { nanoid } from "nanoid"
import { z } from "zod"

import { db } from "@/db"
import { apiKey, notificationSettings, workspace } from "@/db/schema"

import { createTRPCRouter, protectedProcedure } from "../init"

export const settingsRouter = createTRPCRouter({
	updateWorkspace: protectedProcedure
		.input(
			z.object({
				name: z.string().optional(),
				webhookUrl: z.string().optional(),
				autoDeleteLogs: z.boolean().optional(),
				enableCaching: z.boolean().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.session?.user?.id) {
				throw new TRPCError({ code: "UNAUTHORIZED" })
			}
			try {
				return await db
					.update(workspace)
					.set(input)
					.where(eq(workspace.userId, ctx.session.user.id))
			} catch (err) {
				console.error("Error updating workspace settings:", err)

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update workspace settings.",
				})
			}
		}),
	updateNotificationSettings: protectedProcedure
		.input(
			z.object({
				emailNotifications: z.boolean().optional(),
				costLimitAlerts: z.boolean().optional(),
				errorRateAlerts: z.boolean().optional(),
				weeklyReports: z.boolean().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.session?.user?.id) {
				throw new TRPCError({ code: "UNAUTHORIZED" })
			}
			try {
				return await db
					.update(notificationSettings)
					.set(input)
					.where(eq(notificationSettings.userId, ctx.session.user.id))
			} catch (err) {
				console.error("Error updating notification settings:", err)

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update notification settings.",
				})
			}
		}),
	listApiKeys: protectedProcedure.query(async ({ ctx }) => {
		if (!ctx.session?.user?.id) {
			throw new TRPCError({ code: "UNAUTHORIZED" })
		}
		try {
			return await db
				.select()
				.from(apiKey)
				.where(eq(apiKey.userId, ctx.session.user.id))
		} catch (err) {
			console.error("Error fetching API keys:", err)

			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch API keys.",
			})
		}
	}),
	createApiKey: protectedProcedure
		.input(z.object({ name: z.string() }))
		.mutation(async ({ input, ctx }) => {
			if (!ctx.session?.user?.id) {
				throw new TRPCError({ code: "UNAUTHORIZED" })
			}
			try {
				const newKey = `nbla_${nanoid(24)}`
				const [result] = await db.insert(apiKey).values({
					name: input.name,
					key: newKey,
					userId: ctx.session.user.id,
				})
				return result
			} catch (err) {
				console.error("Error creating API key:", err)

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create API key.",
				})
			}
		}),
	revokeApiKey: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			if (!ctx.session?.user?.id) {
				throw new TRPCError({ code: "UNAUTHORIZED" })
			}
			try {
				return await db.delete(apiKey).where(eq(apiKey.id, input.id))
			} catch (err) {
				console.error("Error revoking API key:", err)

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to revoke API key.",
				})
			}
		}),
})
