import { MutationCache, QueryClient } from "@tanstack/react-query"
import { createIsomorphicFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { createTRPCClient, httpBatchStreamLink } from "@trpc/client"
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"
import superjson from "superjson"

import { env } from "@/env"

import { TRPCProvider } from "@/integrations/trpc/react"
import type { TRPCRouter } from "@/integrations/trpc/router"

function getUrl() {
	const base = (() => {
		if (typeof window !== "undefined") return ""
		return env.APP_URL
	})()
	return `${base}/api/trpc`
}

const headers = createIsomorphicFn()
	.client(() => ({}))
	.server(() => getRequestHeaders())

export const trpcClient = createTRPCClient<TRPCRouter>({
	links: [
		httpBatchStreamLink({
			transformer: superjson,
			url: getUrl(),
			headers,
		}),
	],
})

export function getContext() {
	const queryClient = new QueryClient({
		defaultOptions: {
			dehydrate: { serializeData: superjson.serialize },
			hydrate: { deserializeData: superjson.deserialize },
		},
		mutationCache: new MutationCache({
			onSettled: async (_data, _error, _vars, _context, mutation) => {
				const meta = mutation.meta as {
					invalidateQueryKey?: unknown[]
				}

				if (meta.invalidateQueryKey) {
					await queryClient.invalidateQueries({
						queryKey: meta.invalidateQueryKey,
					})
				}
			},
		}),
	})

	const serverHelpers = createTRPCOptionsProxy({
		client: trpcClient,
		queryClient: queryClient,
	})
	return {
		queryClient,
		trpc: serverHelpers,
	}
}

export function Provider({
	children,
	queryClient,
}: {
	children: React.ReactNode
	queryClient: QueryClient
}) {
	return (
		<TRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
			{children}
		</TRPCProvider>
	)
}
