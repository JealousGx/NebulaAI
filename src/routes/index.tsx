import { createFileRoute } from "@tanstack/react-router";

import { CTASection } from "@/features/landing/cta-section";
import { FeaturesSection } from "@/features/landing/features-section";
import { GlassNav } from "@/features/landing/glass-nav";
import { HeroSection } from "@/features/landing/hero-section";

export const Route = createFileRoute("/")({ component: App });

function App() {
	return (
		<div className="min-h-screen relative">
			<GlassNav />
			<HeroSection />
			<FeaturesSection />
			<CTASection />
		</div>
	);
}
