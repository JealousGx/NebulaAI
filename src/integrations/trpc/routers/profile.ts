import { TRPCError } from "@trpc/server"
import { eq } from "drizzle-orm"
import { z } from "zod"

import { db } from "@/db"
import { user } from "@/db/schema"

import { createTRPCRouter, protectedProcedure } from "../init"

export const profileRouter = createTRPCRouter({
	update: protectedProcedure
		.input(
			z.object({
				name: z.string().optional(),
				bio: z.string().optional(),
				location: z.string().optional(),
				website: z.string().optional(),
			}),
		)
		.mutation(async ({ input, ctx }) => {
			if (!ctx.session?.user?.id) {
				throw new TRPCError({ code: "UNAUTHORIZED" })
			}
			await db.update(user).set(input).where(eq(user.id, ctx.session.user.id))
		}),
})
