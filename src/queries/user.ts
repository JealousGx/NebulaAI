import { getUser } from "@/lib/auth/functions"

export const userQueryOptions = {
	queryKey: ["getUser"],
	getOne: getUser,
}
