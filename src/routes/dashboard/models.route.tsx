import { useQuery } from "@tanstack/react-query"
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

import { CreateModelModal } from "@/features/dashboard/model/create-modal"
import { ModelsTable } from "@/features/dashboard/models-table"

import {
	closeCreateModelModal,
	openCreateModelModal,
	useCreateModelModalState,
} from "@/hooks/modals/use-create-model-modal"

import { useTRPC } from "@/integrations/trpc/react"

import type { Model } from "@/types"

export const Route = createFileRoute("/dashboard/models")({
	beforeLoad: ({ context }) =>
		context.queryClient.ensureQueryData(
			context.trpc.models.list.queryOptions({}),
		),
	component: RouteComponent,
})

function RouteComponent() {
	const { isOpen } = useCreateModelModalState()
	const trpc = useTRPC()

	const { data: models } = useQuery({
		...trpc.models.list.queryOptions({}),
		select: (data) => data satisfies Model[],
	})

	return (
		<div>
			<motion.header
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="sticky top-0 z-30 glass border-b border-border px-8 py-4 flex items-center justify-between"
			>
				<div>
					<h1 className="text-2xl mb-1">Models</h1>
					<p className="text-sm text-muted-foreground">
						Manage your AI model proxy models
					</p>
				</div>
				<Button
					onClick={openCreateModelModal}
					className="bg-primary text-primary-foreground hover:shadow-lg transition-all"
				>
					<Plus className="h-4 w-4 mr-2" />
					Create New Model
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
								placeholder="Search models..."
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

				<ModelsTable models={models} />
			</main>

			<CreateModelModal isOpen={isOpen} onClose={closeCreateModelModal} />
		</div>
	)
}
