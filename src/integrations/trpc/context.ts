import type { inferAsyncReturnType } from "@trpc/server"
import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"

import { auth } from "@/lib/auth"

export async function createContext({
	req,
}: FetchCreateContextFnOptions) {
	const session = await auth.api.getSession({
		headers: req.headers,
	})

	return {
		session,
		db: (await import("@/db")).db,
	}
}

export type Context = inferAsyncReturnType<typeof createContext>
