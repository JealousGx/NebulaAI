import { createFileRoute } from "@tanstack/react-router"
import { Download, Pause, Play, Search, Terminal, Trash2 } from "lucide-react"
import { motion } from "motion/react"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

export const Route = createFileRoute("/dashboard/logs")({
	component: RouteComponent,
})

interface LogEntry {
	id: number
	timestamp: string
	endpoint: string
	method: string
	status: number
	latency: number
	ip: string
	request: string
	response: string
}

const generateLog = (): LogEntry => ({
	id: Date.now(),
	timestamp: new Date().toISOString(),
	endpoint: `/proxy/${["gpt-4-turbo", "stable-diffusion-xl", "llama-3-70b", "claude-3-opus"][Math.floor(Math.random() * 4)]}`,
	method: "POST",
	status: Math.random() > 0.9 ? 502 : 200,
	latency: Math.floor(Math.random() * 2000) + 200,
	ip: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
	request: '{"prompt": "Generate an image of..."}',
	response: '{"status": "success", "result": "..."}',
})

function RouteComponent() {
	const [logs, setLogs] = useState<LogEntry[]>(
		Array.from({ length: 20 }, generateLog).reverse(),
	)
	const [isPaused, setIsPaused] = useState(false)
	const [selectedLog, setSelectedLog] = useState<LogEntry | null>(null)

	useEffect(() => {
		if (isPaused) return

		const interval = setInterval(() => {
			setLogs((prev) => [generateLog(), ...prev.slice(0, 99)])
		}, 2000)

		return () => clearInterval(interval)
	}, [isPaused])

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
							onClick={() => setLogs([])}
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
							/>
						</div>
						<Select defaultValue="all">
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
									{isPaused ? "Paused" : "Live"} • {logs.length} entries
								</span>
							</div>
						</div>

						<div className="h-[calc(100vh-350px)] overflow-y-auto">
							<div className="divide-y divide-border/50">
								{logs.map((log) => (
									<motion.div
										key={log.id}
										initial={{ opacity: 0, x: -20 }}
										animate={{ opacity: 1, x: 0 }}
										transition={{ duration: 0.3 }}
										onClick={() => setSelectedLog(log)}
										className={`p-4 hover:bg-accent/30 cursor-pointer transition-colors ${
											selectedLog?.id === log.id ? "bg-accent/30" : ""
										}`}
									>
										<div className="flex items-start gap-3">
											<div
												className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
													log.status >= 200 && log.status < 300
														? "bg-chart-2"
														: "bg-destructive"
												}`}
											/>
											<div className="flex-1 min-w-0">
												<div className="flex items-center gap-3 mb-1">
													<span className="text-xs text-muted-foreground">
														{new Date(log.timestamp).toLocaleTimeString()}
													</span>
													<span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
														{log.method}
													</span>
													<span
														className={`text-xs px-2 py-0.5 rounded ${
															log.status >= 200 && log.status < 300
																? "bg-chart-2/20 text-chart-2"
																: "bg-destructive/20 text-destructive"
														}`}
													>
														{log.status}
													</span>
													<span className="text-xs text-muted-foreground">
														{log.latency}ms
													</span>
												</div>
												<div className="text-sm truncate">{log.endpoint}</div>
												<div className="text-xs text-muted-foreground mt-1">
													{log.ip}
												</div>
											</div>
										</div>
									</motion.div>
								))}
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
											{new Date(selectedLog.timestamp).toLocaleString()}
										</div>
									</div>

									<div>
										<div className="text-sm text-muted-foreground mb-2">
											Endpoint
										</div>
										<div className="text-sm bg-background/40 p-3 rounded border border-border">
											{selectedLog.endpoint}
										</div>
									</div>

									<div>
										<div className="text-sm text-muted-foreground mb-2">
											Request Body
										</div>
										<pre className="text-xs bg-background/40 p-3 rounded border border-border overflow-x-auto">
											{JSON.stringify(JSON.parse(selectedLog.request), null, 2)}
										</pre>
									</div>

									<div>
										<div className="text-sm text-muted-foreground mb-2">
											Response Body
										</div>
										<pre className="text-xs bg-background/40 p-3 rounded border border-border overflow-x-auto">
											{JSON.stringify(
												JSON.parse(selectedLog.response),
												null,
												2,
											)}
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
