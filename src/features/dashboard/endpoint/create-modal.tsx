import { useStore } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Check, Copy, Sparkles, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import React, { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import { env } from "@/env"

import { useAppForm } from "@/hooks/use-form"

import { useTRPC } from "@/integrations/trpc/react"

import type { Endpoint } from "@/types"

interface CreateEndpointModalProps {
	isOpen: boolean
	onClose: () => void
}

type NewEndpoint = Omit<
	Endpoint,
	"id" | "createdAt" | "updatedAt" | "userId" | "status"
> & {
	apiKey: string
}

const APP_URL = env.VITE_APP_URL

export function CreateEndpointModal({
	isOpen,
	onClose,
}: CreateEndpointModalProps) {
	const [generatedUrl, setGeneratedUrl] = useState("")
	const [copied, setCopied] = useState(false)

	const queryClient = useQueryClient()
	const trpc = useTRPC()

	const mutation = useMutation({
		...trpc.endpoints.create.mutationOptions(),
		meta: {
			invalidateQueryKey: ["endpoints"],
		},
		// fallback until automatic invalidation works
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["endpoints"] })
		},
	})

	const form = useAppForm({
		defaultValues: {
			name: "",
			provider: "",
			model: "",
			apiKey: "",
			description: "",
		} satisfies NewEndpoint,
		validators: {
			onBlur: ({ value }) => {
				const required: Record<string, string> = {
					name: "Name",
					provider: "Provider",
					model: "Model",
					apiKey: "API Key",
				}

				const fields = Object.entries(required).reduce(
					(acc, [key, label]) => {
						const v = (value as Record<string, unknown>)[key]
						if (!v || String(v).trim().length === 0) {
							acc[key] = `${label} is required`
						}
						return acc
					},
					{} as Record<string, string>,
				)

				return { fields }
			},
		},
		onSubmit: async ({ value }) => {
			const created = await toast
				.promise(mutation.mutateAsync(value), {
					loading: "Creating endpoint...",
					success: "Endpoint created successfully!",
					error: (err) => `Error: ${err.message}`,
				})
				.unwrap()

			setGeneratedUrl(`${APP_URL}/proxy/${created.id}`)

			onClose()
		},
	})

	const handleCopy = () => {
		if (!generatedUrl)
			return toast.error("No URL to copy", {
				description: "Please create an endpoint first.",
			})

		navigator.clipboard.writeText(generatedUrl)
		setCopied(true)
		toast.success("URL copied to clipboard", { duration: 2000 })

		setTimeout(() => setCopied(false), 2000)
	}

	const values = useStore(form.store, (state) => state.values)

	return (
		<AnimatePresence>
			{isOpen && (
				<React.Fragment>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={onClose}
						className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
					/>

					{/* Modal */}
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							transition={{ type: "spring", duration: 0.5 }}
							className="glass-border rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Header */}
							<div className="border-b border-border px-8 py-6 flex items-center justify-between bg-linear-to-r from-primary/10 to-secondary/10">
								<div className="flex items-center gap-3">
									<div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
										<Sparkles className="h-5 w-5 text-primary" />
									</div>
									<div>
										<h2 className="text-2xl">Create New Endpoint</h2>
										<p className="text-sm text-muted-foreground">
											Configure your AI model proxy endpoint
										</p>
									</div>
								</div>
								<Button
									variant="ghost"
									size="sm"
									onClick={onClose}
									className="hover:bg-accent"
								>
									<X className="h-5 w-5" />
								</Button>
							</div>

							<div className="grid grid-cols-1 lg:grid-cols-[1fr_400px]">
								{/* Form */}
								<form
									onSubmit={(e) => {
										e.preventDefault()
										e.stopPropagation()
										form.handleSubmit()
									}}
									className="p-8 space-y-6"
								>
									<form.AppField name="name">
										{(field) => (
											<field.TextField
												label="Endpoint Name"
												placeholder="GPT-4 Turbo"
												description="A friendly name to identify this endpoint"
											/>
										)}
									</form.AppField>

									<div className="grid grid-cols-2 gap-4">
										<form.AppField name="provider">
											{(field) => (
												<field.TextField
													label="Provider"
													placeholder="OpenAI"
													description="The AI service provider (e.g., OpenAI, Anthropic)"
												/>
											)}
										</form.AppField>

										<form.AppField name="model">
											{(field) => (
												<field.TextField
													label="Model"
													placeholder="gpt-4-turbo"
													description="The specific model to proxy (e.g., gpt-4-turbo)"
												/>
											)}
										</form.AppField>
									</div>

									<form.AppField name="apiKey">
										{(field) => (
											<field.TextField
												label="API Key"
												placeholder="sk-..."
												className="font-mono"
												description="Your API key will be encrypted and stored securely"
											/>
										)}
									</form.AppField>

									<form.AppField name="description">
										{(field) => (
											<field.TextArea
												label="Description"
												placeholder="Add notes about this endpoint..."
												rows={3}
											/>
										)}
									</form.AppField>

									<div className="flex gap-3 pt-4">
										<form.AppForm>
											<form.SubscribeButton
												label="Create Endpoint"
												className="bg-primary text-primary-foreground hover:shadow-lg transition-all"
											/>

											<Button
												type="button"
												variant="outline"
												onClick={onClose}
												className="glass border-border"
											>
												Cancel
											</Button>
										</form.AppForm>
									</div>
								</form>

								{/* Live Preview */}
								<div className="border-l border-border bg-accent/20 p-8">
									<div className="sticky top-8">
										<div className="flex items-center gap-2 mb-4">
											<div className="w-2 h-2 rounded-full bg-chart-2 animate-pulse" />
											<span className="text-sm text-muted-foreground">
												Live Preview
											</span>
										</div>

										<div className="glass rounded-xl p-6 space-y-6">
											<div>
												<div className="text-xs text-muted-foreground mb-2">
													Endpoint Name
												</div>
												<div className="text-sm">
													{values.name || "Your Endpoint"}
												</div>
											</div>

											<div>
												<div className="text-xs text-muted-foreground mb-2">
													Provider
												</div>
												<div className="flex items-center gap-2">
													<div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
														<span className="text-xs">
															{values.provider.charAt(0).toUpperCase()}
														</span>
													</div>
													<span className="text-sm capitalize">
														{values.provider}
													</span>
												</div>
											</div>

											<div>
												<div className="text-xs text-muted-foreground mb-2">
													Model
												</div>
												<div className="text-sm font-mono">
													{values.model || "Not specified"}
												</div>
											</div>

											<div className="pt-4 border-t border-border">
												<div className="text-xs text-muted-foreground mb-2">
													Generated URL
												</div>
												<div className="flex items-center gap-2">
													<code className="flex-1 text-xs bg-background/40 px-3 py-2 rounded border border-border truncate">
														{generatedUrl || "Not created yet"}
													</code>
													<Button
														size="sm"
														variant="outline"
														onClick={handleCopy}
														className="glass border-border shrink-0"
													>
														{copied ? (
															<Check className="h-3 w-3" />
														) : (
															<Copy className="h-3 w-3" />
														)}
													</Button>
												</div>
											</div>

											<div className="pt-4 border-t border-border">
												<div className="text-xs text-muted-foreground mb-3">
													Quick Start
												</div>
												<pre className="text-xs bg-background/60 p-3 rounded border border-border overflow-x-auto">
													<code>{`curl -X POST \\
  ${generatedUrl} \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Hello!"}'`}</code>
												</pre>
											</div>
										</div>
									</div>
								</div>
							</div>
						</motion.div>
					</div>
				</React.Fragment>
			)}
		</AnimatePresence>
	)
}
