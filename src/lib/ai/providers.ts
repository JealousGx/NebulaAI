export interface ModelPricing {
	prompt: number // Cost per 1K tokens
	completion: number // Cost per 1K tokens
}

export interface ProviderConfig {
	baseURL: string
	authHeader: (apiKey: string) => Record<string, string>
	models: Record<string, ModelPricing>
}

export const providersConfig: Record<string, ProviderConfig> = {
	openai: {
		baseURL: "https://api.openai.com/v1/chat/completions",
		authHeader: (apiKey) => ({ Authorization: `Bearer ${apiKey}` }),
		models: {
			"gpt-3.5-turbo": {
				prompt: 0.0015,
				completion: 0.002,
			},
			"gpt-4": {
				prompt: 0.03,
				completion: 0.06,
			},
			"gpt-4-32k": {
				prompt: 0.06,
				completion: 0.12,
			},
		},
	},
	// Add other providers here, for example:
	// replicate: {
	//   baseURL: "https://api.replicate.com/v1/predictions",
	//   authHeader: (apiKey) => ({ Authorization: `Token ${apiKey}` }),
	//   models: {
	//     // Replicate models have different pricing structures,
	//     // so this would need to be adapted.
	//   },
	// },
}

export function getProviderConfig(
	provider: string,
): ProviderConfig | undefined {
	return providersConfig[provider.toLowerCase()]
}

export function getModelPricing(
	provider: string,
	model: string,
): ModelPricing | undefined {
	const providerConfig = getProviderConfig(provider)
	return providerConfig?.models[model]
}
