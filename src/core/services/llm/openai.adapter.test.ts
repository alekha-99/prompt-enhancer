/**
 * @jest-environment node
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { OpenAIAdapter } from './openai.adapter';
import OpenAI from 'openai';

// Mock OpenAI
jest.mock('openai');

describe('OpenAIAdapter', () => {
    const mockCreate = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
        (OpenAI as unknown as jest.Mock).mockImplementation(() => ({
            chat: {
                completions: {
                    create: mockCreate,
                },
            },
        }));
    });

    it('should initialize with API key', () => {
        new OpenAIAdapter();
        expect(OpenAI).toHaveBeenCalledWith({ apiKey: expect.any(String) });
    });

    it('should complete request', async () => {
        mockCreate.mockResolvedValue({
            choices: [{ message: { content: 'response' } }],
            usage: {
                prompt_tokens: 10,
                completion_tokens: 5,
                total_tokens: 15,
            },
        });

        const adapter = new OpenAIAdapter();
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

    it('should handle API errors', async () => {
        const error = new Error('API Error');
        (error as any).status = 400;
        (error as any).code = 'invalid_request';
        mockCreate.mockRejectedValue(error);

        const adapter = new OpenAIAdapter();
        await expect(adapter.complete({
            messages: [{ role: 'user', content: 'test' }],
        })).rejects.toThrow('Failed to complete OpenAI request');
    });

    it('should get provider name', () => {
        const adapter = new OpenAIAdapter();
        expect(adapter.getProviderName()).toBe('openai');
    });
});
