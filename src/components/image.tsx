import {
	Image as UnpicImage,
	type ImageProps as UnpicImageProps,
} from "@unpic/react";
import { useState } from "react";

import { cn } from "@/lib/utils";

interface ImageProps {
	fallbackSrc?: string;
	objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

const objectFitClasses: Record<NonNullable<ImageProps["objectFit"]>, string> = {
	contain: "object-contain",
	cover: "object-cover",
	fill: "object-fill",
	none: "object-none",
	"scale-down": "object-scale-down",
};

export function Image({
	src,
	sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
	priority = false,
	className,
	objectFit = "cover",
	onLoad,
	...props
}: ImageProps & UnpicImageProps) {
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(false);

	const showSkeleton = !src || error || isLoading;

	return (
		<div className={cn("relative overflow-hidden", className)}>
			{showSkeleton ? (
				<div className="w-full h-full bg-gray-100 animate-pulse" aria-hidden />
			) : (
				<UnpicImage
					src={src}
					{...props}
					priority={priority}
					loading={priority ? "eager" : "lazy"}
					className={cn(
						"transition-opacity duration-300",
						isLoading ? "opacity-0" : "opacity-100",
						`${objectFitClasses[objectFit]}`,
					)}
					onLoad={(e) => {
						setIsLoading(false);
						onLoad?.(e);
					}}
					onError={(err) => {
						console.log(`error loading image: ${src}\n${err}`);
						setError(true);
					}}
				/>
			)}
		</div>
	);
}
