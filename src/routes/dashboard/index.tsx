import { createFileRoute } from "@tanstack/react-router"
import { Plus, TrendingUp } from "lucide-react"
import { motion } from "motion/react"
import React from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import { ActivityFeed } from "@/features/dashboard/activity-feed"
import { CreateEndpointModal } from "@/features/dashboard/endpoint/create-modal"
import { EndpointsTable } from "@/features/dashboard/endpoints-table"
import { StatsPanel } from "@/features/dashboard/stats-panel"
import { SystemHealthWidget } from "@/features/dashboard/system-health-widget"
import { UsageCharts } from "@/features/dashboard/usage-charts"

import {
	closeCreateEndpointModal,
	openCreateEndpointModal,
	useCreateEndpointModalState,
} from "@/hooks/modals/use-create-endpoint-modal"

export const Route = createFileRoute("/dashboard/")({
	beforeLoad: ({ context }) => {
		context.queryClient.ensureQueryData(
			context.trpc.stats.getDashboardStats.queryOptions(),
		)
		context.queryClient.ensureQueryData(
			context.trpc.activityLog.list.queryOptions({}),
		)
		context.queryClient.ensureQueryData(
			context.trpc.stats.getRequestCostTrend.queryOptions({ days: 7 }),
		)
		context.queryClient.ensureQueryData(
			context.trpc.stats.getLatencyTrend.queryOptions({ hours: 24 }),
		)
		context.queryClient.ensureQueryData(
			context.trpc.endpoints.list.queryOptions(),
		)
	},
	component: RouteComponent,
})

function RouteComponent() {
	const { isOpen } = useCreateEndpointModalState()

	return (
		<React.Fragment>
			<motion.header
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				transition={{ delay: 0.2 }}
				className="sticky top-0 z-30 glass border-b border-border px-4 md:px-8 py-4 md:py-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
			>
				<div className="ml-12 lg:ml-0">
					<h1 className="text-2xl md:text-3xl mb-1">Dashboard</h1>
					<p className="text-xs md:text-sm text-muted-foreground">
						Welcome back! Here's what's happening with your AI infrastructure.
					</p>
				</div>
				<div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
					<Button
						variant="outline"
						className="border-border/50 hover:border-primary/50 transition-all flex-1 sm:flex-none text-xs md:text-sm"
						onClick={() =>
							toast.success("Export started", {
								description: "Your analytics report will be ready shortly.",
							})
						}
					>
						<TrendingUp className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
						<span className="hidden sm:inline">Export Report</span>
						<span className="sm:hidden">Export</span>
					</Button>
					<Button
						onClick={openCreateEndpointModal}
						className="bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all relative overflow-hidden group flex-1 sm:flex-none text-xs md:text-sm"
					>
						<div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
						<Plus className="h-3 w-3 md:h-4 md:w-4 mr-1 md:mr-2" />
						<span className="hidden sm:inline">Create New Endpoint</span>
						<span className="sm:hidden">Create</span>
					</Button>
				</div>
			</motion.header>

			<main className="p-4 md:p-8 space-y-4 md:space-y-6 pb-20 md:pb-8">
				<StatsPanel />

				<UsageCharts />

				<div className="grid grid-cols-1 xl:grid-cols-[1fr_400px] gap-4 md:gap-6">
					<EndpointsTable />
					<div className="space-y-4 md:space-y-6">
						<ActivityFeed />
						<SystemHealthWidget />
					</div>
				</div>
			</main>

			<CreateEndpointModal isOpen={isOpen} onClose={closeCreateEndpointModal} />
		</React.Fragment>
	)
}
