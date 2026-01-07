import { Check, Copy, Edit, Eye, Trash2, X } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"
import { Line, LineChart, ResponsiveContainer } from "recharts"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import type { Endpoint } from "@/types"

const mockSparklineData = (base: number) =>
	Array.from({ length: 24 }, (_) => ({
		value: base + Math.random() * 100 - 50,
	}))

interface IEndpointsTable {
	endpoints?: Endpoint[]
}

export function EndpointsTable({ endpoints }: IEndpointsTable) {
	const [selectedEndpoint, setSelectedEndpoint] = useState<string | null>(null)
	const [isEditing, setIsEditing] = useState(false)
	const [newName, setNewName] = useState("")

	if (!endpoints || endpoints.length === 0) {
		return (
			<div className="p-6 text-center text-muted-foreground">
				No endpoints found. Create a new endpoint to get started.
			</div>
		)
	}

	const handleEdit = (id: string) => {
		setSelectedEndpoint(id)
		setIsEditing(true)
		const endpoint = endpoints.find((e) => e.id === id)
		if (endpoint) {
			setNewName(endpoint.name)
		}
	}

	const handleSave = () => {
		if (selectedEndpoint && newName) {
			const endpointIndex = endpoints.findIndex(
				(e) => e.id === selectedEndpoint,
			)
			if (endpointIndex !== -1) {
				endpoints[endpointIndex].name = newName
			}
		}
		setIsEditing(false)
		setSelectedEndpoint(null)
	}

	const handleCancel = () => {
		setIsEditing(false)
		setSelectedEndpoint(null)
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
			className="glass rounded-xl overflow-hidden"
		>
			<div className="border-b border-border px-6 py-4">
				<h3 className="text-xl">Active Endpoints</h3>
			</div>

			<div className="overflow-x-auto">
				<table className="w-full">
					<thead className="border-b border-border">
						<tr>
							<th className="text-left px-6 py-4 text-sm text-muted-foreground">
								Status
							</th>
							<th className="text-left px-6 py-4 text-sm text-muted-foreground">
								Name
							</th>
							<th className="text-left px-6 py-4 text-sm text-muted-foreground">
								Provider
							</th>
							<th className="text-left px-6 py-4 text-sm text-muted-foreground">
								24h Requests
							</th>
							<th className="text-left px-6 py-4 text-sm text-muted-foreground">
								Trend
							</th>
							<th className="text-left px-6 py-4 text-sm text-muted-foreground">
								Actions
							</th>
						</tr>
					</thead>
					<tbody>
						{endpoints.map((endpoint, index) => (
							<motion.tr
								key={endpoint.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.5 + index * 0.05 }}
								className="border-b border-border/50 hover:bg-accent/30 transition-colors"
							>
								<td className="px-6 py-4">
									<div
										className={`w-3 h-3 rounded-full ${
											endpoint.status === "active"
												? "bg-chart-2 shadow-[0_0_8px_rgba(114,192,255,0.6)]"
												: "bg-destructive shadow-[0_0_8px_rgba(255,100,100,0.6)]"
										}`}
									/>
								</td>
								<td className="px-6 py-4">
									{isEditing && selectedEndpoint === endpoint.id ? (
										<div className="flex items-center">
											<Input
												value={newName}
												onChange={(e) => setNewName(e.target.value)}
												className="w-32"
											/>
											<Button
												variant="ghost"
												size="sm"
												className="hover:bg-accent"
												onClick={handleSave}
											>
												<Check className="h-4 w-4" />
											</Button>
											<Button
												variant="ghost"
												size="sm"
												className="hover:bg-accent"
												onClick={handleCancel}
											>
												<X className="h-4 w-4" />
											</Button>
										</div>
									) : (
										<div>
											<div>{endpoint.name}</div>
											<div className="text-xs text-muted-foreground mt-1">
												/api/proxy/{endpoint.name}
											</div>
										</div>
									)}
								</td>
								<td className="px-6 py-4 text-muted-foreground">
									{endpoint.provider}
								</td>
								<td className="px-6 py-4">
									{/* {endpoint.requests.toLocaleString()} */}
									{
										// random number between 800 and 4500
										(
											Math.floor(Math.random() * (4500 - 800 + 1)) + 800
										).toLocaleString()
									}
								</td>
								<td className="px-6 py-4">
									<ResponsiveContainer width={80} height={30}>
										{/* <LineChart data={endpoint.sparkline}> */}
										<LineChart
											data={mockSparklineData(
												Math.floor(Math.random() * (150 - 80 + 1)) + 80,
											)}
										>
											<Line
												type="monotone"
												dataKey="value"
												stroke="oklch(0.7214 0.1337 49.9802)"
												strokeWidth={2}
												dot={false}
											/>
										</LineChart>
									</ResponsiveContainer>
								</td>
								<td className="px-6 py-4">
									<div className="flex items-center gap-2">
										<Button
											variant="ghost"
											size="sm"
											className="hover:bg-accent"
										>
											<Copy className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="hover:bg-accent"
										>
											<Eye className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="hover:bg-accent"
											onClick={() => handleEdit(endpoint.id)}
										>
											<Edit className="h-4 w-4" />
										</Button>
										<Button
											variant="ghost"
											size="sm"
											className="hover:bg-destructive/20"
										>
											<Trash2 className="h-4 w-4" />
										</Button>
									</div>
								</td>
							</motion.tr>
						))}
					</tbody>
				</table>
			</div>
		</motion.div>
	)
}
