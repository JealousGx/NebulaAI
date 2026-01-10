import { useQuery } from "@tanstack/react-query"
import { ArrowDownRight, ArrowUpRight } from "lucide-react"
import { motion } from "motion/react"

import { useTRPC } from "@/integrations/trpc/react"

export function StatsPanel() {
	const trpc = useTRPC()
	const { data: stats, isLoading } = useQuery(
		trpc.stats.getDashboardStats.queryOptions(),
	)

	if (isLoading || !stats) {
		return <div>Loading...</div>
	}

	const statsData = [
		{
			label: "Total Requests (30d)",
			value: stats.totalRequests.value.toLocaleString(),
			change: `${stats.totalRequests.change}%`,
			isPositive: parseFloat(stats.totalRequests.change) >= 0,
		},
		{
			label: "Total Cost (30d)",
			value: `$${stats.totalCost.value}`,
			change: `${stats.totalCost.change}%`,
			isPositive: parseFloat(stats.totalCost.change) >= 0,
		},
		{
			label: "Active Endpoints",
			value: stats.activeEndpoints.toLocaleString(),
			change: "",
			isPositive: true,
		},
		{
			label: "Error Rate",
			value: `${stats.errorRate}%`,
			change: "",
			isPositive: parseFloat(stats.errorRate) <= 5,
		},
		{
			label: "Avg Latency",
			value: `${stats.avgLatency}ms`,
			change: "",
			isPositive: stats.avgLatency <= 500,
		},
	]

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.3 }}
			className="glass rounded-xl p-4 md:p-6 overflow-hidden relative group"
		>
			{/* Subtle glow effect on hover */}
			<div className="absolute inset-0 bg-linear-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

			<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-0 md:divide-x divide-border relative z-10">
				{statsData.map((stat, index) => (
					<motion.div
						key={stat.label}
						initial={{ opacity: 0, y: 10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 + index * 0.05 }}
						className="md:px-4 lg:px-6 md:first:pl-0 md:last:pr-0 group/stat"
					>
						<div className="text-xs text-muted-foreground mb-2 md:mb-3 uppercase tracking-wider">
							{stat.label}
						</div>
						<div className="text-2xl md:text-3xl lg:text-4xl mb-2 md:mb-3 group-hover/stat:text-primary transition-colors">
							{stat.value}
						</div>
						<div
							className={`flex items-center gap-1 md:gap-1.5 text-xs md:text-sm ${stat.isPositive ? "text-chart-2" : "text-destructive"}`}
						>
							{stat.change && (
								<>
									<div
										className={`flex items-center justify-center w-4 h-4 md:w-5 md:h-5 rounded-full ${stat.isPositive ? "bg-chart-2/10" : "bg-destructive/10"}`}
									>
										{stat.isPositive ? (
											<ArrowUpRight className="h-2.5 w-2.5 md:h-3 md:w-3" />
										) : (
											<ArrowDownRight className="h-2.5 w-2.5 md:h-3 md:w-3" />
										)}
									</div>
									<span className="font-medium">{stat.change}</span>
									<span className="text-xs text-muted-foreground hidden lg:inline">
										vs last month
									</span>
								</>
							)}
						</div>
					</motion.div>
				))}
			</div>
		</motion.div>
	)
}
