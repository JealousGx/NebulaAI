import { Image } from "@/components/image";
import { cn } from "@/lib/utils";

interface LogoProps {
	className?: string;
	alt?: string;
	useWebp?: boolean;
	priority?: boolean;
	objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
}

export function Logo({
	className,
	alt = "Nebula AI",
	useWebp = true,
	priority = true,
	objectFit = "contain",
}: LogoProps) {
	const src = useWebp ? "/logo/logo.webp" : "/logo/logo.svg";

	return (
		<div className={cn("w-full h-full relative", className)}>
			<Image
				src={src}
				alt={alt}
				fill
				layout="fullWidth"
				priority={priority}
				objectFit={objectFit}
				className="w-full h-full"
			/>
		</div>
	);
}
