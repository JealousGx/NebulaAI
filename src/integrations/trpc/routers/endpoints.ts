import { TRPCError } from "@trpc/server"
import { desc, eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db"
import { endpoint, modelApiKey } from "@/db/schema"

import { encrypt } from "@/lib/encryption"
import { createTRPCRouter, protectedProcedure } from "../init"

export const endpointsRouter = createTRPCRouter({
	list: protectedProcedure
		.input(
			z.object({
				limit: z.number().min(1).max(100).optional(),
				offset: z.number().min(0).optional(),
			}),
		)
		.query(async ({ ctx, input }) => {
			if (!ctx.session?.user?.id) {
				throw new TRPCError({ code: "UNAUTHORIZED" })
			}
			return await db
				.select()
				.from(endpoint)
				.where(eq(endpoint.userId, ctx.session.user.id))
				.orderBy(desc(endpoint.createdAt))
				.limit(input.limit ?? 20)
				.offset(input.offset ?? 0)
		}),
	create: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1),
				provider: z.string().min(1),
				model: z.string().min(1),
				apiKey: z.string().min(1),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.session?.user?.id) {
				throw new TRPCError({ code: "UNAUTHORIZED" })
			}

			// 1. Create the endpoint entry
			const newEndpointData = {
				name: input.name,
				provider: input.provider,
				model: input.model,
				userId: ctx.session.user.id,
			}
			const [createdEndpointResult] = await db
				.insert(endpoint)
				.values(newEndpointData)
				.$returningId()

			const newEndpointId = createdEndpointResult.id

			// 2. Encrypt the API key
			const encryptedKey = await encrypt({ data: input.apiKey })

			// 3. Store the encrypted API key in the modelApiKey table
			await db.insert(modelApiKey).values({
				endpointId: newEndpointId,
				encryptedKey: encryptedKey,
			})

			return { ...newEndpointData, id: newEndpointId }
		}),
	update: protectedProcedure
		.input(
			z.object({
				id: z.string(),
				name: z.string().min(1).optional(),
				provider: z.string().min(1).optional(),
				model: z.string().min(1).optional(),
				status: z.enum(["active", "error", "inactive"]).optional(),
				apiKey: z.string().min(1).optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.session?.user?.id) {
				throw new TRPCError({ code: "UNAUTHORIZED" })
			}
			const { id, apiKey, ...data } = input

			// Update the endpoint table
			await db.update(endpoint).set(data).where(eq(endpoint.id, id))

			if (apiKey) {
				const encryptedKey = await encrypt({ data: apiKey })
				const existingApiKey = await db
					.select()
					.from(modelApiKey)
					.where(eq(modelApiKey.endpointId, id))

				if (existingApiKey.length > 0) {
					await db
						.update(modelApiKey)
						.set({ encryptedKey: encryptedKey })
						.where(eq(modelApiKey.endpointId, id))
				} else {
					await db.insert(modelApiKey).values({
						endpointId: id,
						encryptedKey: encryptedKey,
					})
				}
			}
		}),
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			if (!ctx.session?.user?.id) {
				throw new TRPCError({ code: "UNAUTHORIZED" })
			}
			await db.delete(endpoint).where(eq(endpoint.id, input.id))
		}),
})
