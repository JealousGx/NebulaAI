import { ArrowRight, Check, Mail, Shield, Sparkles, X } from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import React, { useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

interface AuthModalProps {
	isOpen: boolean
	onClose: () => void
	onSuccess: () => void
}

type AuthStep = "email" | "code" | "success"

export function AuthModal({ isOpen, onClose, onSuccess }: AuthModalProps) {
	const [step, setStep] = useState<AuthStep>("email")
	const [email, setEmail] = useState("")
	const [code, setCode] = useState("")
	const [isLoading, setIsLoading] = useState(false)
	const [generatedCode, setGeneratedCode] = useState("")

	const handleEmailSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!email || !email.includes("@")) {
			toast.error("Please enter a valid email address")
			return
		}

		setIsLoading(true)

		// Simulate sending email
		const mockCode = Math.floor(100000 + Math.random() * 900000).toString()
		setGeneratedCode(mockCode)

		setTimeout(() => {
			setIsLoading(false)
			setStep("code")
			toast.success("Code sent!", {
				description: `Check your email at ${email}. (Demo code: ${mockCode})`,
				duration: 10000,
			})
		}, 1500)
	}

	const handleCodeSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		if (!code || code.length !== 6) {
			toast.error("Please enter the 6-digit code")
			return
		}

		setIsLoading(true)

		setTimeout(() => {
			if (code === generatedCode) {
				setStep("success")
				setIsLoading(false)

				setTimeout(() => {
					onSuccess()
				}, 2000)
			} else {
				setIsLoading(false)
				toast.error("Invalid code", {
					description: "Please check the code and try again",
				})
			}
		}, 1000)
	}

	const handleClose = () => {
		setStep("email")
		setEmail("")
		setCode("")
		setGeneratedCode("")
		onClose()
	}

	if (!isOpen) return null

	return (
		<AnimatePresence>
			{isOpen && (
				<React.Fragment>
					{/* Backdrop */}
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						onClick={handleClose}
						className="fixed inset-0 bg-background/80 backdrop-blur-md z-50"
					/>

					{/* Modal */}
					<div className="fixed inset-0 z-50 flex items-center justify-center p-4">
						<motion.div
							initial={{ opacity: 0, scale: 0.95, y: 20 }}
							animate={{ opacity: 1, scale: 1, y: 0 }}
							exit={{ opacity: 0, scale: 0.95, y: 20 }}
							transition={{ duration: 0.2 }}
							className="w-full max-w-md"
						>
							<div className="glass-border rounded-2xl overflow-hidden relative">
								{/* Animated background */}
								<div className="absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-chart-2/10 opacity-50" />

								{/* Close button */}
								<button
									type="button"
									onClick={handleClose}
									className="absolute top-4 right-4 z-10 w-8 h-8 rounded-lg hover:bg-accent transition-colors flex items-center justify-center group"
								>
									<X className="h-4 w-4 group-hover:rotate-90 transition-transform duration-300" />
								</button>

								<div className="relative p-6 md:p-8">
									{/* Header */}
									<div className="flex items-center gap-3 mb-6">
										<div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
											<Shield className="h-6 w-6 text-primary" />
										</div>
										<div>
											<h2 className="text-2xl">
												{step === "email" && "Welcome to Nebula AI"}
												{step === "code" && "Check your email"}
												{step === "success" && "You're all set!"}
											</h2>
											<p className="text-sm text-muted-foreground">
												{step === "email" && "Sign in to continue"}
												{step === "code" && "Enter the code we sent you"}
												{step === "success" && "Redirecting to dashboard..."}
											</p>
										</div>
									</div>

									{/* Email Step */}
									{step === "email" && (
										<motion.form
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: 20 }}
											onSubmit={handleEmailSubmit}
											className="space-y-4"
										>
											<div>
												<label
													htmlFor="email"
													className="text-sm text-muted-foreground mb-2 block"
												>
													Email Address
												</label>
												<div className="relative">
													<Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
													<input
														id="email"
														type="email"
														value={email}
														onChange={(e) => setEmail(e.target.value)}
														placeholder="you@example.com"
														className="w-full pl-10 pr-4 py-3 rounded-lg glass border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-sm"
														disabled={isLoading}
													/>
												</div>
											</div>

											<Button
												type="submit"
												className="w-full bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all group"
												disabled={isLoading}
											>
												{isLoading ? (
													<div className="flex items-center gap-2">
														<div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
														Sending code...
													</div>
												) : (
													<>
														Continue with Email
														<ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
													</>
												)}
											</Button>

											<div className="text-center text-xs text-muted-foreground">
												By continuing, you agree to our Terms of Service and
												Privacy Policy
											</div>
										</motion.form>
									)}

									{/* Code Step */}
									{step === "code" && (
										<motion.form
											initial={{ opacity: 0, x: -20 }}
											animate={{ opacity: 1, x: 0 }}
											exit={{ opacity: 0, x: 20 }}
											onSubmit={handleCodeSubmit}
											className="space-y-4"
										>
											<div className="p-4 rounded-lg bg-primary/5 border border-primary/20 mb-6">
												<div className="flex items-start gap-3">
													<Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
													<div className="text-sm">
														<p className="text-foreground mb-1">
															We've sent a 6-digit code to
														</p>
														<p className="text-primary font-medium">{email}</p>
													</div>
												</div>
											</div>

											<div>
												<label
													htmlFor="code"
													className="text-sm text-muted-foreground mb-2 block"
												>
													Verification Code
												</label>
												<input
													id="code"
													type="text"
													value={code}
													onChange={(e) =>
														setCode(
															e.target.value.replace(/\D/g, "").slice(0, 6),
														)
													}
													placeholder="000000"
													className="w-full px-4 py-3 rounded-lg glass border border-border focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all text-center text-2xl tracking-widest"
													disabled={isLoading}
													maxLength={6}
												/>
											</div>

											<Button
												type="submit"
												className="w-full bg-primary text-primary-foreground hover:shadow-lg hover:shadow-primary/20 transition-all"
												disabled={isLoading || code.length !== 6}
											>
												{isLoading ? (
													<div className="flex items-center gap-2">
														<div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
														Verifying...
													</div>
												) : (
													"Verify & Continue"
												)}
											</Button>

											<button
												type="button"
												onClick={() => setStep("email")}
												className="w-full text-sm text-muted-foreground hover:text-foreground transition-colors"
												disabled={isLoading}
											>
												Use a different email
											</button>
										</motion.form>
									)}

									{/* Success Step */}
									{step === "success" && (
										<motion.div
											initial={{ opacity: 0, scale: 0.9 }}
											animate={{ opacity: 1, scale: 1 }}
											className="py-8 text-center"
										>
											<motion.div
												initial={{ scale: 0 }}
												animate={{ scale: 1 }}
												transition={{
													delay: 0.2,
													type: "spring",
													stiffness: 200,
												}}
												className="w-16 h-16 rounded-full bg-chart-2/20 flex items-center justify-center mx-auto mb-4"
											>
												<Check className="h-8 w-8 text-chart-2" />
											</motion.div>
											<h3 className="text-xl mb-2">Successfully verified!</h3>
											<p className="text-sm text-muted-foreground">
												Taking you to your dashboard...
											</p>
										</motion.div>
									)}
								</div>
							</div>
						</motion.div>
					</div>
				</React.Fragment>
			)}
		</AnimatePresence>
	)
}
