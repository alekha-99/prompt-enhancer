/**
 * LLM Provider Types
 */

export type LLMProvider = 'openai' | 'anthropic';

export interface LLMConfig {
    provider: LLMProvider;
    model: string;
    maxTokens: number;
    temperature: number;
}

export interface LLMMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

export interface LLMRequest {
    messages: LLMMessage[];
    config?: Partial<LLMConfig>;
}

export interface LLMResponse {
    content: string;
    usage?: {
        promptTokens: number;
        completionTokens: number;
        totalTokens: number;
    };
}

export interface LLMService {
    complete(request: LLMRequest): Promise<LLMResponse>;
    getProviderName(): LLMProvider;
}
