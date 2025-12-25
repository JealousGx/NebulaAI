import { Link } from "@tanstack/react-router";
import { LogOut, Settings, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function UserProfileDropdown() {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className="focus:outline-none w-full">
				<div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors cursor-pointer">
					<Avatar className="h-8 w-8">
						<AvatarImage src="https://github.com/shadcn.png" />
						<AvatarFallback className="bg-primary text-primary-foreground">
							JD
						</AvatarFallback>
					</Avatar>
					<div className="text-left">
						<div className="text-sm">John Doe</div>
						<div className="text-xs text-muted-foreground">
							john@example.com
						</div>
					</div>
				</div>
			</DropdownMenuTrigger>
			<DropdownMenuContent
				className="w-56 glass border-border"
				side="top"
				align="end"
			>
				<DropdownMenuLabel>My Account</DropdownMenuLabel>
				<DropdownMenuSeparator className="bg-border" />
				<DropdownMenuItem asChild>
					<Link to="/dashboard/profile">
						<User className="mr-2 h-4 w-4" />
						<span>Profile</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuItem asChild>
					<Link to="/dashboard/settings">
						<Settings className="mr-2 h-4 w-4" />
						<span>Settings</span>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator className="bg-border" />
				<DropdownMenuItem className="cursor-pointer text-destructive">
					<LogOut className="mr-2 h-4 w-4" />
					<span>Log out</span>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
