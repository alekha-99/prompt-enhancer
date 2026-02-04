/**
 * Anthropic LLM Adapter
 * Implements ILLMService for Anthropic Claude API
 */

import Anthropic from '@anthropic-ai/sdk';
import { ILLMService } from './llm.service';
import { LLMRequest, LLMResponse, LLMProvider } from '@/shared/types';
import { LLM_CONFIG } from '@/infrastructure/config';
import { LLMError } from '@/shared/utils';

export class AnthropicAdapter implements ILLMService {
    private client: Anthropic | null = null;
    private readonly config = LLM_CONFIG.anthropic;

    constructor() {
        const apiKey = process.env.ANTHROPIC_API_KEY;
        if (apiKey) {
            this.client = new Anthropic({ apiKey });
        }
    }

    async complete(request: LLMRequest): Promise<LLMResponse> {
        if (!this.client) {
            throw new LLMError('Anthropic client is not configured. Please set ANTHROPIC_API_KEY.');
        }

        try {
            // Extract system message if present
            const systemMessage = request.messages.find(msg => msg.role === 'system');
            const userMessages = request.messages.filter(msg => msg.role !== 'system');

            const response = await this.client.messages.create({
                model: request.config?.model || this.config.model,
                max_tokens: request.config?.maxTokens || this.config.maxTokens,
                system: systemMessage?.content || undefined,
                messages: userMessages.map(msg => ({
                    role: msg.role as 'user' | 'assistant',
                    content: msg.content,
                })),
            });

            const textBlock = response.content.find(block => block.type === 'text');
            const content = textBlock && textBlock.type === 'text' ? textBlock.text : '';

            return {
                content,
                usage: response.usage ? {
                    promptTokens: response.usage.input_tokens,
                    completionTokens: response.usage.output_tokens,
                    totalTokens: response.usage.input_tokens + response.usage.output_tokens,
                } : undefined,
            };
        } catch (error) {
            if (error instanceof Anthropic.APIError) {
                throw new LLMError(`Anthropic API Error: ${error.message}`, {
                    status: error.status,
                });
            }
            throw new LLMError('Failed to complete Anthropic request', error);
        }
    }

    getProviderName(): LLMProvider {
        return 'anthropic';
    }

    isConfigured(): boolean {
        return this.client !== null;
    }
}
