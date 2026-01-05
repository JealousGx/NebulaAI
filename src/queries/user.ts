import { getUser } from "@/lib/auth/functions"

export const userQueryOptions = {
	queryKey: ["auth", "getUser"],
	queryFn: getUser,
}
