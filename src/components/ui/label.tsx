"use client"

import * as LabelPrimitive from "@radix-ui/react-label"
import { CircleQuestionMark } from "lucide-react"
import * as React from "react"

import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip"

import { cn } from "@/lib/utils"

type LabelProps = React.ComponentProps<typeof LabelPrimitive.Root> & {
	tooltip?: string
}

function Label({ className, tooltip, ...props }: LabelProps) {
	const Container = tooltip ? "div" : React.Fragment

	return (
		<Container className="flex items-center gap-2">
			<LabelPrimitive.Root
				data-slot="label"
				className={cn(
					"flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
					className,
				)}
				{...props}
			/>

			<React.Activity mode={tooltip ? "visible" : "hidden"}>
				<Tooltip>
					<TooltipTrigger>
						<CircleQuestionMark className="w-4 h-4" />
					</TooltipTrigger>
					<TooltipContent>{tooltip}</TooltipContent>
				</Tooltip>
			</React.Activity>
		</Container>
	)
}

export { Label, type LabelProps }
