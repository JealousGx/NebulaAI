import { TRPCError } from "@trpc/server"
import { desc, eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db"
import { model, modelApiKey } from "@/db/schema"

import { encrypt } from "@/lib/encryption"
import { createTRPCRouter, protectedProcedure } from "../init"

export const modelsRouter = createTRPCRouter({
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

			try {
				return await db
					.select()
					.from(model)
					.where(eq(model.userId, ctx.session.user.id))
					.orderBy(desc(model.createdAt))
					.limit(input.limit ?? 20)
					.offset(input.offset ?? 0)
			} catch (error) {
				console.error("Error fetching models:", error)

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to fetch models.",
				})
			}
		}),
	create: protectedProcedure
		.input(
			z.object({
				name: z.string().min(1),
				provider: z.string().min(1),
				model: z.string().min(1),
				apiKey: z.string().min(1),
				meta: z.record(z.string(), z.unknown()),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.session?.user?.id) {
				throw new TRPCError({ code: "UNAUTHORIZED" })
			}

			try {
				// 1. Create the model entry
				const newModelData = {
					name: input.name,
					provider: input.provider,
					model: input.model,
					meta: input.meta,
					userId: ctx.session.user.id,
				}
				const [createdModelResult] = await db
					.insert(model)
					.values(newModelData)
					.$returningId()

				const newModelId = createdModelResult.id

				// 2. Encrypt the API key
				const encryptedKey = await encrypt({ data: input.apiKey })

				// 3. Store the encrypted API key in the modelApiKey table
				await db.insert(modelApiKey).values({
					modelId: newModelId,
					encryptedKey: encryptedKey,
				})

				return { ...newModelData, id: newModelId }
			} catch (err) {
				console.error("Error creating model:", err)

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to create model.",
				})
			}
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
				meta: z.record(z.string(), z.unknown()).optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.session?.user?.id) {
				throw new TRPCError({ code: "UNAUTHORIZED" })
			}
			const { id, apiKey, ...data } = input

			try {
				// Update the model table
				await db.update(model).set(data).where(eq(model.id, id))

				if (apiKey) {
					const encryptedKey = await encrypt({ data: apiKey })
					const existingApiKey = await db
						.select()
						.from(modelApiKey)
						.where(eq(modelApiKey.modelId, id))

					if (existingApiKey.length > 0) {
						await db
							.update(modelApiKey)
							.set({ encryptedKey: encryptedKey })
							.where(eq(modelApiKey.modelId, id))
					} else {
						await db.insert(modelApiKey).values({
							modelId: id,
							encryptedKey: encryptedKey,
						})
					}
				}
			} catch (err) {
				console.error("Error updating model:", err)

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update model.",
				})
			}
		}),
	delete: protectedProcedure
		.input(z.object({ id: z.string() }))
		.mutation(async ({ input, ctx }) => {
			if (!ctx.session?.user?.id) {
				throw new TRPCError({ code: "UNAUTHORIZED" })
			}
			try {
				await db.delete(model).where(eq(model.id, input.id))
			} catch (err) {
				console.error("Error deleting model:", err)

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to delete model.",
				})
			}
		}),
})
