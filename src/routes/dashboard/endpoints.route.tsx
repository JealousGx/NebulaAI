import { createFileRoute } from "@tanstack/react-router"
import { Plus, Search } from "lucide-react"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select"

import { CreateEndpointModal } from "@/features/dashboard/endpoint/create-modal"
import { EndpointsTable } from "@/features/dashboard/endpoints-table"

import {
	closeCreateEndpointModal,
	openCreateEndpointModal,
	useCreateEndpointModalState,
} from "@/hooks/modals/use-create-endpoint-modal"

export const Route = createFileRoute("/dashboard/endpoints")({
	component: RouteComponent,
})

function RouteComponent() {
	const { isOpen } = useCreateEndpointModalState()

	return (
		<div>
			<motion.header
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="sticky top-0 z-30 glass border-b border-border px-8 py-4 flex items-center justify-between"
			>
				<div>
					<h1 className="text-2xl mb-1">Endpoints</h1>
					<p className="text-sm text-muted-foreground">
						Manage your AI model proxy endpoints
					</p>
				</div>
				<Button
					onClick={openCreateEndpointModal}
					className="bg-primary text-primary-foreground hover:shadow-lg transition-all"
				>
					<Plus className="h-4 w-4 mr-2" />
					Create New Endpoint
				</Button>
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
								placeholder="Search endpoints..."
								className="pl-10 bg-background/40 border-border"
							/>
						</div>
						<Select defaultValue="all">
							<SelectTrigger className="w-[180px] bg-background/40 border-border">
								<SelectValue placeholder="Filter by status" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all">All Status</SelectItem>
								<SelectItem value="active">Active</SelectItem>
								<SelectItem value="inactive">Inactive</SelectItem>
								<SelectItem value="error">Error</SelectItem>
							</SelectContent>
						</Select>
						<Select defaultValue="all-providers">
							<SelectTrigger className="w-[180px] bg-background/40 border-border">
								<SelectValue placeholder="Filter by provider" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="all-providers">All Providers</SelectItem>
								<SelectItem value="openai">OpenAI</SelectItem>
								<SelectItem value="replicate">Replicate</SelectItem>
								<SelectItem value="huggingface">Hugging Face</SelectItem>
								<SelectItem value="anthropic">Anthropic</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</motion.div>

				<EndpointsTable />
			</main>

			<CreateEndpointModal isOpen={isOpen} onClose={closeCreateEndpointModal} />
		</div>
	)
}
