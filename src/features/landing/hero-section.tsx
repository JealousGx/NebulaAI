import { Activity, ArrowRight, Shield, Zap } from "lucide-react";
import { motion } from "motion/react";

import { Link } from "@/components/ui/link";

export function HeroSection() {
	return (
		<section className="min-h-screen flex items-center justify-center px-4 md:px-6 lg:px-4 pt-20 md:pt-24">
			<div className="container mx-auto max-w-6xl">
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
					<motion.div
						initial={{ opacity: 0, x: -50 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6 }}
						className="text-center lg:text-left"
					>
						<motion.h1
							className="text-4xl sm:text-5xl md:text-6xl mb-4 md:mb-6 tracking-tight"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.2 }}
						>
							Centralize.
							<br />
							Control.
							<br />
							<span className="text-primary">Create.</span>
						</motion.h1>

						<motion.p
							className="text-base sm:text-lg md:text-xl text-muted-foreground mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.4 }}
						>
							The universal API gateway for all your AI models. Secure your
							keys, monitor usage, and transform requests with one unified
							dashboard.
						</motion.p>

						<motion.div
							className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center lg:justify-start"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ delay: 0.6 }}
						>
							<Link
								to="/dashboard"
								size="lg"
								className="bg-primary text-primary-foreground hover:shadow-xl transition-all w-full sm:w-auto"
							>
								Get Started for Free
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</motion.div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, scale: 0.8 }}
						animate={{ opacity: 1, scale: 1 }}
						transition={{ duration: 0.8, delay: 0.3 }}
						className="relative"
					>
						<div className="glass rounded-2xl p-6 md:p-8 relative overflow-hidden">
							<div className="absolute inset-0 bg-linear-to-br from-primary/10 to-secondary/10" />

							<div className="relative space-y-3 md:space-y-4">
								<div className="flex items-center gap-3 p-3 md:p-4 rounded-lg bg-background/40 border border-border">
									<Shield className="h-5 w-5 md:h-6 md:w-6 text-primary shrink-0" />
									<div className="min-w-0">
										<div className="text-xs md:text-sm text-muted-foreground">
											Secure Key Vault
										</div>
										<div className="text-sm md:text-base">
											Encrypted at Rest
										</div>
									</div>
								</div>

								<div className="flex items-center gap-3 p-3 md:p-4 rounded-lg bg-background/40 border border-border">
									<Zap className="h-5 w-5 md:h-6 md:w-6 text-chart-2 shrink-0" />
									<div className="min-w-0">
										<div className="text-xs md:text-sm text-muted-foreground">
											Unified Endpoints
										</div>
										<div className="text-sm md:text-base">
											One API for All Models
										</div>
									</div>
								</div>

								<div className="flex items-center gap-3 p-3 md:p-4 rounded-lg bg-background/40 border border-border">
									<Activity className="h-5 w-5 md:h-6 md:w-6 text-chart-3 shrink-0" />
									<div className="min-w-0">
										<div className="text-xs md:text-sm text-muted-foreground">
											Live Analytics
										</div>
										<div className="text-sm md:text-base">
											Real-time Monitoring
										</div>
									</div>
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</div>
		</section>
	);
}
