interface ModelMeta {
	prompt_tokens: number
	completion_tokens: number
	total_tokens: number
	price: string
}

export function calculateCost(modelMeta: ModelMeta): number {
	if (!modelMeta) return 0

	const {
		prompt_tokens = 0,
		completion_tokens = 0,
		total_tokens = 0,
		price,
	} = modelMeta

	const modelPrice = Number(price)
	if (!Number.isFinite(modelPrice) || modelPrice <= 0) return 0

	const tokens =
		total_tokens > 0 ? total_tokens : prompt_tokens + completion_tokens

	return (tokens / 1000) * modelPrice
}
