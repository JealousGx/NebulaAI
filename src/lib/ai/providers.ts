export interface ProviderConfig {
	baseURL: string
	authHeader: (apiKey: string) => Record<string, string>
	outputTokensField: string
	inputTokensField: string
	totalTokensField?: string
}

export const providersConfig: Record<string, ProviderConfig> = {
	openai: {
		baseURL: "https://api.openai.com/v1/chat/completions",
		authHeader: (apiKey) => ({ Authorization: `Bearer ${apiKey}` }),
		outputTokensField: "usage.output_tokens",
		inputTokensField: "usage.input_tokens",
		totalTokensField: "usage.total_tokens",
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

export const getProviders = () => Object.keys(providersConfig)

export function getProviderConfig(
	provider: string,
): ProviderConfig | undefined {
	return providersConfig[provider.toLowerCase()]
}
