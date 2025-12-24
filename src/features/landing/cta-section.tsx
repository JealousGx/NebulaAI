import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

import { Link } from "@/components/ui/link";

export function CTASection() {
	return (
		<section className="py-24 px-4">
			<div className="container mx-auto max-w-4xl">
				<motion.div
					initial={{ opacity: 0, scale: 0.95 }}
					whileInView={{ opacity: 1, scale: 1 }}
					viewport={{ once: true }}
					className="glass rounded-2xl p-12 text-center relative overflow-hidden"
				>
					<div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-secondary/10" />

					<div className="relative">
						<h2 className="text-5xl mb-6">Ready to Build Faster?</h2>
						<p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
							Join developers who are simplifying their AI infrastructure with
							Nebula AI
						</p>

						<div className="flex gap-4 justify-center">
							<Link
								to="/dashboard"
								size="lg"
								className="bg-primary text-primary-foreground hover:shadow-xl transition-all"
							>
								Get Started for Free
								<ArrowRight className="ml-2 h-4 w-4" />
							</Link>
						</div>
					</div>
				</motion.div>
			</div>
		</section>
	);
}
