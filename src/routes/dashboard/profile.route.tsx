import { useMutation, useQuery } from "@tanstack/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { Calendar, Edit2, Mail, MapPin, User } from "lucide-react"
import { motion } from "motion/react"
import { Activity } from "react"
import { toast } from "sonner"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"

import { useAppForm } from "@/hooks/use-form"

import { useTRPC } from "@/integrations/trpc/react"

import { isEmpty } from "@/lib/utils"

import type { User as IUser } from "@/types"

type UpdateUser = Omit<
	IUser,
	"id" | "emailVerified" | "createdAt" | "updatedAt"
>

export const Route = createFileRoute("/dashboard/profile")({
	beforeLoad: ({ context }) => {
		context.queryClient.ensureQueryData(context.trpc.profile.get.queryOptions())
	},
	component: RouteComponent,
})

function RouteComponent() {
	const trpc = useTRPC()
	const { data: profile, isLoading } = useQuery(trpc.profile.get.queryOptions())

	const mutation = useMutation(trpc.profile.update.mutationOptions())

	const form = useAppForm({
		defaultValues: {
			name: profile?.name || "",
			email: profile?.email || "",
			bio: profile?.bio || "",
			location: profile?.location || "",
			website: profile?.website || "",
			image: profile?.image || "",
		} satisfies UpdateUser,
		// validators: {
		// 	onBlur: ({ value }) => {
		// 		const required: Record<string, unknown> = {
		// 			name: "Full Name",
		// 			email: "Email Address",
		// 		}

		// 		const flatten = (
		// 			obj: Record<string, unknown>,
		// 			prefix = "",
		// 		): [string, string][] =>
		// 			Object.entries(obj).flatMap(([k, v]) => {
		// 				const path = prefix ? `${prefix}.${k}` : k
		// 				return typeof v === "string"
		// 					? [[path, v]]
		// 					: flatten(v as Record<string, unknown>, path)
		// 			})

		// 		const getAtPath = (obj: Record<string, unknown>, path: string) =>
		// 			path
		// 				.split(".")
		// 				.reduce(
		// 					(acc: unknown, part) =>
		// 						acc && typeof acc === "object"
		// 							? (acc as Record<string, unknown>)[part]
		// 							: undefined,
		// 					obj,
		// 				)

		// 		const fields = flatten(required).reduce(
		// 			(acc, [path, label]) => {
		// 				const v = getAtPath(value as Record<string, unknown>, path)
		// 				if (isEmpty(v)) {
		// 					acc[path] = `${label} is required`
		// 				}
		// 				return acc
		// 			},
		// 			{} as Record<string, string>,
		// 		)

		// 		return { fields }
		// 	},
		// },
		onSubmit: async ({ value }) => {
			toast.promise(mutation.mutateAsync(value), {
				loading: "Updating profile...",
				success: "Profile updated successfully!",
				error: (err) => `Error: ${err.message}`,
			})
		},
	})

	if (!isLoading && !profile) {
		return <div className="p-8">Profile not found.</div>
	}

	if (!profile || isLoading) {
		return <div className="p-8">Loading profile...</div>
	}

	const handleSubmit = (data: {
		name: string
		email: string
		bio: string
		location: string
		website: string
		image: string
	}) => {}

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
									<AvatarImage src={profile.image ?? undefined} />
									<AvatarFallback className="bg-primary text-primary-foreground text-3xl">
										{(profile.name
											? profile.name
													.split(" ")
													.map((n) => n[0])
													.join("")
											: "U"
										).toUpperCase()}
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
								<h2 className="text-2xl mb-2">{profile.name}</h2>
								<p className="text-muted-foreground mb-4">
									{profile.bio || "No bio available."}
								</p>

								<div className="grid grid-cols-2 gap-4">
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<Mail className="h-4 w-4" />
										{profile.email}
									</div>
									<Activity mode={profile.location ? "visible" : "hidden"}>
										<div className="flex items-center gap-2 text-sm text-muted-foreground">
											<MapPin className="h-4 w-4" />
											{profile.location}
										</div>
									</Activity>
									<div className="flex items-center gap-2 text-sm text-muted-foreground">
										<Calendar className="h-4 w-4" />
										Joined{" "}
										{new Date(profile.createdAt).toLocaleDateString("en-US", {
											year: "numeric",
											month: "long",
											day: "numeric",
										})}
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
							<div className="space-y-2">
								<Label htmlFor="name">Full Name</Label>
								<Input
									id="name"
									defaultValue={profile.name}
									className="bg-background/40 border-border"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="email">Email Address</Label>
								<Input
									id="email"
									type="email"
									defaultValue={profile.email}
									className="bg-background/40 border-border"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="bio">Bio</Label>
								<textarea
									id="bio"
									rows={4}
									defaultValue={profile.bio || ""}
									className="w-full px-3 py-2 bg-background/40 border border-border rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="location">Location</Label>
								<Input
									id="location"
									defaultValue={profile.location || ""}
									className="bg-background/40 border-border"
								/>
							</div>

							<div className="space-y-2">
								<Label htmlFor="website">Website</Label>
								<Input
									id="website"
									placeholder={profile.website || ""}
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
									Active Models
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
