import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { tanstackStartCookies } from "better-auth/tanstack-start"

import { db } from "@/db" // your drizzle instance

export const auth = betterAuth({
	database: drizzleAdapter(db, {
		provider: "mysql", // or "pg", "sqlite"
	}),

	plugins: [tanstackStartCookies()], // make sure this is the last plugin in the array
})
