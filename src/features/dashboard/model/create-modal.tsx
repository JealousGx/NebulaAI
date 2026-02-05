import { useStore } from "@tanstack/react-form"
import { useMutation } from "@tanstack/react-query"
import { Check, Copy, Sparkles, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import React, { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import { env } from "@/env"

import { useAppForm } from "@/hooks/use-form"

import { useTRPC } from "@/integrations/trpc/react"
import { getProviders } from "@/lib/ai/providers"
import { isEmpty } from "@/lib/utils"
import type { Model } from "@/types"

interface CreateModelModalProps {
	isOpen: boolean
	onClose: () => void
}

type NewModel = Omit<
	Model,
	"id" | "createdAt" | "updatedAt" | "userId" | "status" | "transformation"
> & {
	apiKey: string
}

const APP_URL = env.VITE_APP_URL

export function CreateModelModal({ isOpen, onClose }: CreateModelModalProps) {
	const [generatedUrl, setGeneratedUrl] = useState("")
	const [copied, setCopied] = useState(false)

	const trpc = useTRPC()

	const mutation = useMutation({
		...trpc.models.create.mutationOptions(),
		meta: {
			invalidateQueryKey: [["models"]],
		},
	})

	const form = useAppForm({
		defaultValues: {
			name: "",
			provider: "",
			model: "",
			apiKey: "",
			description: "",
			// transformation: "",
			meta: {},
		} satisfies NewModel,
		validators: {
			onBlur: ({ value }) => {
				const required: Record<string, unknown> = {
					name: "Name",
					provider: "Provider",
					model: "Model",
					apiKey: "API Key",
					meta: {
						prompt_tokens: "Model Input Tokens Field",
						completion_tokens: "Model Completion Tokens Field",
						total_tokens: "Model Total Tokens Field",
						price: "Model Pricing",
					},
				}

				const flatten = (
					obj: Record<string, unknown>,
					prefix = "",
				): [string, string][] =>
					Object.entries(obj).flatMap(([k, v]) => {
						const path = prefix ? `${prefix}.${k}` : k
						return typeof v === "string"
							? [[path, v]]
							: flatten(v as Record<string, unknown>, path)
					})

				const getAtPath = (obj: Record<string, unknown>, path: string) =>
					path
						.split(".")
						.reduce(
							(acc: unknown, part) =>
								acc && typeof acc === "object"
									? (acc as Record<string, unknown>)[part]
									: undefined,
							obj,
						)

				const fields = flatten(required).reduce(
					(acc, [path, label]) => {
						const v = getAtPath(value as Record<string, unknown>, path)
						if (isEmpty(v)) {
							acc[path] = `${label} is required`
						}
						return acc
					},
					{} as Record<string, string>,
				)

				// Custom rule:
				// Either meta.total_tokens must be provided OR BOTH meta.prompt_tokens and meta.completion_tokens must be provided.
				const metaTotal = getAtPath(
					value as Record<string, unknown>,
					"meta.total_tokens",
				)
				const metaPrompt = getAtPath(
					value as Record<string, unknown>,
					"meta.prompt_tokens",
				)
				const metaCompletion = getAtPath(
					value as Record<string, unknown>,
					"meta.completion_tokens",
				)

				const hasTotal = !isEmpty(metaTotal)
				const hasPrompt = !isEmpty(metaPrompt)
				const hasCompletion = !isEmpty(metaCompletion)

				if (hasTotal) {
					// If total is provided, prompt/completion are optional -> remove any errors for them
					delete fields["meta.prompt_tokens"]
					delete fields["meta.completion_tokens"]
				} else {
					// If total not provided, both prompt & completion are required
					if (!hasPrompt) {
						fields["meta.prompt_tokens"] =
							"Model Input Tokens Field is required"
					}
					if (!hasCompletion) {
						fields["meta.completion_tokens"] =
							"Model Completion Tokens Field is required"
					}
				}

				return { fields }
			},
		},
		onSubmit: async ({ value }) => {
			const created = await toast
				.promise(mutation.mutateAsync(value), {
					loading: "Creating model...",
					success: "Model created successfully!",
					error: (err) => `Error: ${err.message}`,
				})
				.unwrap()

			setGeneratedUrl(`${APP_URL}/proxy/${created.id}`)

			form.reset()

			onClose()
		},
	})

	const handleCopy = () => {
		if (!generatedUrl)
			return toast.error("No URL to copy", {
				description: "Please create an model first.",
			})

		navigator.clipboard.writeText(generatedUrl)
		setCopied(true)
		toast.success("URL copied to clipboard", { duration: 2000 })

		setTimeout(() => setCopied(false), 2000)
	}

	const values = useStore(form.store, (state) => state.values)

	const providers = getProviders().map((p) => ({
		label: p.charAt(0).toUpperCase() + p.slice(1),
		value: p,
	}))

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
							className="glass-border rounded-2xl w-full max-w-4xl"
							onClick={(e) => e.stopPropagation()}
						>
							<div className="max-h-[90vh] overflow-auto rounded-2xl">
								{/* Header */}
								<div className="border-b border-border px-8 py-6 flex items-center justify-between bg-linear-to-r from-primary/10 to-secondary/10">
									<div className="flex items-center gap-3">
										<div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
											<Sparkles className="h-5 w-5 text-primary" />
										</div>
										<div>
											<h2 className="text-2xl">Create New Model</h2>
											<p className="text-sm text-muted-foreground">
												Configure your AI model proxy model
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
													label="Model Name"
													placeholder="GPT-4 Turbo"
													description="A friendly name to identify this model"
													required
													labelProps={{
														tooltip:
															"Enter a unique, descriptive name for your model to distinguish it from others.",
													}}
												/>
											)}
										</form.AppField>

										<div className="grid grid-cols-2 gap-4">
											<form.AppField name="provider">
												{(field) => (
													<field.Select
														values={providers}
														label="Provider"
														placeholder="Select AI Provider"
														description="The AI service provider (e.g., OpenAI, Anthropic)"
														triggerProps={{
															className: "max-w-[200px]",
														}}
														required
													/>
												)}
											</form.AppField>

											<form.AppField name="model">
												{(field) => (
													<field.TextField
														label="Model"
														placeholder="gpt-4-turbo"
														description="The specific model to proxy (e.g., gpt-4-turbo)"
														required
														labelProps={{
															tooltip:
																"Enter the exact model name from your provider, e.g., 'gpt-4-turbo' or 'claude-3-sonnet'.",
														}}
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
													required
													labelProps={{
														tooltip:
															"Provide your API key from the provider. It will be encrypted and stored securely for authentication.",
													}}
												/>
											)}
										</form.AppField>

										<form.AppField name="meta.price">
											{(field) => (
												<field.TextField
													label="Model Price (per 1,000 tokens)"
													placeholder="0.02"
													description="Specify the price for this model, e.g., cost per 1,000 tokens"
													required
													labelProps={{
														tooltip:
															"The price information for this model, such as cost per 1,000 tokens. This helps in tracking usage costs. This price will be considered for 1,000 tokens.",
													}}
												/>
											)}
										</form.AppField>

										{/* <form.AppField name="transformation">
											{(field) => (
												<field.TextArea
													label="Request Transformation (JSON)"
													placeholder='{ "messages": [{"role": "user", "content": "{{prompt}}"}] }'
													rows={5}
													required
													labelProps={{
														tooltip:
															"Define the JSON structure to transform incoming requests. Use {{prompt}} for user input, {{model}} for the model, etc. This maps your API to the provider's format.",
													}}
												/>
											)}
										</form.AppField>

										<form.AppField name="meta.prompt_tokens">
											{(field) => (
												<field.TextField
													label="Model Input Tokens Field"
													placeholder="usage.prompt_tokens"
													description="Specify the field name for input tokens in the usage data"
													labelProps={{
														tooltip:
															"Specify the field name for input tokens in the usage data. This helps in tracking usage costs accurately. Either this and Completion Tokens field or Total Tokens field is required.",
													}}
												/>
											)}
										</form.AppField>

										<form.AppField name="meta.completion_tokens">
											{(field) => (
												<field.TextField
													label="Model Completion Tokens Field"
													placeholder="usage.completion_tokens"
													description="Specify the field name for output tokens in the usage data"
													labelProps={{
														tooltip:
															"Specify the field name for output tokens in the usage data. This helps in tracking usage costs accurately. Either this and Input Tokens field or Total Tokens field is required.",
													}}
												/>
											)}
										</form.AppField>

										<form.AppField name="meta.total_tokens">
											{(field) => (
												<field.TextField
													label="Model Total Tokens Field"
													placeholder="usage.total_tokens"
													description="Specify the field name for total tokens in the usage data"
													labelProps={{
														tooltip:
															"Specify the field name for total tokens in the usage data. This helps in tracking usage costs accurately. Either this field or both Input and Completion Tokens fields are required.",
													}}
												/>
											)}
										</form.AppField> */}

										<form.AppField name="description">
											{(field) => (
												<field.TextArea
													label="Description"
													placeholder="Add notes about this model..."
													rows={3}
												/>
											)}
										</form.AppField>

										<div className="flex gap-3 pt-4">
											<form.AppForm>
												<form.SubscribeButton
													label="Create Model"
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
														Model Name
													</div>
													<div className="text-sm">
														{values.name || "Your Model"}
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
							</div>
						</motion.div>
					</div>
				</React.Fragment>
			)}
		</AnimatePresence>
	)
}
