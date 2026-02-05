import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db"
import { user } from "@/db/schema"

import { createTRPCRouter, protectedProcedure } from "../init"

export const profileRouter = createTRPCRouter({
	get: protectedProcedure.query(async ({ ctx }) => {
		if (!ctx.session?.user?.id) {
			throw new TRPCError({ code: "UNAUTHORIZED" })
		}

		try {
			const profile = await db
				.select()
				.from(user)
				.where(eq(user.id, ctx.session.user.id))
				.limit(1)
				.then((res) => res[0])

			if (!profile) {
				throw new TRPCError({
					code: "NOT_FOUND",
					message: "Profile not found.",
				})
			}

			return profile
		} catch (err) {
			console.error("Error fetching profile:", err)

			throw new TRPCError({
				code: "INTERNAL_SERVER_ERROR",
				message: "Failed to fetch profile.",
			})
		}
	}),
	update: protectedProcedure
		.input(
			z.object({
				name: z.string().optional(),
				email: z.email().optional(),
				bio: z.string().optional(),
				location: z.string().optional(),
				website: z.string().optional(),
				image: z.url().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.session?.user?.id) {
				throw new TRPCError({ code: "UNAUTHORIZED" })
			}

			try {
				await db.update(user).set(input).where(eq(user.id, ctx.session.user.id))
			} catch (error) {
				console.error("Error updating profile:", error)

				throw new TRPCError({
					code: "INTERNAL_SERVER_ERROR",
					message: "Failed to update profile.",
				})
			}
		}),
})
