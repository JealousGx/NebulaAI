import { Check, Copy, Edit, Eye, Trash2, X } from "lucide-react"
import { motion } from "motion/react"
import { useState } from "react"
import { Line, LineChart, ResponsiveContainer } from "recharts"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import type { Model } from "@/types"

const mockSparklineData = (base: number) =>
	Array.from({ length: 24 }, (_) => ({
		value: base + Math.random() * 100 - 50,
	}))

interface IModelsTable {
	models?: Model[]
}

export function ModelsTable({ models }: IModelsTable) {
	const [selectedModel, setSelectedModel] = useState<string | null>(null)
	const [isEditing, setIsEditing] = useState(false)
	const [newName, setNewName] = useState("")

	if (!models || models.length === 0) {
		return (
			<div className="p-6 text-center text-muted-foreground">
				No models found. Create a new model to get started.
			</div>
		)
	}

	const handleEdit = (id: string) => {
		setSelectedModel(id)
		setIsEditing(true)
		const model = models.find((m) => m.id === id)
		if (model) {
			setNewName(model.name)
		}
	}

	const handleSave = () => {
		if (selectedModel && newName) {
			const modelIndex = models.findIndex((m) => m.id === selectedModel)
			if (modelIndex !== -1) {
				models[modelIndex].name = newName
			}
		}
		setIsEditing(false)
		setSelectedModel(null)
	}

	const handleCancel = () => {
		setIsEditing(false)
		setSelectedModel(null)
	}

	return (
		<motion.div
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay: 0.4 }}
			className="glass rounded-xl overflow-hidden"
		>
			<div className="border-b border-border px-6 py-4">
				<h3 className="text-xl">Active Models</h3>
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
						{models.map((model, index) => (
							<motion.tr
								key={model.id}
								initial={{ opacity: 0, x: -20 }}
								animate={{ opacity: 1, x: 0 }}
								transition={{ delay: 0.5 + index * 0.05 }}
								className="border-b border-border/50 hover:bg-accent/30 transition-colors"
							>
								<td className="px-6 py-4">
									<div
										className={`w-3 h-3 rounded-full ${
											model.status === "active"
												? "bg-chart-2 shadow-[0_0_8px_rgba(114,192,255,0.6)]"
												: "bg-destructive shadow-[0_0_8px_rgba(255,100,100,0.6)]"
										}`}
									/>
								</td>
								<td className="px-6 py-4">
									{isEditing && selectedModel === model.id ? (
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
											<div>{model.name}</div>
											<div className="text-xs text-muted-foreground mt-1">
												/api/proxy/{model.model}
											</div>
										</div>
									)}
								</td>
								<td className="px-6 py-4 text-muted-foreground">
									{model.provider}
								</td>
								<td className="px-6 py-4">
									{/* {model.requests.toLocaleString()} */}
									{
										// random number between 800 and 4500
										(
											Math.floor(Math.random() * (4500 - 800 + 1)) + 800
										).toLocaleString()
									}
								</td>
								<td className="px-6 py-4">
									<ResponsiveContainer width={80} height={30}>
										{/* <LineChart data={model.sparkline}> */}
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
											onClick={() => handleEdit(model.id)}
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
