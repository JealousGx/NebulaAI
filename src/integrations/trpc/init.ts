import { initTRPC, TRPCError } from "@trpc/server"
import superjson from "superjson"

import type { Context } from "./context"

const t = initTRPC.context<Context>().create({
	transformer: superjson,
})

const isAuthed = t.middleware(({ next, ctx }) => {
	if (!ctx.userId) {
		throw new TRPCError({ code: "UNAUTHORIZED" })
	}
	return next({
		ctx: {
			userId: ctx.userId,
		},
	})
})

export const createTRPCRouter = t.router
export const publicProcedure = t.procedure
export const protectedProcedure = t.procedure.use(isAuthed)
