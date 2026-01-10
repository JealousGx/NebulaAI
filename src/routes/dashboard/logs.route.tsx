import { useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { useVirtualizer } from "@tanstack/react-virtual"
import { Download, Pause, Play, Search, Terminal, Trash2 } from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useMemo, useRef, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

import { LogItem } from "@/features/dashboard/log-item"

import { useDebounce } from "@/hooks/use-debounce"

import { useTRPC } from "@/integrations/trpc/react"

import type { ActivityLog } from "@/types"

const LOG_LIMIT = 100

export const Route = createFileRoute("/dashboard/logs")({
	beforeLoad: ({ context }) => {
		context.queryClient.ensureQueryData(
			context.trpc.activityLog.list.queryOptions({
				limit: LOG_LIMIT,
				offset: 0,
			}),
		)
	},
	component: RouteComponent,
})

function RouteComponent() {
	const [isPaused, setIsPaused] = useState(false)
	const [selectedLog, setSelectedLog] = useState<ActivityLog | null>(null)
	const [statusFilter, setStatusFilter] = useState<
		"all" | "2xx" | "4xx" | "5xx"
	>("all")
	const [searchQuery, setSearchQuery] = useState("")

	const debouncedSearchQuery = useDebounce(searchQuery, 300)

	const trpc = useTRPC()

	const {
		data: logs,
		isLoading,
		refetch,
	} = useQuery(
		trpc.activityLog.list.queryOptions(
			{
				limit: LOG_LIMIT,
				offset: 0,
				statusFilter,
				searchQuery: debouncedSearchQuery,
			},
			{
				refetchInterval: isPaused ? false : 3000, // Refetch every 3 seconds if not paused
			},
		),
	)

	// Effect to update selectedLog if the current selectedLog is no longer in the list (e.g., cleared or filtered out)
	useEffect(() => {
		if (selectedLog && logs && !logs.some((log) => log.id === selectedLog.id)) {
			setSelectedLog(null)
		}
	}, [logs, selectedLog])

	const clearLogs = () => {
		// This clears the displayed logs, but doesn't delete them from the DB.
		setSelectedLog(null)
		refetch() // Refetch to show an empty or new list based on filters
	}

	const parentRef = useRef<HTMLDivElement>(null)

	const rowVirtualizer = useVirtualizer({
		count: logs?.length || 0,
		getScrollElement: () => parentRef.current,
		estimateSize: () => 105,
		overscan: 5,
	})

	const { formattedRequest, formattedResponse } = useMemo(() => {
		try {
			const formattedRequest = selectedLog?.request
				? JSON.stringify(JSON.parse(selectedLog.request), null, 2)
				: "N/A"
			const formattedResponse = selectedLog?.response
				? JSON.stringify(JSON.parse(selectedLog.response), null, 2)
				: "N/A"
			return { formattedRequest, formattedResponse }
		} catch {
			return {
				formattedRequest: "Error parsing request",
				formattedResponse: "Error parsing response",
			}
		}
	}, [selectedLog])

	return (
		<div>
			<motion.header
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="sticky top-0 z-30 glass border-b border-border px-8 py-4"
			>
				<div className="flex items-center justify-between">
					<div className="flex items-center gap-3">
						<Terminal className="h-6 w-6 text-primary" />
						<div>
							<h1 className="text-2xl">Live Logs</h1>
							<p className="text-sm text-muted-foreground">
								Real-time request monitoring
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setIsPaused(!isPaused)}
							className="glass border-border"
						>
							{isPaused ? (
								<Play className="h-4 w-4 mr-2" />
							) : (
								<Pause className="h-4 w-4 mr-2" />
							)}
							{isPaused ? "Resume" : "Pause"}
						</Button>
						<Button variant="outline" size="sm" className="glass border-border">
							<Download className="h-4 w-4 mr-2" />
							Export
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={clearLogs}
							className="glass border-border hover:border-destructive"
						>
							<Trash2 className="h-4 w-4 mr-2" />
							Clear
						</Button>
					</div>
				</div>
			</motion.header>

			<main className="p-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
					className="glass rounded-xl p-6 mb-6"
				>
					<div className="flex items-center gap-4">
						<div className="flex-1 relative">
							<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
							<Input
								placeholder="Filter logs..."
								className="pl-10 bg-background/40 border-border"
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
							/>
						</div>
						<Select
							value={statusFilter}
							onValueChange={(value) =>
								setStatusFilter(value as "all" | "2xx" | "4xx" | "5xx")
							}
						>
							<SelectTrigger className="w-[180px] bg-background/40 border-border">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="2xx">2xx Success</SelectItem>
								<SelectItem value="4xx">4xx Client Error</SelectItem>
								<SelectItem value="5xx">5xx Server Error</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</motion.div>

				<div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-6">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="glass rounded-xl overflow-hidden"
					>
						<div className="border-b border-border px-6 py-4 flex items-center justify-between">
							<div className="flex items-center gap-2">
								<div
									className={`w-2 h-2 rounded-full ${isPaused ? "bg-muted" : "bg-chart-2 animate-pulse"}`}
								/>
								<span className="text-sm text-muted-foreground">
									{isPaused ? "Paused" : "Live"} • {logs?.length || 0} entries
								</span>
							</div>
						</div>

						<div
							ref={parentRef}
							className="h-[calc(100vh-350px)] overflow-y-auto"
						>
							<div
								className="relative divide-y divide-border/50"
								style={{ height: `${rowVirtualizer.getTotalSize()}px` }}
							>
								{isLoading ? (
									<div className="p-4 text-center text-muted-foreground">
										Loading logs...
									</div>
								) : (
									rowVirtualizer.getVirtualItems().map((virtualItem) => {
										const log = logs?.[virtualItem.index]
										if (!log) return null

										return (
											<LogItem
												key={log.id}
												log={log}
												isSelected={selectedLog?.id === log.id}
												virtualItem={virtualItem}
												onSelect={setSelectedLog}
												measureRef={rowVirtualizer.measureElement}
											/>
										)
									})
								)}
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="glass rounded-xl overflow-hidden"
					>
						<div className="border-b border-border px-6 py-4">
							<h3 className="text-lg">Request Details</h3>
						</div>

						<div className="p-6 h-[calc(100vh-350px)] overflow-y-auto">
							{selectedLog ? (
								<div className="space-y-4">
									<div>
										<div className="text-sm text-muted-foreground mb-2">
											Timestamp
										</div>
										<div className="text-sm bg-background/40 p-3 rounded border border-border">
											{new Date(selectedLog.createdAt).toLocaleString()}
										</div>
									</div>

									<div>
										<div className="text-sm text-muted-foreground mb-2">
											Endpoint
										</div>
										<div className="text-sm bg-background/40 p-3 rounded border border-border">
											{selectedLog.endpointId}
										</div>
									</div>

									<div>
										<div className="text-sm text-muted-foreground mb-2">
											Request Body
										</div>
										<pre className="text-xs bg-background/40 p-3 rounded border border-border overflow-x-auto">
											{formattedRequest}
										</pre>
									</div>

									<div>
										<div className="text-sm text-muted-foreground mb-2">
											Response Body
										</div>
										<pre className="text-xs bg-background/40 p-3 rounded border border-border overflow-x-auto">
											{formattedResponse}
										</pre>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div>
											<div className="text-sm text-muted-foreground mb-2">
												Status Code
											</div>
											<div
												className={`text-sm p-3 rounded border ${
													selectedLog.status >= 200 && selectedLog.status < 300
														? "bg-chart-2/20 border-chart-2 text-chart-2"
														: "bg-destructive/20 border-destructive text-destructive"
												}`}
											>
												{selectedLog.status}
											</div>
										</div>

										<div>
											<div className="text-sm text-muted-foreground mb-2">
												Latency
											</div>
											<div className="text-sm bg-background/40 p-3 rounded border border-border">
												{selectedLog.latency}ms
											</div>
										</div>
									</div>
								</div>
							) : (
								<div className="flex items-center justify-center h-full text-muted-foreground">
									Select a log entry to view details
								</div>
							)}
						</div>
					</motion.div>
				</div>
			</main>
		</div>
	)
}
