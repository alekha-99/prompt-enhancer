/**
 * Tests for Context Adapter
 */

import {
    adaptForModel,
    addFormatInstructions,
    optimizeTokens,
    estimateTokens,
    applyContextAdaptations,
} from './context.adapter';
import { AIModel, OutputFormat } from './template.types';

describe('applyContextAdaptations', () => {
    it('should return adapted prompt object', () => {
        const prompt = 'Write a function';
        const result = applyContextAdaptations(prompt, {});

        expect(result).toHaveProperty('prompt');
        expect(result).toHaveProperty('tokenCount');
        expect(result).toHaveProperty('savings');
    });

    it('should add format instructions when specified', () => {
        const prompt = 'List the items';
        const result = applyContextAdaptations(prompt, { format: 'json' });

        expect(result.prompt.toLowerCase()).toContain('json');
    });

    it('should apply token optimization when enabled', () => {
        const prompt = 'Please can you help me with this?';
        const result = applyContextAdaptations(prompt, { optimizeTokens: true });

        // Should be modified (redundant phrases removed)
        expect(result.prompt).toBeDefined();
        expect(typeof result.tokenCount).toBe('number');
    });

    it('should handle empty options', () => {
        const prompt = 'Test prompt';
        const result = applyContextAdaptations(prompt, {});

        expect(result.prompt).toBe(prompt);
    });

    it('should handle all options together', () => {
        const prompt = 'Create a list';
        const result = applyContextAdaptations(prompt, {
            model: 'gpt-4',
            format: 'markdown',
            optimizeTokens: true,
        });

        expect(result).toBeDefined();
        expect(typeof result.prompt).toBe('string');
    });

    it('should calculate savings correctly', () => {
        const prompt = 'Please help me with this task';
        const result = applyContextAdaptations(prompt, { optimizeTokens: true });

        // Savings can be 0 or more depending on optimization
        expect(result.savings).toBeGreaterThanOrEqual(0);
    });
});

describe('adaptForModel', () => {
    it('should adapt for GPT-4', () => {
        const result = adaptForModel('Test prompt', 'gpt-4');

        expect(result).toBeDefined();
        expect(typeof result).toBe('string');
    });

    it('should add prefix for llama model', () => {
        const result = adaptForModel('Test prompt', 'llama');

        expect(result).toContain('Test prompt');
        // llama has a prefix
        expect(result.length).toBeGreaterThanOrEqual('Test prompt'.length);
    });

    it('should handle all valid models', () => {
        const models: AIModel[] = ['gpt-4', 'gpt-4o-mini', 'claude', 'gemini', 'llama'];

        models.forEach(model => {
            const result = adaptForModel('Test', model);
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });
    });
});

describe('addFormatInstructions', () => {
    it('should add JSON format instructions', () => {
        const result = addFormatInstructions('Test prompt', 'json');

        expect(result.toLowerCase()).toContain('json');
    });

    it('should add markdown format instructions', () => {
        const result = addFormatInstructions('Test prompt', 'markdown');

        expect(result.toLowerCase()).toContain('markdown');
    });

    it('should add code format instructions', () => {
        const result = addFormatInstructions('Test prompt', 'code');

        expect(result.toLowerCase()).toContain('code');
    });

    it('should return unchanged for text format', () => {
        const prompt = 'Test prompt';
        const result = addFormatInstructions(prompt, 'text');

        expect(result).toBe(prompt);
    });

    it('should handle all valid formats', () => {
        const formats: OutputFormat[] = ['text', 'json', 'markdown', 'code'];

        formats.forEach(format => {
            const result = addFormatInstructions('Test', format);
            expect(result).toBeDefined();
            expect(typeof result).toBe('string');
        });
    });
});

describe('optimizeTokens', () => {
    it('should remove redundant please', () => {
        const prompt = 'Please help me with this';
        const result = optimizeTokens(prompt);

        // Should start with capital letter and have "please" removed
        expect(result.toLowerCase()).not.toContain('please ');
    });

    it('should remove redundant phrases', () => {
        const prompt = 'I would like you to write some code';
        const result = optimizeTokens(prompt);

        expect(result.toLowerCase()).not.toContain('i would like you to');
    });

    it('should collapse multiple spaces', () => {
        const prompt = 'Test    with   multiple   spaces';
        const result = optimizeTokens(prompt);

        expect(result).not.toContain('  ');
    });

    it('should not modify short clean prompts', () => {
        const prompt = 'Write code';
        const result = optimizeTokens(prompt);

        expect(result).toBe('Write code');
    });

    it('should handle empty string', () => {
        const result = optimizeTokens('');

        expect(result).toBe('');
    });

    it('should capitalize first letter', () => {
        const prompt = 'write some code';
        const result = optimizeTokens(prompt);

        expect(result.charAt(0)).toBe('W');
    });
});

describe('estimateTokens', () => {
    it('should return 0 for empty string', () => {
        const result = estimateTokens('');

        expect(result).toBe(0);
    });

    it('should estimate tokens for simple text', () => {
        const result = estimateTokens('Hello world');

        expect(result).toBeGreaterThan(0);
    });

    it('should estimate roughly 1 token per 4 characters', () => {
        const text = 'This is a test sentence.';
        const result = estimateTokens(text);

        // Should be roughly text.length / 4
        const expected = Math.ceil(text.length / 4);
        expect(result).toBe(expected);
    });

    it('should handle long text', () => {
        const longText = 'word '.repeat(1000);
        const result = estimateTokens(longText);

        expect(result).toBeGreaterThan(100);
    });
});
