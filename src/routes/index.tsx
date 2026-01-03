import { createFileRoute, useNavigate } from "@tanstack/react-router"
import z from "zod"

import { AuthModal } from "@/components/auth"

import { CTASection } from "@/features/landing/cta-section"
import { FeaturesSection } from "@/features/landing/features-section"
import { GlassNav } from "@/features/landing/glass-nav"
import { HeroSection } from "@/features/landing/hero-section"

export const Route = createFileRoute("/")({
	validateSearch: (search) =>
		z
			.object({
				auth: z.string().optional(),
				r: z.string().optional(),
			})
			.parse(search),
	component: App,
})

function App() {
	const { auth, r } = Route.useSearch()

	const navigate = useNavigate()

	console.log("r:", r)

	return (
		<div className="min-h-screen relative">
			<GlassNav />
			<HeroSection />
			<FeaturesSection />
			<CTASection />
			<AuthModal
				isOpen={auth === "true" || false}
				onClose={() => {
					navigate({
						to: "/",
						search: (prev) => ({ ...prev, auth: undefined }),
					})
				}}
				onSuccess={() =>
					navigate({
						to: r ? `/${r}` : "/dashboard",
					})
				}
			/>
		</div>
	)
}
