import { redirect } from "@tanstack/react-router"
import { createMiddleware } from "@tanstack/react-start"

import { getUser } from "@/lib/auth/functions"

export const authMiddleware = createMiddleware().server(
	async ({ request, next }) => {
		const path = (() => {
			const pathname = new URL(request.url).pathname
			const parts = pathname.split("/").filter(Boolean)
			return parts.length ? parts[parts.length - 1] : ""
		})()

		console.log("Auth Middleware: Checking session...")
		const user = await getUser()

		if (!user) {
			throw redirect({
				to: "/",
				search: {
					auth: true,
					r: path,
				},
			})
		}

		return await next({ context: { user } })
	},
)
