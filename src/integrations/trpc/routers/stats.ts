import { TRPCError } from "@trpc/server"
import { and, avg, count, eq, gte, sql, sum } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db"
import { activityLog, endpoint } from "@/db/schema"

import { createTRPCRouter, protectedProcedure } from "../init"

export const statsRouter = createTRPCRouter({
	getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
		if (!ctx.session?.user?.id) {
			throw new TRPCError({ code: "UNAUTHORIZED" })
		}

		const thirtyDaysAgo = new Date()
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
		const sixtyDaysAgo = new Date()
		sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

		const currentPeriodData = await db
			.select({
				totalRequests: count(activityLog.id),
				totalCost: sum(activityLog.cost),
				errorCount: count(
					sql`CASE WHEN ${activityLog.status} >= 400 THEN 1 END`,
				),
				avgLatency: avg(activityLog.latency),
			})
			.from(activityLog)
			.where(
				and(
					eq(activityLog.userId, ctx.session.user.id),
					gte(activityLog.createdAt, thirtyDaysAgo),
				),
			)

		const previousPeriodData = await db
			.select({
				totalRequests: count(activityLog.id),
				totalCost: sum(activityLog.cost),
			})
			.from(activityLog)
			.where(
				and(
					eq(activityLog.userId, ctx.session.user.id),
					gte(activityLog.createdAt, sixtyDaysAgo),
					sql`${activityLog.createdAt} < ${thirtyDaysAgo}`,
				),
			)

		const activeEndpoints = await db
			.select({ value: count() })
			.from(endpoint)
			.where(
				and(
					eq(endpoint.userId, ctx.session.user.id),
					eq(endpoint.status, "active"),
				),
			)

		const currentStats = currentPeriodData[0]
		const previousStats = previousPeriodData[0]

		const currentCost = parseFloat(currentStats.totalCost || "0")
		const previousCost = parseFloat(previousStats.totalCost || "0")

		const costChange =
			previousStats.totalRequests > 0
				? ((currentCost - previousCost) / previousCost) * 100
				: 0
		const requestsChange =
			previousStats.totalRequests > 0
				? ((currentStats.totalRequests - previousStats.totalRequests) /
						previousStats.totalRequests) *
					100
				: 0

		return {
			totalRequests: {
				value: currentStats.totalRequests,
				change: requestsChange.toFixed(1),
			},
			totalCost: {
				value: currentCost.toFixed(2),
				change: costChange.toFixed(1),
			},
			activeEndpoints: activeEndpoints[0].value,
			errorRate:
				currentStats.totalRequests > 0
					? (
							(currentStats.errorCount / currentStats.totalRequests) *
							100
						).toFixed(1)
					: "0.0",
			avgLatency: Math.round(parseFloat(currentStats.avgLatency || "0")),
		}
	}),

	getRequestCostTrend: protectedProcedure
		.input(z.object({ days: z.number().default(7) }))
		.query(async ({ ctx, input }) => {
			if (!ctx.session?.user?.id) {
				throw new TRPCError({ code: "UNAUTHORIZED" })
			}
			const trendData = await db
				.select({
					date: sql`DATE(${activityLog.createdAt})`,
					requests: count(activityLog.id),
					cost: sum(activityLog.cost),
				})
				.from(activityLog)
				.where(
					and(
						eq(activityLog.userId, ctx.session.user.id),
						sql`${activityLog.createdAt} >= DATE_SUB(NOW(), INTERVAL ${input.days} DAY)`,
					),
				)
				.groupBy(sql`DATE(${activityLog.createdAt})`)
				.orderBy(sql`DATE(${activityLog.createdAt})`)

			return trendData.map((d) => ({
				...d,
				cost: parseFloat(d.cost || "0"),
			}))
		}),

	getModelUsage: protectedProcedure.query(async ({ ctx }) => {
		if (!ctx.session?.user?.id) {
			throw new TRPCError({ code: "UNAUTHORIZED" })
		}
		const modelUsage = await db
			.select({
				model: endpoint.name,
				usage: count(activityLog.id),
			})
			.from(activityLog)
			.leftJoin(endpoint, eq(activityLog.endpointId, endpoint.id))
			.where(eq(activityLog.userId, ctx.session.user.id))
			.groupBy(endpoint.name)
			.orderBy(sql`usage DESC`)

		return modelUsage
	}),

	getLatencyTrend: protectedProcedure
		.input(z.object({ hours: z.number().default(24) }))
		.query(async ({ ctx, input }) => {
			if (!ctx.session?.user?.id) {
				throw new TRPCError({ code: "UNAUTHORIZED" })
			}
			const latencyTrend = await db
				.select({
					hour: sql`HOUR(${activityLog.createdAt})`,
					latency: avg(activityLog.latency),
				})
				.from(activityLog)
				.where(
					and(
						eq(activityLog.userId, ctx.session.user.id),
						sql`${activityLog.createdAt} >= DATE_SUB(NOW(), INTERVAL ${input.hours} HOUR)`,
					),
				)
				.groupBy(sql`HOUR(${activityLog.createdAt})`)
				.orderBy(sql`HOUR(${activityLog.createdAt})`)

			return latencyTrend.map((d) => ({
				time: `${String(d.hour).padStart(2, "0")}:00`,
				latency: Math.round(parseFloat(d.latency || "0")),
			}))
		}),
})
