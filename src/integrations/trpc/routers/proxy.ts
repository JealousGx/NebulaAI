import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db"
import { model as modelSchema } from "@/db/schema"
import { activityLog } from "@/db/schema/activity-log"

import { calculateCost } from "@/lib/ai/cost-calculator"
import { getProviderConfig } from "@/lib/ai/providers"
import { decrypt } from "@/lib/encryption"

import { createTRPCRouter, protectedProcedure } from "../init"

export const proxyRouter = createTRPCRouter({
	forward: protectedProcedure
		.input(
			z.object({
				modelId: z.string(),
				requestBody: z.any(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.session?.user?.id) {
				throw new TRPCError({ code: "UNAUTHORIZED" })
			}

			const { modelId, requestBody } = input

			const model = await db.query.model
				.findFirst({
					where: eq(modelSchema.id, modelId),
					with: {
						modelApiKey: true,
					},
				})
				.catch((err) => {
					console.error("Error fetching model for proxy:", err)
					throw new TRPCError({
						code: "INTERNAL_SERVER_ERROR",
						message: "Failed to fetch model.",
					})
				})

			if (!model || !model.modelApiKey) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Model not found.",
				})
			}

			const providerConfig = getProviderConfig(model.provider)
			if (!providerConfig) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: `Provider "${model.provider}" is not supported.`,
				})
			}
			const apiKey = await decrypt({ data: model.modelApiKey.encryptedKey })

			const startTime = Date.now()

			try {
				let transformedBody = requestBody

				if (model.transformation) {
					try {
						const transformationRules = JSON.parse(model.transformation)
						transformedBody = applyTransformation(
							transformationRules,
							requestBody,
						)
					} catch (e) {
						console.error("Failed to parse transformation JSON:", e)
						// Continue with original requestBody if transformation is invalid
					}
				}

				const response = await fetch(providerConfig.baseURL, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						...providerConfig.authHeader(apiKey),
					},
					body: JSON.stringify(transformedBody),
				})
				const endTime = Date.now()
				const latency = endTime - startTime

				const responseBody = await response.json()

				const cost = calculateCost({
					price: (model.meta?.price || "0") as string,
					// prompt_tokens: responseBody[model.meta?.prompt_tokens as string] || 0,
					// completion_tokens:
					// 	responseBody[model.meta?.completion_tokens as string] || 0,
					// total_tokens: responseBody[model.meta?.total_tokens as string] || 0,
					prompt_tokens: responseBody[providerConfig.inputTokensField] || 0,
					completion_tokens:
						responseBody[providerConfig.outputTokensField] || 0,
					total_tokens: providerConfig.totalTokensField
						? responseBody[providerConfig.totalTokensField] || 0
						: 0,
				})

				// Log the activity
				await db.insert(activityLog).values({
					userId: model.userId,
					modelId: model.id,
					method: "POST",
					status: response.status,
					cost: cost.toFixed(6),
					latency,
				})

				return responseBody
			} catch (error) {
				const endTime = Date.now()
				const latency = endTime - startTime

				// Log the activity
				await db.insert(activityLog).values({
					cost: (0.0).toFixed(6),
					userId: model.userId,
					modelId: model.id,
					method: "POST",
					status: 500,
					latency,
				})

				console.error("Proxy error:", error)
				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "An error occurred while proxying the request.",
					cause: error,
				})
			}
		}),
})

function applyTransformation(
	transformationRules: Record<string, unknown>,
	requestBody: Record<string, unknown>,
): Record<string, unknown> {
	const newBody = { ...transformationRules }

	// Simple placeholder replacement for now.
	// This can be extended to more complex JSON transformations.
	for (const key in newBody) {
		if (typeof newBody[key] === "string") {
			newBody[key] = newBody[key].replace(/\{\{(\w+)\}\} /g, (_, rbKey) => {
				return requestBody[rbKey] !== undefined
					? (<string>requestBody[rbKey]).toString()
					: ""
			})
		}
		// If the value is an array of objects (like messages), iterate and replace
		if (
			Array.isArray(newBody[key]) &&
			newBody[key].every((item) => typeof item === "object" && item !== null)
		) {
			newBody[key] = newBody[key].map((item: Record<string, unknown>) => {
				const newItem = { ...item }
				for (const itemKey in newItem) {
					if (typeof newItem[itemKey] === "string") {
						newItem[itemKey] = newItem[itemKey].replace(
							/\{\{(\w+)\}\} /g,
							(_, rbKey) => {
								return requestBody[rbKey] !== undefined
									? (<string>requestBody[rbKey]).toString()
									: ""
							},
						)
					}
				}
				return newItem
			})
		}
	}

	return newBody
}
