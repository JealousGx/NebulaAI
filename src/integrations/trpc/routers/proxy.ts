import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db"
import { endpoint as endpointSchema } from "@/db/schema"
import { activityLog } from "@/db/schema/activity-log"
import { calculateCost } from "@/lib/ai/cost-calculator"
import { getProviderConfig } from "@/lib/ai/providers"
import { decrypt } from "@/lib/encryption"

import { createTRPCRouter, protectedProcedure } from "../init"

export const proxyRouter = createTRPCRouter({
	forward: protectedProcedure
		.input(
			z.object({
				endpointId: z.string(),
				requestBody: z.any(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.session?.user?.id) {
				throw new TRPCError({ code: "UNAUTHORIZED" })
			}

			const { endpointId, requestBody } = input

			const endpoint = await db.query.endpoint.findFirst({
				where: eq(endpointSchema.id, endpointId),
				with: {
					modelApiKey: true,
				},
			})

			if (!endpoint || !endpoint.modelApiKey) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Endpoint not found.",
				})
			}

			const providerConfig = getProviderConfig(endpoint.provider)
			if (!providerConfig) {
				throw new TRPCError({
					code: "BAD_REQUEST",
					message: `Provider "${endpoint.provider}" is not supported.`,
				})
			}
			const apiKey = await decrypt({ data: endpoint.modelApiKey.encryptedKey })

			const startTime = Date.now()
			const response = await fetch(providerConfig.baseURL, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					...providerConfig.authHeader(apiKey),
				},
				body: JSON.stringify(requestBody),
			})
			const endTime = Date.now()

			const responseData = await response.json()

			let cost = 0
			if (responseData.usage) {
				cost = calculateCost(
					endpoint.provider,
					endpoint.model,
					responseData.usage.prompt_tokens,
					responseData.usage.completion_tokens,
				)
			}

			await db.insert(activityLog).values({
				endpointId: endpoint.id,
				status: response.status,
				latency: endTime - startTime,
				cost: cost.toFixed(8),
				request: JSON.stringify(requestBody),
				response: JSON.stringify(responseData),
				userId: ctx.userId,
				method: "POST",
			})

			return responseData
		}),
})
