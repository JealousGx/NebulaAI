import {
	Image as UnpicImage,
	type ImageProps as UnpicImageProps,
} from "@unpic/react";
import React, { useState } from "react";

import { cn } from "@/lib/utils";

interface ImageProps {
	src: string;
	alt: string;
	fill?: boolean;
	sizes?: string;
	priority?: boolean;
	quality?: number;
	className?: string;
	fallbackSrc?: string;
	objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
	onLoad?: () => void;
}

export function Image({
	src,
	alt,
	fill = false,
	sizes = "(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw",
	priority = false,
	quality = 80,
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
						alt={alt}
						priority={priority}
						loading={priority ? "eager" : "lazy"}
						className={cn(
							"transition-opacity duration-300",
							isLoading ? "opacity-0" : "opacity-100",
							`object-${objectFit}`,
						)}
						onLoad={() => {
							setIsLoading(false);
							onLoad?.();
						}}
						onError={() => setError(true)}
						{...props}
					/>

					{isLoading && (
						<div className="absolute inset-0 bg-gray-100 animate-pulse" />
					)}
				</React.Fragment>
			)}
		</div>
	);
}
