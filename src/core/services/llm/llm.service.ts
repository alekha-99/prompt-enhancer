/**
 * LLM Service Interface
 * Abstract interface for LLM providers
 */

import { LLMRequest, LLMResponse, LLMProvider } from '@/shared/types';

export interface ILLMService {
    /**
     * Send a completion request to the LLM
     */
    complete(request: LLMRequest): Promise<LLMResponse>;

    /**
     * Get the provider name
     */
    getProviderName(): LLMProvider;

    /**
     * Check if the service is properly configured
     */
    isConfigured(): boolean;
}
