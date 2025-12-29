import {
	Activity,
	AlertCircle,
	CheckCircle,
	Clock,
	Database,
	Server,
	Zap,
} from "lucide-react"
import { motion } from "motion/react"

import { Progress } from "@/components/ui/progress"

interface HealthMetric {
	name: string
	status: "healthy" | "warning" | "error"
	value: string
	percentage: number
	icon: React.ReactNode
}

const healthMetrics: HealthMetric[] = [
	{
		name: "API Server",
		status: "healthy",
		value: "99.9% uptime",
		percentage: 99.9,
		icon: <Server className="h-4 w-4" />,
	},
	{
		name: "Database",
		status: "healthy",
		value: "42ms avg query",
		percentage: 95,
		icon: <Database className="h-4 w-4" />,
	},
	{
		name: "Proxy Layer",
		status: "warning",
		value: "High load",
		percentage: 78,
		icon: <Zap className="h-4 w-4" />,
	},
	{
		name: "Rate Limiter",
		status: "healthy",
		value: "Normal",
		percentage: 92,
		icon: <Clock className="h-4 w-4" />,
	},
]

const getStatusColor = (status: string) => {
	switch (status) {
		case "healthy":
			return "text-chart-2"
		case "warning":
			return "text-chart-3"
		case "error":
			return "text-destructive"
		default:
			return "text-muted-foreground"
	}
}

const getStatusIcon = (status: string) => {
	switch (status) {
		case "healthy":
			return <CheckCircle className="h-4 w-4 text-chart-2" />
		case "warning":
			return <AlertCircle className="h-4 w-4 text-chart-3" />
		case "error":
			return <AlertCircle className="h-4 w-4 text-destructive" />
		default:
			return <AlertCircle className="h-4 w-4 text-muted-foreground" />
	}
}

export function SystemHealthWidget() {
	const overallHealth = healthMetrics.filter(
		(m) => m.status === "healthy",
	).length
	const healthPercentage = (overallHealth / healthMetrics.length) * 100

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.7 }}
			className="glass rounded-xl p-4 md:p-6 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all"
		>
			<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-chart-2/10 flex items-center justify-center text-chart-2">
						<Activity className="h-4 w-4 md:h-5 md:w-5" />
					</div>
					<div>
						<h3 className="text-base md:text-lg">System Health</h3>
						<p className="text-xs text-muted-foreground">
							Real-time monitoring
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2">
					<div
						className={`w-1.5 h-1.5 md:w-2 md:h-2 rounded-full ${healthPercentage === 100 ? "bg-chart-2 animate-pulse" : "bg-chart-3"}`}
					/>
					<span
						className={`text-xs md:text-sm font-medium ${getStatusColor(healthPercentage === 100 ? "healthy" : "warning")}`}
					>
						{Math.round(healthPercentage)}% Healthy
					</span>
				</div>
			</div>

			<div className="space-y-3 md:space-y-4">
				{healthMetrics.map((metric, index) => (
					<motion.div
						key={metric.name}
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ delay: 0.8 + index * 0.05 }}
						className="space-y-2 group/metric"
					>
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2 md:gap-3">
								<div
									className={`w-7 h-7 md:w-9 md:h-9 rounded-lg bg-accent flex items-center justify-center ${getStatusColor(metric.status)} group-hover/metric:scale-110 transition-transform`}
								>
									{metric.icon}
								</div>
								<div>
									<div className="text-xs md:text-sm font-medium group-hover/metric:text-primary transition-colors">
										{metric.name}
									</div>
									<div className="text-xs text-muted-foreground">
										{metric.value}
									</div>
								</div>
							</div>
							<div className="flex items-center gap-1 md:gap-2">
								<span
									className={`text-xs font-medium ${getStatusColor(metric.status)}`}
								>
									{metric.percentage}%
								</span>
								{getStatusIcon(metric.status)}
							</div>
						</div>
						<Progress value={metric.percentage} className="h-1.5 md:h-2" />
					</motion.div>
				))}
			</div>

			<motion.div
				initial={{ opacity: 0 }}
				animate={{ opacity: 1 }}
				transition={{ delay: 1.2 }}
				className="mt-4 md:mt-6 pt-3 md:pt-4 border-t border-border"
			>
				<div className="flex items-center justify-between text-xs">
					<span className="text-muted-foreground">Last checked</span>
					<span className="text-foreground font-medium flex items-center gap-1">
						<div className="w-1 h-1 rounded-full bg-chart-2 animate-pulse" />
						Just now
					</span>
				</div>
			</motion.div>
		</motion.div>
	)
}
