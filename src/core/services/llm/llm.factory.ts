/**
 * LLM Service Factory
 * Factory pattern for creating LLM service instances
 */

import { ILLMService } from './llm.service';
import { OpenAIAdapter } from './openai.adapter';
import { AnthropicAdapter } from './anthropic.adapter';
import { LLMProvider } from '@/shared/types';
import { getDefaultProvider, hasOpenAIKey, hasAnthropicKey } from '@/infrastructure/config';
import { ConfigurationError } from '@/shared/utils';

// Singleton instances for each provider
let openaiInstance: OpenAIAdapter | null = null;
let anthropicInstance: AnthropicAdapter | null = null;

/**
 * Get an LLM service instance for the specified provider
 * Uses singleton pattern for efficiency
 */
export function getLLMService(provider?: LLMProvider): ILLMService {
    const selectedProvider = provider || getDefaultProvider();

    switch (selectedProvider) {
        case 'openai':
            if (!hasOpenAIKey()) {
                throw new ConfigurationError('OpenAI API key is not configured');
            }
            if (!openaiInstance) {
                openaiInstance = new OpenAIAdapter();
            }
            return openaiInstance;

        case 'anthropic':
            if (!hasAnthropicKey()) {
                throw new ConfigurationError('Anthropic API key is not configured');
            }
            if (!anthropicInstance) {
                anthropicInstance = new AnthropicAdapter();
            }
            return anthropicInstance;

        default:
            throw new ConfigurationError(`Unsupported LLM provider: ${selectedProvider}`);
    }
}

/**
 * Get list of available (configured) providers
 */
export function getAvailableProviders(): LLMProvider[] {
    const providers: LLMProvider[] = [];

    if (hasOpenAIKey()) {
        providers.push('openai');
    }

    if (hasAnthropicKey()) {
        providers.push('anthropic');
    }

    return providers;
}

/**
 * Reset service instances (useful for testing)
 */
export function resetLLMServices(): void {
    openaiInstance = null;
    anthropicInstance = null;
}
