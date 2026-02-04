/**
 * Unit Tests for Enhance Service
 */

import {
    enhancePrompt,
    generateRefineQuestions,
    enhanceWithContext,
} from '@/core/services/enhance/enhance.service';
import { ValidationError } from '@/shared/utils';
import * as llmFactory from '@/core/services/llm/llm.factory';

// Mock the LLM service
jest.mock('@/core/services/llm/llm.factory');

const mockLLMService = {
    complete: jest.fn(),
    getProviderName: jest.fn().mockReturnValue('openai'),
    isConfigured: jest.fn().mockReturnValue(true),
};

beforeEach(() => {
    jest.clearAllMocks();
    (llmFactory.getLLMService as jest.Mock).mockReturnValue(mockLLMService);
});

describe('enhancePrompt', () => {
    it('should throw ValidationError for empty prompt', async () => {
        await expect(enhancePrompt('')).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for whitespace-only prompt', async () => {
        await expect(enhancePrompt('   ')).rejects.toThrow(ValidationError);
    });

    it('should throw ValidationError for too short prompt', async () => {
        await expect(enhancePrompt('ab')).rejects.toThrow(ValidationError);
    });

    it('should call LLM service with meta-prompt', async () => {
        mockLLMService.complete.mockResolvedValue({ content: 'Enhanced prompt here' });

        const result = await enhancePrompt('explain react hooks');

        expect(llmFactory.getLLMService).toHaveBeenCalled();
        expect(mockLLMService.complete).toHaveBeenCalled();
        expect(result.enhancedPrompt).toBe('Enhanced prompt here');
        expect(result.provider).toBe('openai');
    });

    it('should pass prompt to meta-prompt template', async () => {
        mockLLMService.complete.mockResolvedValue({ content: 'Result' });

        await enhancePrompt('my custom prompt');

        const callArgs = mockLLMService.complete.mock.calls[0][0];
        expect(callArgs.messages[0].content).toContain('my custom prompt');
    });

    it('should trim the response', async () => {
        mockLLMService.complete.mockResolvedValue({ content: '  Enhanced prompt  \n' });

        const result = await enhancePrompt('test prompt');

        expect(result.enhancedPrompt).toBe('Enhanced prompt');
    });

    it('should pass provider to getLLMService', async () => {
        mockLLMService.complete.mockResolvedValue({ content: 'Result' });

        await enhancePrompt('test', 'anthropic');

        expect(llmFactory.getLLMService).toHaveBeenCalledWith('anthropic');
    });
});

describe('generateRefineQuestions', () => {
    it('should throw ValidationError for empty prompt', async () => {
        await expect(generateRefineQuestions('')).rejects.toThrow(ValidationError);
    });

    it('should parse JSON array response', async () => {
        const questions = ['What is the audience?', 'What format?'];
        mockLLMService.complete.mockResolvedValue({ content: JSON.stringify(questions) });

        const result = await generateRefineQuestions('explain react');

        expect(result.questions).toEqual(questions);
    });

    it('should extract JSON from mixed response', async () => {
        const response = 'Here are questions:\n["Q1?", "Q2?"]\n\nHope this helps!';
        mockLLMService.complete.mockResolvedValue({ content: response });

        const result = await generateRefineQuestions('test prompt');

        expect(result.questions).toEqual(['Q1?', 'Q2?']);
    });

    it('should fallback to line parsing if JSON fails', async () => {
        mockLLMService.complete.mockResolvedValue({
            content: '1. First question?\n2. Second question?\n3. Third question?',
        });

        const result = await generateRefineQuestions('test prompt');

        expect(result.questions.length).toBeGreaterThan(0);
    });
});

describe('enhanceWithContext', () => {
    it('should throw ValidationError for empty prompt', async () => {
        await expect(enhanceWithContext('', {})).rejects.toThrow(ValidationError);
    });

    it('should format answers into context', async () => {
        mockLLMService.complete.mockResolvedValue({ content: 'Enhanced result' });

        const answers = {
            'What is the audience?': 'Developers',
            'What format?': 'Tutorial',
        };

        await enhanceWithContext('test prompt', answers);

        const callArgs = mockLLMService.complete.mock.calls[0][0];
        expect(callArgs.messages[0].content).toContain('Q: What is the audience?');
        expect(callArgs.messages[0].content).toContain('A: Developers');
    });

    it('should return enhanced prompt with provider', async () => {
        mockLLMService.complete.mockResolvedValue({ content: 'Refined result' });

        const result = await enhanceWithContext('test', { 'Q?': 'A' });

        expect(result.enhancedPrompt).toBe('Refined result');
        expect(result.provider).toBe('openai');
    });
});
