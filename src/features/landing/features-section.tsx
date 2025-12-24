import { Layers, Lock, Shield, Terminal } from "lucide-react";
import { motion } from "motion/react";

const features = [
	{
		icon: Lock,
		title: "Encrypt and Forget",
		description:
			"Add your API keys once. They are encrypted at rest and never exposed to your client apps.",
		gradient: "from-primary/20 to-primary/5",
	},
	{
		icon: Layers,
		title: "One Endpoint, Any Model",
		description:
			"Generate a single proxy URL for any AI. Swap models in the backend without updating all your projects.",
		gradient: "from-chart-2/20 to-chart-2/5",
	},
	{
		icon: Terminal,
		title: "Debug in Real-time",
		description:
			"Monitor costs, track usage, and view a live log stream of every request and response.",
		gradient: "from-chart-3/20 to-chart-3/5",
	},
	{
		icon: Shield,
		title: "Transform on the Fly",
		description:
			"Define custom request transformations to maintain a consistent API interface across all providers.",
		gradient: "from-secondary/20 to-secondary/5",
	},
];

export function FeaturesSection() {
	return (
		<section id="features" className="py-24 px-4">
			<div className="container mx-auto max-w-6xl">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className="text-center mb-16"
				>
					<h2 className="text-5xl mb-4">How It Works</h2>
					<p className="text-xl text-muted-foreground max-w-2xl mx-auto">
						A powerful gateway that sits between your applications and AI
						providers
					</p>
				</motion.div>

				<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
					{features.map((feature, index) => (
						<motion.div
							key={feature.title}
							initial={{ opacity: 0, y: 20 }}
							whileInView={{ opacity: 1, y: 0 }}
							viewport={{ once: true }}
							transition={{ delay: index * 0.1 }}
							whileHover={{ scale: 1.02, y: -4 }}
							className="glass rounded-xl p-8 relative overflow-hidden group cursor-pointer"
						>
							<div
								className={`absolute inset-0 bg-linear-to-br ${feature.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
							/>

							<div className="relative">
								<div className="mb-4 inline-flex p-3 rounded-lg bg-background/40 border border-border">
									<feature.icon className="h-6 w-6 text-primary" />
								</div>

								<h3 className="text-2xl mb-3">{feature.title}</h3>
								<p className="text-muted-foreground">{feature.description}</p>
							</div>
						</motion.div>
					))}
				</div>
			</div>
		</section>
	);
}
