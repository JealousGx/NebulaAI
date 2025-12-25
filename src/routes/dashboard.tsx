// dashboard layout

import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AnimatePresence, motion, type Variants } from "motion/react";

import { DashboardSidebar } from "@/features/dashboard/sidebar";

export const Route = createFileRoute("/dashboard")({
	component: RouteComponent,
});

function RouteComponent() {
	const pageVariants: Variants = {
		initial: {
			opacity: 0,
			x: -20,
		},
		animate: {
			opacity: 1,
			x: 0,
			transition: {
				duration: 0.3,
				ease: "easeOut",
			},
		},
		exit: {
			opacity: 0,
			x: 20,
			transition: {
				duration: 0.2,
				ease: "easeIn",
			},
		},
	};

	return (
		<div className="flex">
			<DashboardSidebar />

			<AnimatePresence mode="wait">
				<motion.div
					className="flex-1 ml-[280px]"
					variants={pageVariants}
					initial="initial"
					animate="animate"
					exit="exit"
				>
					<Outlet />
				</motion.div>
			</AnimatePresence>
		</div>
	);
}
