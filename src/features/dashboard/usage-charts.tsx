import { useQuery } from "@tanstack/react-query"
import { Activity, BarChart3, Clock } from "lucide-react"
import { motion } from "motion/react"
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Line,
	LineChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts"

import { useTRPC } from "@/integrations/trpc/react"

const CustomTooltip = ({ active, payload, label }: any) => {
	if (active && payload && payload.length) {
		return (
			<div className="glass rounded-lg p-4 shadow-xl">
				<p className="text-sm mb-3 text-foreground font-medium">{label}</p>
				{payload.map((entry: any) => (
					<div
						key={entry.name}
						className="flex items-center justify-between gap-6 mb-1"
					>
						<div className="flex items-center gap-2">
							<div
								className="w-2 h-2 rounded-full"
								style={{ backgroundColor: entry.color }}
							/>
							<span className="text-xs text-muted-foreground capitalize">
								{entry.name}:
							</span>
						</div>
						<span
							className="text-sm font-medium"
							style={{ color: entry.color }}
						>
							{typeof entry.value === "number"
								? entry.value.toLocaleString()
								: entry.value}
						</span>
					</div>
				))}
			</div>
		)
	}
	return null
}

export function UsageCharts() {
	const trpc = useTRPC()
	const { data: requestCostTrendData, isLoading: isLoadingRequestCostTrend } =
		useQuery(trpc.stats.getRequestCostTrend.queryOptions({ days: 7 }))

	const { data: modelUsageData, isLoading: isLoadingModelUsage } = useQuery(
		trpc.stats.getModelUsage.queryOptions(),
	)

	const { data: latencyTrendData, isLoading: isLoadingLatencyTrend } = useQuery(
		trpc.stats.getLatencyTrend.queryOptions({ hours: 24 }),
	)

	if (
		isLoadingRequestCostTrend ||
		isLoadingModelUsage ||
		isLoadingLatencyTrend
	) {
		return <div>Loading charts...</div>
	}

	// Transform data for charts
	const transformedRequestCostTrend =
		requestCostTrendData?.map((dataPoint) => ({
			date: dataPoint.date,
			requests: dataPoint.requests,
			cost: dataPoint.cost,
		})) || []

	const transformedModelUsage =
		modelUsageData?.map((dataPoint) => ({
			model: dataPoint.model,
			usage: dataPoint.usage,
		})) || []

	const transformedLatencyTrend =
		latencyTrendData?.map((dataPoint) => ({
			time: dataPoint.time,
			latency: dataPoint.latency,
		})) || []

	return (
		<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
			{/* Request & Cost Trend */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.4 }}
				className="glass rounded-xl p-4 md:p-6 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all group"
			>
				<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
							<Activity className="h-4 w-4 md:h-5 md:w-5" />
						</div>
						<div>
							<h3 className="text-base md:text-lg">Request & Cost Trend</h3>
							<p className="text-xs text-muted-foreground">
								Last 7 days performance
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-chart-2/10 text-chart-2 text-xs self-start sm:self-auto">
						<div className="w-1.5 h-1.5 rounded-full bg-chart-2 animate-pulse" />
						Live
					</div>
				</div>

				<ResponsiveContainer width="100%" height={280}>
					<AreaChart data={transformedRequestCostTrend}>
						<defs>
							<linearGradient id="colorRequests" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="rgb(114, 192, 255)"
									stopOpacity={0.4}
								/>
								<stop
									offset="95%"
									stopColor="rgb(114, 192, 255)"
									stopOpacity={0}
								/>
							</linearGradient>
							<linearGradient id="colorCost" x1="0" y1="0" x2="0" y2="1">
								<stop
									offset="5%"
									stopColor="rgb(190, 220, 140)"
									stopOpacity={0.3}
								/>
								<stop
									offset="95%"
									stopColor="rgb(190, 220, 140)"
									stopOpacity={0}
								/>
							</linearGradient>
						</defs>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="rgba(255,255,255,0.05)"
						/>
						<XAxis
							dataKey="date"
							stroke="rgba(255,255,255,0.3)"
							style={{ fontSize: "12px" }}
							tickLine={false}
						/>
						<YAxis
							stroke="rgba(255,255,255,0.3)"
							style={{ fontSize: "12px" }}
							tickLine={false}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Area
							type="monotone"
							dataKey="requests"
							stroke="rgb(114, 192, 255)"
							fillOpacity={1}
							fill="url(#colorRequests)"
							strokeWidth={2}
						/>
					</AreaChart>
				</ResponsiveContainer>
			</motion.div>

			{/* Model Usage Distribution */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.5 }}
				className="glass rounded-xl p-4 md:p-6 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all group"
			>
				<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-chart-3/10 flex items-center justify-center text-chart-3">
							<BarChart3 className="h-4 w-4 md:h-5 md:w-5" />
						</div>
						<div>
							<h3 className="text-base md:text-lg">Model Usage</h3>
							<p className="text-xs text-muted-foreground">
								Distribution by AI model
							</p>
						</div>
					</div>
					<div className="text-left sm:text-right">
						<div className="text-xl md:text-2xl">
							{transformedModelUsage
								.reduce((sum, item) => sum + item.usage, 0)
								.toLocaleString()}
						</div>
						<div className="text-xs text-muted-foreground">Total calls</div>
					</div>
				</div>

				<ResponsiveContainer width="100%" height={280}>
					<BarChart data={transformedModelUsage}>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="rgba(255,255,255,0.05)"
						/>
						<XAxis
							dataKey="model"
							stroke="rgba(255,255,255,0.3)"
							style={{ fontSize: "11px" }}
							tickLine={false}
							angle={-15}
							textAnchor="end"
							height={60}
						/>
						<YAxis
							stroke="rgba(255,255,255,0.3)"
							style={{ fontSize: "12px" }}
							tickLine={false}
						/>
						<Tooltip
							content={<CustomTooltip />}
							cursor={{ fill: "rgba(255,255,255,0.04)" }}
						/>
						<Bar
							dataKey="usage"
							fill="rgb(114, 192, 255)"
							radius={[8, 8, 0, 0]}
							className="hover:opacity-80 transition-opacity"
						/>
					</BarChart>
				</ResponsiveContainer>
			</motion.div>

			{/* Average Latency */}
			<motion.div
				initial={{ opacity: 0, y: 20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.6 }}
				className="glass rounded-xl p-4 md:p-6 overflow-hidden lg:col-span-2 hover:shadow-xl hover:shadow-primary/5 transition-all group"
			>
				<div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 md:mb-6 gap-3">
					<div className="flex items-center gap-3">
						<div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-chart-2/10 flex items-center justify-center text-chart-2">
							<Clock className="h-4 w-4 md:h-5 md:w-5" />
						</div>
						<div>
							<h3 className="text-base md:text-lg">Average Latency</h3>
							<p className="text-xs text-muted-foreground">
								Response time over 24 hours
							</p>
						</div>
					</div>
					<div className="flex flex-wrap items-center gap-2 md:gap-4">
						<div className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-accent">
							<span className="text-xs">
								Avg:{" "}
								<span className="font-medium">
									{transformedLatencyTrend.length > 0
										? (
												transformedLatencyTrend.reduce(
													(sum, item) => sum + item.latency,
													0,
												) / transformedLatencyTrend.length
											).toFixed(0)
										: 0}
									ms
								</span>
							</span>
						</div>
						{/* P95 latency is not directly available from the current getLatencyTrend query */}
						<div className="flex items-center gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-accent">
							<span className="text-xs text-muted-foreground">
								P95: <span className="font-medium text-foreground">N/A</span>
							</span>
						</div>
					</div>
				</div>

				<ResponsiveContainer width="100%" height={200}>
					<LineChart data={transformedLatencyTrend}>
						<CartesianGrid
							strokeDasharray="3 3"
							stroke="rgba(255,255,255,0.05)"
						/>
						<XAxis
							dataKey="time"
							stroke="rgba(255,255,255,0.3)"
							style={{ fontSize: "12px" }}
							tickLine={false}
						/>
						<YAxis
							stroke="rgba(255,255,255,0.3)"
							style={{ fontSize: "12px" }}
							label={{
								value: "ms",
								angle: -90,
								position: "insideLeft",
								style: { fill: "rgba(255,255,255,0.3)" },
							}}
							tickLine={false}
						/>
						<Tooltip content={<CustomTooltip />} />
						<Line
							type="monotone"
							dataKey="latency"
							stroke="rgb(190, 220, 140)"
							strokeWidth={3}
							dot={{
								fill: "rgb(190, 220, 140)",
								r: 5,
								strokeWidth: 2,
								stroke: "rgb(24, 24, 27)",
							}}
							activeDot={{ r: 7, strokeWidth: 2 }}
						/>
					</LineChart>
				</ResponsiveContainer>
			</motion.div>
		</div>
	)
}
