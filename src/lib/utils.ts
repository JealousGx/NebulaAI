import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const isEmpty = (v: unknown) =>
	v === undefined || v === null || String(v).trim().length === 0
