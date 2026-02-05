import { Link, useRouterState } from "@tanstack/react-router"
import {
	Layers,
	LayoutDashboard,
	Menu,
	Settings,
	Terminal,
	X,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import React, { useState } from "react"

import { Logo } from "@/components/common/logo"

import { UserProfileDropdown } from "./user-profile-dropdown"

const navItems = [
	{ icon: LayoutDashboard, label: "Dashboard", id: "/dashboard" },
	{ icon: Layers, label: "Models", id: "/dashboard/models" },
	{ icon: Terminal, label: "Live Logs", id: "/dashboard/logs" },
	{ icon: Settings, label: "Settings", id: "/dashboard/settings" },
]

export function DashboardSidebar() {
	const [isMobileOpen, setIsMobileSidebarOpen] = useState(false)
	const [isDesktop, setIsDesktop] = React.useState(false)

	React.useEffect(() => {
		const media = window.matchMedia("(min-width: 1024px)")
		const update = () => setIsDesktop(media.matches)

		update()
		media.addEventListener("change", update)
		return () => media.removeEventListener("change", update)
	}, [])

	const location = useRouterState({ select: (s) => s.location })

	const activePage = location.pathname

	return (
		<React.Fragment>
			{/* Mobile Menu Button */}
			<button
				type="button"
				onClick={() => setIsMobileSidebarOpen((prev) => !prev)}
				className="lg:hidden fixed top-4 left-4 z-50 w-10 h-10 rounded-lg glass border border-border flex items-center justify-center"
			>
				{isMobileOpen ? (
					<X className="h-5 w-5" />
				) : (
					<Menu className="h-5 w-5" />
				)}
			</button>

			{/* Mobile Overlay */}
			<AnimatePresence>
				{isMobileOpen && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={() => setIsMobileSidebarOpen(false)}
						className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-40"
					/>
				)}
			</AnimatePresence>

			{/* Sidebar */}
			<motion.aside
				initial={{ x: -280 }}
				animate={{
					x: isMobileOpen || isDesktop ? 0 : -280,
				}}
				transition={{ duration: 0.3, ease: "easeOut" }}
				className="fixed left-0 top-0 h-screen w-[280px] glass border-r border-border p-6 z-50 lg:z-40 flex flex-col"
			>
				<div className="flex items-center gap-2 mb-12 mt-2 lg:mt-0 cursor-default select-none">
					<Logo className="w-10 h-10" />
					<span className="text-xl">Nebula AI</span>
				</div>

				<nav className="space-y-2">
					{navItems.map((item) => {
						const isActive = normalize(activePage) === normalize(item.id)
						return (
							<Link
								key={item.id}
								to={item.id}
								className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
									isActive
										? "bg-sidebar-accent text-sidebar-accent-foreground"
										: "text-muted-foreground hover:text-foreground hover:bg-accent/50"
								}`}
							>
								<item.icon className="h-5 w-5" />
								<span>{item.label}</span>
							</Link>
						)
					})}
				</nav>

				<div className="mt-auto space-y-4">
					<UserProfileDropdown />

					{/* <div className="glass rounded-lg p-4 border border-border">
						<div className="text-sm text-muted-foreground mb-1">
							API Credits
						</div>
						<div className="text-2xl mb-2">2,847</div>
						<div className="h-1 bg-muted rounded-full overflow-hidden">
							<div className="h-full bg-primary w-[65%]" />
						</div>
					</div> */}
				</div>
			</motion.aside>
		</React.Fragment>
	)
}

const normalize = (p: string) => (p === "/" ? "/" : p.replace(/\/$/, ""))
