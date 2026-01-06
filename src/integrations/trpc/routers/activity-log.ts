import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db"
import { activityLog } from "@/db/schema"

import { createTRPCRouter, protectedProcedure } from "../init"

export const activityLogRouter = createTRPCRouter({
	list: protectedProcedure.query(async ({ ctx }) => {
		if (!ctx.session?.user?.id) {
			throw new TRPCError({ code: "UNAUTHORIZED" })
		}
		return await db
			.select()
			.from(activityLog)
			.where(eq(activityLog.userId, ctx.session.user.id))
			.orderBy(activityLog.createdAt)
	}),
	add: protectedProcedure
		.input(
			z.object({
				method: z.string().min(1),
				endpointId: z.string().optional(),
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
			const [result] = await db.insert(activityLog).values(newLog)
			return result
		}),
})
