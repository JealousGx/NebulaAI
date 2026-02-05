import { TRPCError } from "@trpc/server"
import { and, avg, count, eq, gte, lt, sum } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db"
import { activityLog, model } from "@/db/schema"

import { createTRPCRouter, protectedProcedure } from "../init"

export const statsRouter = createTRPCRouter({
	getDashboardStats: protectedProcedure.query(async ({ ctx }) => {
		if (!ctx.session?.user?.id) {
			throw new TRPCError({ code: "UNAUTHORIZED" })
		}

		try {
			const thirtyDaysAgo = new Date()
			thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
			const sixtyDaysAgo = new Date()
			sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60)

			const currentPeriodData = await db
				.select({
					totalRequests: count(activityLog.id),
					totalCost: sum(activityLog.cost),
					avgLatency: avg(activityLog.latency),
				})
				.from(activityLog)
				.where(
					and(
						eq(activityLog.userId, ctx.session.user.id),
						gte(activityLog.createdAt, thirtyDaysAgo),
					),
				)

			const errorCountData = await db
				.select({ errorCount: count(activityLog.id) })
				.from(activityLog)
				.where(
					and(
						eq(activityLog.userId, ctx.session.user.id),
						gte(activityLog.createdAt, thirtyDaysAgo),
						gte(activityLog.status, 400),
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
						lt(activityLog.createdAt, thirtyDaysAgo),
					),
				)

			const activeModels = await db
				.select({ value: count() })
				.from(model)
				.where(
					and(
						eq(model.userId, ctx.session.user.id),
						eq(model.status, "active"),
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
				activeModels: activeModels[0].value,
				errorRate:
					currentStats.totalRequests > 0
						? (
								((errorCountData[0].errorCount || 0) /
									currentStats.totalRequests) *
								100
							).toFixed(1)
						: "0.0",
				avgLatency: Math.round(parseFloat(currentStats.avgLatency || "0")),
			}
		} catch (err) {
			console.error("Error fetching dashboard stats:", err)

			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch dashboard stats.",
			})
		}
	}),

	getRequestCostTrend: protectedProcedure
		.input(z.object({ days: z.number().default(7) }))
		.query(async ({ ctx, input }) => {
			if (!ctx.session?.user?.id) {
				throw new TRPCError({ code: "UNAUTHORIZED" })
			}
			try {
				const cutoff = new Date()
				cutoff.setDate(cutoff.getDate() - input.days)

				const rows = await db
					.select({
						createdAt: activityLog.createdAt,
						cost: activityLog.cost,
					})
					.from(activityLog)
					.where(
						and(
							eq(activityLog.userId, ctx.session.user.id),
							gte(activityLog.createdAt, cutoff),
						),
					)

				// Aggregate by date in JS to avoid DB-specific DATE() functions
				const map = new Map<
					string,
					{ date: string; requests: number; cost: number }
				>()
				rows.forEach((r) => {
					const dateKey = r.createdAt.toISOString().slice(0, 10) // YYYY-MM-DD
					const entry = map.get(dateKey) || {
						date: dateKey,
						requests: 0,
						cost: 0,
					}
					entry.requests += 1
					entry.cost += parseFloat((r.cost as unknown as string) || "0")
					map.set(dateKey, entry)
				})

				// Ensure continuous days (including zeros)
				const result: { date: string; requests: number; cost: number }[] = []
				for (let i = 0; i < input.days; i++) {
					const d = new Date()
					d.setDate(d.getDate() - (input.days - 1 - i))
					const key = d.toISOString().slice(0, 10)
					result.push(map.get(key) || { date: key, requests: 0, cost: 0 })
				}

				return result
			} catch (err) {
				console.error("Error fetching request cost trend:", err)

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch request cost trend.",
				})
			}
		}),

	getModelUsage: protectedProcedure.query(async ({ ctx }) => {
		if (!ctx.session?.user?.id) {
			throw new TRPCError({ code: "UNAUTHORIZED" })
		}

		try {
			const modelUsage = await db
				.select({
					model: model.name,
					usage: count(activityLog.id),
				})
				.from(activityLog)
				.leftJoin(model, eq(activityLog.modelId, model.id))
				.where(eq(activityLog.userId, ctx.session.user.id))
				.groupBy(model.name)

			const sorted = modelUsage
				.map((m) => ({
					...m,
					usage: Number((m.usage as unknown as number) || 0),
				}))
				.sort((a, b) => b.usage - a.usage)

			return sorted
		} catch (Err) {
			console.error("Error fetching model usage:", Err)

			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch model usage.",
			})
		}
	}),

	getLatencyTrend: protectedProcedure
		.input(z.object({ hours: z.number().default(24) }))
		.query(async ({ ctx, input }) => {
			if (!ctx.session?.user?.id) {
				throw new TRPCError({ code: "UNAUTHORIZED" })
			}

			try {
				const cutoff = new Date()
				cutoff.setHours(cutoff.getHours() - input.hours)

				const rows = await db
					.select({
						createdAt: activityLog.createdAt,
						latency: activityLog.latency,
					})
					.from(activityLog)
					.where(
						and(
							eq(activityLog.userId, ctx.session.user.id),
							gte(activityLog.createdAt, cutoff),
						),
					)

				// Aggregate per hour in JS
				const map = new Map<string, { sum: number; count: number }>()
				rows.forEach((r) => {
					const d = r.createdAt
					const key = `${String(d.getHours()).padStart(2, "0")}:00`
					const existing = map.get(key) || { sum: 0, count: 0 }
					existing.sum += Number(r.latency) || 0
					existing.count += 1
					map.set(key, existing)
				})

				const result: { time: string; latency: number }[] = []
				for (let i = input.hours - 1; i >= 0; i--) {
					const d = new Date()
					d.setHours(d.getHours() - i)
					const key = `${String(d.getHours()).padStart(2, "0")}:00`
					const val = map.get(key)
					result.push({
						time: key,
						latency: val ? Math.round(val.sum / val.count) : 0,
					})
				}

				return result
			} catch (err) {
				console.error("Error fetching latency trend:", err)

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch latency trend.",
				})
			}
		}),
})
