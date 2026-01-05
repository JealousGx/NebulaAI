import { TanStackDevtools } from "@tanstack/react-devtools"
import type { QueryClient } from "@tanstack/react-query"
import {
	createRootRouteWithContext,
	HeadContent,
	Scripts,
} from "@tanstack/react-router"
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools"
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query"

import { Toaster } from "@/components/ui/sonner"

import { VortexBackground } from "@/features/vortex-background"

import TanStackQueryDevtools from "@/integrations/tanstack-query/devtools"
import type { TRPCRouter } from "@/integrations/trpc/router"

import type { getUser } from "@/lib/auth/functions"

import { AppProviders } from "@/providers"

import { userQueryOptions } from "@/queries/user"

import { seo } from "@/utils/seo"

import appCss from "../styles.css?url"

interface MyRouterContext {
	queryClient: QueryClient

	trpc: TRPCOptionsProxy<TRPCRouter>
	user: Awaited<ReturnType<typeof getUser>>
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
	beforeLoad: async ({ context }) => {
		const user = await context.queryClient.fetchQuery(userQueryOptions)

		return { user }
	},
	head: () => ({
		meta: [
			{
				charSet: "utf-8",
			},
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1",
			},
			...seo({
				title:
					"Nebula AI - Control & Manage All 3rd Party AI Models from One Place",
				description:
					"Nebula AI is a developer-centric dashboard that acts as a secure, intelligent proxy and management layer for all your third-party AI model APIs.",
				image: "/og-image.png",
			}),
			{ name: "apple-mobile-web-app-title", content: "Nebula AI" },
		],
		links: [
			{
				rel: "stylesheet",
				href: appCss,
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon-16x16.png",
				sizes: "16x16",
			},
			{
				rel: "icon",
				type: "image/png",
				href: "/favicon-32x32.png",
				sizes: "32x32",
			},
			{ rel: "icon", type: "image/svg+xml", href: "/logo/logo.svg" },
			{ rel: "shortcut icon", href: "/favicon.ico" },
			{
				rel: "apple-touch-icon",
				href: "/apple-touch-icon.png",
				sizes: "180x180",
			},
			{ rel: "manifest", href: "/manifest.json" },
		],
	}),

	shellComponent: RootDocument,
})

function RootDocument({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en" suppressHydrationWarning>
			<head>
				<HeadContent />
			</head>
			<body>
				<AppProviders>
					<VortexBackground />
					{children}
					<TanStackDevtools
						config={{
							position: "bottom-right",
						}}
						plugins={[
							{
								name: "Tanstack Router",
								render: <TanStackRouterDevtoolsPanel />,
							},
							TanStackQueryDevtools,
						]}
					/>
					<Toaster richColors />
				</AppProviders>
				<Scripts />
			</body>
		</html>
	)
}
