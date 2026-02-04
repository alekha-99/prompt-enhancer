/**
 * OpenAI LLM Adapter
 * Implements ILLMService for OpenAI API
 */

import OpenAI from 'openai';
import { ILLMService } from './llm.service';
import { LLMRequest, LLMResponse, LLMProvider } from '@/shared/types';
import { LLM_CONFIG } from '@/infrastructure/config';
import { LLMError } from '@/shared/utils';

export class OpenAIAdapter implements ILLMService {
    private client: OpenAI | null = null;
    private readonly config = LLM_CONFIG.openai;

    constructor() {
        const apiKey = process.env.OPENAI_API_KEY;
        if (apiKey) {
            this.client = new OpenAI({ apiKey });
        }
    }

    async complete(request: LLMRequest): Promise<LLMResponse> {
        if (!this.client) {
            throw new LLMError('OpenAI client is not configured. Please set OPENAI_API_KEY.');
        }

        try {
            const response = await this.client.chat.completions.create({
                model: request.config?.model || this.config.model,
                messages: request.messages.map(msg => ({
                    role: msg.role,
                    content: msg.content,
                })),
                max_tokens: request.config?.maxTokens || this.config.maxTokens,
                temperature: request.config?.temperature ?? this.config.temperature,
            });

            const content = response.choices[0]?.message?.content || '';

            return {
                content,
                usage: response.usage ? {
                    promptTokens: response.usage.prompt_tokens,
                    completionTokens: response.usage.completion_tokens,
                    totalTokens: response.usage.total_tokens,
                } : undefined,
            };
        } catch (error) {
            if (error instanceof OpenAI.APIError) {
                throw new LLMError(`OpenAI API Error: ${error.message}`, {
                    status: error.status,
                    code: error.code,
                });
            }
            throw new LLMError('Failed to complete OpenAI request', error);
        }
    }

    getProviderName(): LLMProvider {
        return 'openai';
    }

    isConfigured(): boolean {
        return this.client !== null;
    }
}
