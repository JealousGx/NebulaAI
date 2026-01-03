import { createServerFn } from "@tanstack/react-start"
import {
	getRequestHeaders,
	setResponseHeader,
} from "@tanstack/react-start/server"

import { auth } from "."

export const getUser = createServerFn({ method: "GET" }).handler(async () => {
	const headers = getRequestHeaders()

	const session = await auth.api.getSession({
		headers,
		returnHeaders: true,
	})

	// Forward any Set-Cookie headers to the client, e.g. for session/cache refresh
	const cookies = session.headers?.getSetCookie()
	if (cookies?.length) {
		setResponseHeader("Set-Cookie", cookies)
	}

	return session.response
		? { user: session.response.user, session: session.response.session }
		: null
})
