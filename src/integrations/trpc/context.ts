import type { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch"
import { eq } from "drizzle-orm"

import { db } from "@/db"
import { apiKey } from "@/db/schema"

import { auth } from "@/lib/auth"

export async function createContext({ req }: FetchCreateContextFnOptions) {
	const session = await auth.api.getSession({
		headers: req.headers,
	})

	let userId: string | null = session?.user.id || null

	if (!userId) {
		const headerApiKey = req.headers.get("x-api-key")
		if (headerApiKey) {
			const foundKey = await db
				.select()
				.from(apiKey)
				.where(eq(apiKey.key, headerApiKey))
				.limit(1)

			if (foundKey.length > 0) {
				userId = foundKey[0].userId
			}
		}
	}

	return {
		session,
		db,
		userId,
	}
}

export type Context = Awaited<ReturnType<typeof createContext>>
