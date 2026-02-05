import { TRPCError } from "@trpc/server"
import { and, eq, gte, like, lte } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db"
import { activityLog } from "@/db/schema"

import { createTRPCRouter, protectedProcedure } from "../init"

export const activityLogRouter = createTRPCRouter({
	list: protectedProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).default(10),
				offset: z.number().min(0).default(0),
				statusFilter: z
					.enum(["all", "2xx", "4xx", "5xx"])
					.default("all")
					.optional(),
				searchQuery: z.string().optional(),
			}),
		)
		.query(async ({ input, ctx }) => {
			if (!ctx.session?.user?.id) {
				throw new TRPCError({ code: "UNAUTHORIZED" })
			}

			const { limit, offset, statusFilter, searchQuery } = input

			const whereConditions = [eq(activityLog.userId, ctx.session.user.id)]

			if (statusFilter === "2xx") {
				whereConditions.push(
					gte(activityLog.status, 200),
					lte(activityLog.status, 299),
				)
			} else if (statusFilter === "4xx") {
				whereConditions.push(
					gte(activityLog.status, 400),
					lte(activityLog.status, 499),
				)
			} else if (statusFilter === "5xx") {
				whereConditions.push(
					gte(activityLog.status, 500),
					lte(activityLog.status, 599),
				)
			}

			if (searchQuery) {
				whereConditions.push(
					like(activityLog.request, `%${searchQuery}%`),
					like(activityLog.response, `%${searchQuery}%`),
					like(activityLog.modelId, `%${searchQuery}%`),
					like(activityLog.method, `%${searchQuery}%`),
					like(activityLog.ip, `%${searchQuery}%`),
				)
			}

			try {
				return await db
					.select()
					.from(activityLog)
					.where(and(...whereConditions))
					.orderBy(activityLog.createdAt)
					.limit(limit)
					.offset(offset)
			} catch (err) {
				console.error("Error fetching activity logs:", err)
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch activity logs.",
				})
			}
		}),
	add: protectedProcedure
		.input(
			z.object({
				method: z.string().min(1),
				modelId: z.string().optional(),
				status: z.number(),
				latency: z.number(),
				cost: z.number(),
				ip: z.string().optional(),
				request: z.string().optional(),
				response: z.string().optional(),
				traceId: z.string().optional(),
				groupId: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.session?.user?.id) {
				throw new TRPCError({ code: "UNAUTHORIZED" })
			}
			const newLog = {
				...input,
				cost: String(input.cost),
				userId: ctx.session.user.id,
			}

			try {
				const [result] = await db.insert(activityLog).values(newLog)
				return result
			} catch (err) {
				console.error("Error adding activity log:", err)
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to add activity log.",
				})
			}
		}),
})
