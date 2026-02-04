/**
 * @jest-environment node
 */

import { AnthropicAdapter } from './anthropic.adapter';
import Anthropic from '@anthropic-ai/sdk';

// Mock Anthropic
jest.mock('@anthropic-ai/sdk');

describe('AnthropicAdapter', () => {
    const mockCreate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (Anthropic as unknown as jest.Mock).mockImplementation(() => ({
            messages: {
                create: mockCreate,
            },
        }));
    });

    it('should initialize with API key', () => {
        new AnthropicAdapter();
        expect(Anthropic).toHaveBeenCalledWith({ apiKey: expect.any(String) });
    });

    it('should complete request', async () => {
        mockCreate.mockResolvedValue({
            content: [{ type: 'text', text: 'response' }],
            usage: {
                input_tokens: 10,
                output_tokens: 5,
            },
        });

        const adapter = new AnthropicAdapter();
        const result = await adapter.complete({
            messages: [{ role: 'user', content: 'hello' }],
        });

        expect(result.content).toBe('response');
        expect(result.usage).toEqual({
            promptTokens: 10,
            completionTokens: 5,
            totalTokens: 15,
        });
    });

    it('should handle missing client', async () => {
        const originalKey = process.env.ANTHROPIC_API_KEY;
        delete process.env.ANTHROPIC_API_KEY;

        // Create new instance without key
        const adapter = new AnthropicAdapter();

        // It should throw when trying to complete
        await expect(adapter.complete({
            messages: [{ role: 'user', content: 'test' }],
        })).rejects.toThrow('Anthropic client is not configured');

        process.env.ANTHROPIC_API_KEY = originalKey;
    });

    it('should get provider name', () => {
        const adapter = new AnthropicAdapter();
        expect(adapter.getProviderName()).toBe('anthropic');
    });
});
