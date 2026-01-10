import { getModelPricing } from "./providers"

export function calculateCost(
	provider: string,
	model: string,
	promptTokens: number,
	completionTokens: number,
): number {
	const pricing = getModelPricing(provider, model)
	if (!pricing) {
		return 0
	}

	const promptCost = (promptTokens / 1000) * pricing.prompt
	const completionCost = (completionTokens / 1000) * pricing.completion

	return promptCost + completionCost
}
