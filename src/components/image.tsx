import {
	Image as UnpicImage,
	type ImageProps as UnpicImageProps,
} from "@unpic/react";
import React, { useState } from "react";

import { cn } from "@/lib/utils";

interface ImageProps {
	fallbackSrc?: string;
	objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

export function Image({
	src,
	sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
	priority = false,
	className,
	objectFit = "cover",
	onLoad,
	...props
}: ImageProps & UnpicImageProps) {
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState(false);

	const showSkeleton = !src || error;

	return (
		<div className={cn("relative overflow-hidden", className)}>
			{showSkeleton ? (
				<div className="w-full h-full bg-gray-100 animate-pulse" aria-hidden />
			) : (
				<React.Fragment>
					<UnpicImage
						src={src}
						{...props}
						// priority={priority}
						loading={priority ? "eager" : "lazy"}
						className={cn(
							"transition-opacity duration-300",
							isLoading ? "opacity-0" : "opacity-100",
							`object-${objectFit}`,
						)}
						onLoadedData={(e) => {
							console.log("image loaded: ", src);
							setIsLoading(false);
							onLoad?.(e);
						}}
						// onLoad={(e) => {
						// 	console.log("image loaded:", src);
						// 	setIsLoading(false);
						// 	onLoad?.(e);
						// }}
						onError={(err) => {
							console.log(`error loading image: ${src}\n${err}`);
							setError(true);
						}}
					/>

					{isLoading && (
						<div className="absolute inset-0 bg-gray-100 animate-pulse" />
					)}
				</React.Fragment>
			)}
		</div>
	);
}
