import { Check, Copy, Sparkles, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface CreateEndpointModalProps {
	isOpen: boolean;
	onClose: () => void;
}

export function CreateEndpointModal({
	isOpen,
	onClose,
}: CreateEndpointModalProps) {
	const [endpointName, setEndpointName] = useState("");
	const [provider, setProvider] = useState("openai");
	const [model, setModel] = useState("");
	const [apiKey, setApiKey] = useState("");
	const [copied, setCopied] = useState(false);

	const generatedUrl = `https://api.nebula-ai.dev/proxy/${endpointName.toLowerCase().replace(/\s+/g, "-") || "your-endpoint"}`;

	const handleCopy = () => {
		navigator.clipboard.writeText(generatedUrl);
		setCopied(true);
		setTimeout(() => setCopied(false), 2000);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		// Handle form submission
		onClose();
	};

	return (
		<AnimatePresence>
			{isOpen && (
				<>
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
								<form onSubmit={handleSubmit} className="p-8 space-y-6">
									<div className="space-y-2">
										<Label htmlFor="endpoint-name">Endpoint Name</Label>
										<Input
											id="endpoint-name"
											placeholder="e.g., GPT-4 Turbo"
											value={endpointName}
											onChange={(e) => setEndpointName(e.target.value)}
											className="bg-background/40 border-border"
											required
										/>
										<p className="text-xs text-muted-foreground">
											A friendly name to identify this endpoint
										</p>
									</div>

									<div className="grid grid-cols-2 gap-4">
										<div className="space-y-2">
											<Label htmlFor="provider">Provider</Label>
											<Select value={provider} onValueChange={setProvider}>
												<SelectTrigger className="bg-background/40 border-border">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="openai">OpenAI</SelectItem>
													<SelectItem value="anthropic">Anthropic</SelectItem>
													<SelectItem value="replicate">Replicate</SelectItem>
													<SelectItem value="huggingface">
														Hugging Face
													</SelectItem>
													<SelectItem value="cohere">Cohere</SelectItem>
												</SelectContent>
											</Select>
										</div>

										<div className="space-y-2">
											<Label htmlFor="model">Model</Label>
											<Input
												id="model"
												placeholder="e.g., gpt-4-turbo"
												value={model}
												onChange={(e) => setModel(e.target.value)}
												className="bg-background/40 border-border"
												required
											/>
										</div>
									</div>

									<div className="space-y-2">
										<Label htmlFor="api-key">API Key</Label>
										<Input
											id="api-key"
											type="password"
											placeholder="sk-..."
											value={apiKey}
											onChange={(e) => setApiKey(e.target.value)}
											className="bg-background/40 border-border font-mono"
											required
										/>
										<p className="text-xs text-muted-foreground">
											Your API key will be encrypted and stored securely
										</p>
									</div>

									<div className="space-y-2">
										<Label htmlFor="description">Description (Optional)</Label>
										<Textarea
											id="description"
											placeholder="Add notes about this endpoint..."
											className="bg-background/40 border-border resize-none"
											rows={3}
										/>
									</div>

									<div className="flex gap-3 pt-4">
										<Button
											type="submit"
											className="bg-primary text-primary-foreground hover:shadow-lg transition-all"
										>
											Create Endpoint
										</Button>
										<Button
											type="button"
											variant="outline"
											onClick={onClose}
											className="glass border-border"
										>
											Cancel
										</Button>
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
													{endpointName || "Your Endpoint"}
												</div>
											</div>

											<div>
												<div className="text-xs text-muted-foreground mb-2">
													Provider
												</div>
												<div className="flex items-center gap-2">
													<div className="w-6 h-6 rounded bg-primary/20 flex items-center justify-center">
														<span className="text-xs">
															{provider.charAt(0).toUpperCase()}
														</span>
													</div>
													<span className="text-sm capitalize">{provider}</span>
												</div>
											</div>

											<div>
												<div className="text-xs text-muted-foreground mb-2">
													Model
												</div>
												<div className="text-sm font-mono">
													{model || "Not specified"}
												</div>
											</div>

											<div className="pt-4 border-t border-border">
												<div className="text-xs text-muted-foreground mb-2">
													Generated URL
												</div>
												<div className="flex items-center gap-2">
													<code className="flex-1 text-xs bg-background/40 px-3 py-2 rounded border border-border truncate">
														{generatedUrl}
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
				</>
			)}
		</AnimatePresence>
	);
}
