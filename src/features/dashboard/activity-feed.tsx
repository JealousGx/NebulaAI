import { useQuery } from "@tanstack/react-query"
import {
	Activity as ActivityIcon,
	CheckCircle,
	Clock,
	XCircle,
} from "lucide-react"
import { motion } from "motion/react"

import { useTRPC } from "@/integrations/trpc/react"

export function ActivityFeed() {
	const trpc = useTRPC()
	const { data: activities, isLoading } = useQuery(
		trpc.activityLog.list.queryOptions({}),
	)

	if (isLoading) {
		return <div>Loading activity feed...</div>
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.5 }}
			className="glass rounded-xl p-4 md:p-6 h-[400px] md:h-[calc(100vh-300px)] flex flex-col overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all"
		>
			<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
				<div className="flex items-center gap-3">
					<div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
						<ActivityIcon className="h-4 w-4 md:h-5 md:w-5" />
					</div>
					<div>
						<h3 className="text-base md:text-lg">Global Activity Feed</h3>
						<p className="text-xs text-muted-foreground">
							Real-time request monitoring
						</p>
					</div>
				</div>
				<div className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-full bg-chart-2/10 text-chart-2 text-xs self-start sm:self-auto">
					<div className="w-1.5 h-1.5 rounded-full bg-chart-2 animate-pulse" />
					Live
				</div>
			</div>

			<div className="flex-1 overflow-y-auto space-y-2 scrollbar-thin pr-1 md:pr-2">
				{activities?.map((activity) => (
					<motion.div
						key={activity.id}
						initial={{ opacity: 0, x: -20 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.3 }}
						className="flex items-start gap-2 md:gap-3 p-2 md:p-3 rounded-lg bg-background/20 border border-border/50 hover:border-border hover:bg-background/30 transition-all cursor-pointer group"
					>
						<div
							className={`shrink-0 w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center ${
								activity.status >= 200 && activity.status < 300
									? "bg-chart-2/10 text-chart-2"
									: "bg-destructive/10 text-destructive"
							}`}
						>
							{activity.status >= 200 && activity.status < 300 ? (
								<CheckCircle className="h-3 w-3 md:h-4 md:w-4" />
							) : (
								<XCircle className="h-3 w-3 md:h-4 md:w-4" />
							)}
						</div>

						<div className="flex-1 min-w-0">
							<div className="flex flex-wrap items-center gap-1 md:gap-2 text-xs md:text-sm mb-1 md:mb-1.5">
								<span className="text-muted-foreground">
									{new Date(activity.createdAt).toLocaleTimeString("en-US", {
										hour12: false,
									})}
								</span>
								<span className="px-1.5 md:px-2 py-0.5 rounded bg-chart-3/10 text-chart-3 text-xs">
									{activity.method}
								</span>
							</div>
							<div className="text-xs md:text-sm truncate group-hover:text-primary transition-colors mb-1 md:mb-2">
								{/* Placeholder for model name - activityLog only stores modelId */}
								Model: {activity.modelId}
							</div>
							<div className="flex flex-wrap items-center gap-2 md:gap-3 text-xs">
								<span
									className={`px-1.5 md:px-2 py-0.5 rounded-full ${
										activity.status >= 200 && activity.status < 300
											? "bg-chart-2/10 text-chart-2"
											: "bg-destructive/10 text-destructive"
									}`}
								>
									{activity.status}{" "}
									{activity.status >= 200 && activity.status < 300
										? "OK"
										: "ERROR"}
								</span>
								<span className="text-muted-foreground flex items-center gap-1">
									<Clock className="h-2.5 w-2.5 md:h-3 md:w-3" />
									{activity.latency}ms
								</span>
							</div>
						</div>
					</motion.div>
				))}
			</div>
		</motion.div>
	)
}
