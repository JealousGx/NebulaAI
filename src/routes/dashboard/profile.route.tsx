import { createFileRoute } from "@tanstack/react-router"
import { Calendar, Edit2, Mail, MapPin, User } from "lucide-react"
import { motion } from "motion/react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

export const Route = createFileRoute("/dashboard/profile")({
	component: RouteComponent,
})

function RouteComponent() {
	return (
		<div>
			<motion.header
				initial={{ opacity: 0, y: -20 }}
				animate={{ opacity: 1, y: 0 }}
				className="sticky top-0 z-30 glass border-b border-border px-8 py-4"
			>
				<div className="flex items-center gap-3">
					<User className="h-6 w-6 text-primary" />
					<div>
						<h1 className="text-2xl">Profile</h1>
						<p className="text-sm text-muted-foreground">
							Manage your personal information
						</p>
					</div>
				</div>
			</motion.header>

			<main className="p-8">
				<div className="max-w-4xl mx-auto space-y-6">
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.2 }}
						className="glass rounded-xl p-8"
					>
						<div className="flex items-start gap-8">
							<div className="relative">
								<Avatar className="h-32 w-32">
									<AvatarImage src="https://github.com/shadcn.png" />
									<AvatarFallback className="bg-primary text-primary-foreground text-3xl">
										JD
									</AvatarFallback>
								</Avatar>
								<Button
									size="sm"
									className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-primary text-primary-foreground"
								>
									<Edit2 className="h-4 w-4" />
								</Button>
							</div>

							<div className="flex-1">
								<h2 className="text-2xl mb-2">John Doe</h2>
								<p className="text-muted-foreground mb-4">
									Full-stack developer & AI enthusiast
								</p>

								<div className="grid grid-cols-2 gap-4">
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<Mail className="h-4 w-4" />
										john@example.com
									</div>
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<MapPin className="h-4 w-4" />
										San Francisco, CA
									</div>
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<Calendar className="h-4 w-4" />
										Joined Oct 2024
									</div>
								</div>
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.3 }}
						className="glass rounded-xl p-8"
					>
						<h3 className="text-xl mb-6">Personal Information</h3>

						<div className="space-y-6">
							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<Label htmlFor="first-name">First Name</Label>
									<Input
										id="first-name"
										defaultValue="John"
										className="bg-background/40 border-border"
									/>
								</div>
								<div className="space-y-2">
									<Label htmlFor="last-name">Last Name</Label>
									<Input
										id="last-name"
										defaultValue="Doe"
										className="bg-background/40 border-border"
									/>
								</div>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email Address</Label>
								<Input
									id="email"
									type="email"
									defaultValue="john@example.com"
									className="bg-background/40 border-border"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="bio">Bio</Label>
								<textarea
									id="bio"
									rows={4}
									defaultValue="Full-stack developer with a passion for AI and machine learning. Building the future, one API call at a time."
									className="w-full px-3 py-2 bg-background/40 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="location">Location</Label>
								<Input
									id="location"
									defaultValue="San Francisco, CA"
									className="bg-background/40 border-border"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="website">Website</Label>
								<Input
									id="website"
									placeholder="https://yourwebsite.com"
									className="bg-background/40 border-border"
								/>
							</div>

							<Separator className="bg-border" />

							<div className="flex justify-end gap-3">
								<Button variant="outline" className="glass border-border">
									Cancel
								</Button>
								<Button className="bg-primary text-primary-foreground">
									Save Changes
								</Button>
							</div>
						</div>
					</motion.div>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.4 }}
						className="glass rounded-xl p-8"
					>
						<h3 className="text-xl mb-6">Usage Statistics</h3>

						<div className="grid grid-cols-3 gap-4">
							<div className="p-4 rounded-lg bg-background/40 border border-border text-center">
								<div className="text-3xl mb-2 text-primary">24,891</div>
								<div className="text-sm text-muted-foreground">
									Total Requests
								</div>
							</div>

							<div className="p-4 rounded-lg bg-background/40 border border-border text-center">
								<div className="text-3xl mb-2 text-chart-2">8</div>
								<div className="text-sm text-muted-foreground">
									Active Endpoints
								</div>
							</div>

							<div className="p-4 rounded-lg bg-background/40 border border-border text-center">
								<div className="text-3xl mb-2 text-chart-3">98.7%</div>
								<div className="text-sm text-muted-foreground">
									Success Rate
								</div>
							</div>
						</div>
					</motion.div>
				</div>
			</main>
		</div>
	)
}
