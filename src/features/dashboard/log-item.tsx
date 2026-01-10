import type { VirtualItem } from "@tanstack/react-virtual"
import { motion } from "motion/react"
import { memo } from "react"

import type { ActivityLog } from "@/types"

export const LogItem = memo(
	({
		log,
		isSelected,
		virtualItem,
		onSelect,
		measureRef,
	}: {
		log: ActivityLog
		isSelected: boolean
		virtualItem: VirtualItem
		onSelect: (log: ActivityLog) => void
		measureRef: (node: HTMLElement | null) => void
	}) => {
		return (
			<motion.div
				key={log.id}
				data-index={virtualItem.index}
				ref={measureRef}
				initial={{ opacity: 0, x: -20 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 0.3 }}
				onClick={() => onSelect(log)}
				className={`p-4 hover:bg-accent/30 cursor-pointer transition-colors absolute w-full ${
					isSelected ? "bg-accent/30" : ""
				}`}
				style={{
					transform: `translateY(${virtualItem.start}px)`,
				}}
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
								{new Date(log.createdAt).toLocaleTimeString()}
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
						<div className="text-sm truncate">
							Endpoint ID: {log.endpointId}
						</div>
						<div className="text-xs text-muted-foreground mt-1">
							IP: {log.ip || "N/A"}
						</div>
					</div>
				</div>
			</motion.div>
		)
	},
)

// return (
// 	<motion.div
// 		key={log.id}
// 		data-index={virtualItem.index}
// 		ref={rowVirtualizer.measureElement}
// 		initial={{ opacity: 0, x: -20 }}
// 		animate={{ opacity: 1, x: 0 }}
// 		transition={{ duration: 0.3 }}
// 		onClick={() => setSelectedLog(log)}
// 		className={`p-4 hover:bg-accent/30 cursor-pointer transition-colors absolute w-full ${
// 			selectedLog?.id === log.id ? "bg-accent/30" : ""
// 		}`}
// 		style={{
// 			transform: `translateY(${virtualItem.start}px)`,
// 		}}
// 	>
// 		<div className="flex items-start gap-3">
// 			<div
// 				className={`w-2 h-2 rounded-full mt-2 shrink-0 ${
// 					log.status >= 200 && log.status < 300
// 						? "bg-chart-2"
// 						: "bg-destructive"
// 				}`}
// 			/>
// 			<div className="flex-1 min-w-0">
// 				<div className="flex items-center gap-3 mb-1">
// 					<span className="text-xs text-muted-foreground">
// 						{new Date(log.createdAt).toLocaleTimeString()}
// 					</span>
// 					<span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded">
// 						{log.method}
// 					</span>
// 					<span
// 						className={`text-xs px-2 py-0.5 rounded ${
// 							log.status >= 200 && log.status < 300
// 								? "bg-chart-2/20 text-chart-2"
// 								: "bg-destructive/20 text-destructive"
// 						}`}
// 					>
// 						{log.status}
// 					</span>
// 					<span className="text-xs text-muted-foreground">
// 						{log.latency}ms
// 					</span>
// 				</div>
// 				<div className="text-sm truncate">
// 					Endpoint ID: {log.endpointId}
// 				</div>
// 				<div className="text-xs text-muted-foreground mt-1">
// 					IP: {log.ip || "N/A"}
// 				</div>
// 			</div>
// 		</div>
// 	</motion.div>
// )
