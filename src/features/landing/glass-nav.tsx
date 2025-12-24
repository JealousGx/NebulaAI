import { motion } from "motion/react";

import { Logo } from "@/components/common/logo";
import { Link } from "@/components/ui/link";

export function GlassNav() {
	return (
		<motion.nav
			initial={{ y: -100 }}
			animate={{ y: 0 }}
			className="container fixed top-0 left-0 right-0 z-50 glass mx-auto mt-4 rounded-lg"
		>
			<div className="px-6 py-4 flex items-center justify-between">
				<motion.div
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2 }}
					className="flex items-center gap-2"
				>
					<Logo className="w-8 h-8" />
					<span className="text-lg">Nebula AI</span>
				</motion.div>

				<div className="flex items-center gap-6">
					<Link
						to="/dashboard"
						className="bg-primary text-primary-foreground hover:shadow-lg transition-all"
					>
						Get Started
					</Link>
				</div>
			</div>
		</motion.nav>
	);
}
