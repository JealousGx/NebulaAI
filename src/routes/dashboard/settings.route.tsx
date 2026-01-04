import { createFileRoute } from "@tanstack/react-router"
import { Key, Settings } from "lucide-react"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const Route = createFileRoute("/dashboard/settings")({
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
					<Settings className="h-6 w-6 text-primary" />
					<div>
						<h1 className="text-2xl">Settings</h1>
						<p className="text-sm text-muted-foreground">
							Manage your account and preferences
						</p>
					</div>
				</div>
			</motion.header>

			<main className="p-8">
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2 }}
				>
					<Tabs defaultValue="general" className="space-y-6">
						<TabsList className="glass border border-border">
							<TabsTrigger value="general">General</TabsTrigger>
							<TabsTrigger value="security">Security</TabsTrigger>
							<TabsTrigger value="notifications">Notifications</TabsTrigger>
							<TabsTrigger value="api">API Keys</TabsTrigger>
							{/* <TabsTrigger value="billing">Billing</TabsTrigger> */}
						</TabsList>

						<TabsContent value="general">
							<div className="glass rounded-xl p-8">
								<h2 className="text-xl mb-6">General Settings</h2>

								<div className="space-y-6">
									<div className="space-y-2">
										<Label htmlFor="workspace-name">Workspace Name</Label>
										<Input
											id="workspace-name"
											defaultValue="My Workspace"
											className="bg-background/40 border-border"
										/>
										<p className="text-sm text-muted-foreground">
											This is your workspace's visible name
										</p>
									</div>

									<Separator className="bg-border" />

									<div className="space-y-2">
										<Label htmlFor="webhook-url">
											Webhook URL (Optional. not implemented yet!)
										</Label>
										<Input
											id="webhook-url"
											placeholder="https://your-app.com/webhooks/nebula"
											className="bg-background/40 border-border"
										/>
										<p className="text-sm text-muted-foreground">
											Receive real-time notifications about API usage
										</p>
									</div>

									<Separator className="bg-border" />

									<div className="flex items-center justify-between">
										<div className="space-y-1">
											<Label>Auto-Delete Old Logs</Label>
											<p className="text-sm text-muted-foreground">
												Automatically delete logs older than 30 days
											</p>
										</div>
										<Switch defaultChecked />
									</div>

									<div className="flex items-center justify-between">
										<div className="space-y-1">
											<Label>Enable Caching</Label>
											<p className="text-sm text-muted-foreground">
												Cache responses to reduce costs and improve speed
											</p>
										</div>
										<Switch />
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
							</div>
						</TabsContent>

						<TabsContent value="security">
							<div className="glass rounded-xl p-8">
								<h2 className="text-xl mb-6">Security Settings</h2>

								<div className="space-y-6">
									{/* <div className="space-y-2">
										<Label htmlFor="current-password">Current Password</Label>
										<Input
											id="current-password"
											type="password"
											className="bg-background/40 border-border"
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="new-password">New Password</Label>
										<Input
											id="new-password"
											type="password"
											className="bg-background/40 border-border"
										/>
									</div>

									<div className="space-y-2">
										<Label htmlFor="confirm-password">
											Confirm New Password
										</Label>
										<Input
											id="confirm-password"
											type="password"
											className="bg-background/40 border-border"
										/>
									</div>

									<Separator className="bg-border" /> */}

									<div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20">
										<h3 className="text-sm mb-2 text-destructive">
											Danger Zone
										</h3>
										<p className="text-sm text-muted-foreground mb-4">
											Once you delete your account, there is no going back.
											Please be certain.
										</p>
										<Button variant="destructive" size="sm">
											Delete Account
										</Button>
									</div>

									<div className="flex justify-end gap-3">
										<Button variant="outline" className="glass border-border">
											Cancel
										</Button>
										<Button className="bg-primary text-primary-foreground">
											Update Password
										</Button>
									</div>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="notifications">
							<div className="glass rounded-xl p-8">
								<h2 className="text-xl mb-6">Notification Preferences</h2>

								<div className="space-y-6">
									<div className="flex items-center justify-between">
										<div className="space-y-1">
											<Label>Email Notifications</Label>
											<p className="text-sm text-muted-foreground">
												Receive email updates about your API usage
											</p>
										</div>
										<Switch defaultChecked />
									</div>

									<div className="flex items-center justify-between">
										<div className="space-y-1">
											<Label>Cost Limit Alerts</Label>
											<p className="text-sm text-muted-foreground">
												Get notified when you reach 80% of your cost limit
											</p>
										</div>
										<Switch defaultChecked />
									</div>

									<div className="flex items-center justify-between">
										<div className="space-y-1">
											<Label>Error Rate Alerts</Label>
											<p className="text-sm text-muted-foreground">
												Get notified when error rate exceeds 5%
											</p>
										</div>
										<Switch defaultChecked />
									</div>

									<div className="flex items-center justify-between">
										<div className="space-y-1">
											<Label>Weekly Reports</Label>
											<p className="text-sm text-muted-foreground">
												Receive weekly summary of your API usage
											</p>
										</div>
										<Switch />
									</div>

									<Separator className="bg-border" />

									<div className="flex justify-end gap-3">
										<Button variant="outline" className="glass border-border">
											Cancel
										</Button>
										<Button className="bg-primary text-primary-foreground">
											Save Preferences
										</Button>
									</div>
								</div>
							</div>
						</TabsContent>

						<TabsContent value="api">
							<div className="glass rounded-xl p-8">
								<div className="flex items-center justify-between mb-6">
									<h2 className="text-xl">API Keys</h2>
									<Button className="bg-primary text-primary-foreground">
										<Key className="h-4 w-4 mr-2" />
										Generate New Key
									</Button>
								</div>

								<div className="space-y-4">
									{[
										{
											name: "Production Key",
											key: "nbla_pk_••••••••••••••••",
											created: "2 months ago",
										},
										{
											name: "Development Key",
											key: "nbla_dk_••••••••••••••••",
											created: "1 week ago",
										},
									].map((apiKey) => (
										<div
											key={apiKey.key}
											className="p-4 rounded-lg bg-background/40 border border-border flex items-center justify-between"
										>
											<div>
												<div className="mb-1">{apiKey.name}</div>
												<div className="text-sm text-muted-foreground">
													{apiKey.key}
												</div>
												<div className="text-xs text-muted-foreground mt-1">
													Created {apiKey.created}
												</div>
											</div>
											<div className="flex gap-2">
												<Button
													variant="outline"
													size="sm"
													className="glass border-border"
												>
													Revoke
												</Button>
											</div>
										</div>
									))}
								</div>
							</div>
						</TabsContent>

						{/* <TabsContent value="billing">
							<div className="glass rounded-xl p-8">
								<h2 className="text-xl mb-6">Billing & Usage</h2>

								<div className="space-y-6">
									<div className="grid grid-cols-3 gap-4">
										<div className="p-4 rounded-lg bg-background/40 border border-border">
											<div className="text-sm text-muted-foreground mb-1">
												Current Plan
											</div>
											<div className="text-2xl mb-1">Free</div>
											<p className="text-xs text-muted-foreground">
												10,000 requests/month
											</p>
										</div>

										<div className="p-4 rounded-lg bg-background/40 border border-border">
											<div className="text-sm text-muted-foreground mb-1">
												This Month
											</div>
											<div className="text-2xl mb-1">$147.23</div>
											<p className="text-xs text-muted-foreground">
												24,891 requests
											</p>
										</div>

										<div className="p-4 rounded-lg bg-background/40 border border-border">
											<div className="text-sm text-muted-foreground mb-1">
												Credits Remaining
											</div>
											<div className="text-2xl mb-1">2,847</div>
											<p className="text-xs text-muted-foreground">
												Expires in 28 days
											</p>
										</div>
									</div>

									<Separator className="bg-border" />

									<div>
										<h3 className="mb-4">Recent Invoices</h3>
										<div className="space-y-2">
											{[
												{
													date: "Dec 1, 2024",
													amount: "$147.23",
													status: "Paid",
												},
												{
													date: "Nov 1, 2024",
													amount: "$132.45",
													status: "Paid",
												},
												{
													date: "Oct 1, 2024",
													amount: "$156.78",
													status: "Paid",
												},
											].map((invoice) => (
												<div
													key={invoice.date}
													className="p-4 rounded-lg bg-background/40 border border-border flex items-center justify-between"
												>
													<div className="flex items-center gap-4">
														<div className="text-sm">{invoice.date}</div>
														<div className="text-sm text-muted-foreground">
															{invoice.amount}
														</div>
														<div className="text-xs bg-chart-2/20 text-chart-2 px-2 py-1 rounded">
															{invoice.status}
														</div>
													</div>
													<Button variant="ghost" size="sm">
														Download
													</Button>
												</div>
											))}
										</div>
									</div>

									<Separator className="bg-border" />

									<Button className="bg-primary text-primary-foreground">
										<Zap className="h-4 w-4 mr-2" />
										Upgrade to Pro
									</Button>
								</div>
							</div>
						</TabsContent> */}
					</Tabs>
				</motion.div>
			</main>
		</div>
	)
}
