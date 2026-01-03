// dashboard layout

import { createFileRoute, Outlet, redirect } from "@tanstack/react-router"
import { AnimatePresence, motion, type Variants } from "motion/react"

import { DashboardSidebar } from "@/features/dashboard/sidebar"

import { authMiddleware } from "@/middlewares"

export const Route = createFileRoute("/dashboard")({
	beforeLoad: async ({ context, location }) => {
		const path = (() => {
			const pathname = new URL(location.url).pathname
			const parts = pathname.split("/").filter(Boolean)
			return parts.length ? parts[parts.length - 1] : ""
		})()

		if (!context.user) {
			throw redirect({
				to: "/",
				search: {
					auth: "true",
					r: path,
				},
			})
		}
	},
	server: {
		middleware: [authMiddleware],
	},
	component: RouteComponent,
})

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
	}

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
	)
}
