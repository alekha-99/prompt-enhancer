/**
 * @jest-environment node
 */

import {
    getDefaultProvider,
    hasOpenAIKey,
    hasAnthropicKey,
    validateEnvConfig,
    getOpenAIApiKey,
    getAnthropicApiKey,
} from '@/infrastructure/config/env';

describe('Environment Config', () => {
    const originalEnv = process.env;

    beforeEach(() => {
        jest.resetModules();
        process.env = { ...originalEnv };
    });

    afterAll(() => {
        process.env = originalEnv;
    });

    describe('hasOpenAIKey', () => {
        it('should return true when key is present', () => {
            process.env.OPENAI_API_KEY = 'key';
            expect(hasOpenAIKey()).toBe(true);
        });

        it('should return false when key is missing', () => {
            delete process.env.OPENAI_API_KEY;
            expect(hasOpenAIKey()).toBe(false);
        });
    });

    describe('hasAnthropicKey', () => {
        it('should return true when key is present', () => {
            process.env.ANTHROPIC_API_KEY = 'key';
            expect(hasAnthropicKey()).toBe(true);
        });

        it('should return false when key is missing', () => {
            delete process.env.ANTHROPIC_API_KEY;
            expect(hasAnthropicKey()).toBe(false);
        });
    });

    describe('validateEnvConfig', () => {
        it('should pass when at least one key is present', () => {
            process.env.OPENAI_API_KEY = 'key';
            expect(() => validateEnvConfig()).not.toThrow();
        });

        it('should throw when no keys are present', () => {
            delete process.env.OPENAI_API_KEY;
            delete process.env.ANTHROPIC_API_KEY;
            expect(() => validateEnvConfig()).toThrow('At least one LLM API key must be configured');
        });
    });

    describe('getOpenAIApiKey', () => {
        it('should return key when present', () => {
            process.env.OPENAI_API_KEY = 'key';
            expect(getOpenAIApiKey()).toBe('key');
        });

        it('should throw when missing', () => {
            delete process.env.OPENAI_API_KEY;
            expect(() => getOpenAIApiKey()).toThrow('OpenAI API key is not configured');
        });
    });

    describe('getAnthropicApiKey', () => {
        it('should return key when present', () => {
            process.env.ANTHROPIC_API_KEY = 'key';
            expect(getAnthropicApiKey()).toBe('key');
        });

        it('should throw when missing', () => {
            delete process.env.ANTHROPIC_API_KEY;
            expect(() => getAnthropicApiKey()).toThrow('Anthropic API key is not configured');
        });
    });

    describe('getDefaultProvider', () => {
        it('should obey explicit setting', () => {
            process.env.DEFAULT_LLM_PROVIDER = 'anthropic';
            process.env.ANTHROPIC_API_KEY = 'key';
            expect(getDefaultProvider()).toBe('anthropic');
        });

        it('should fallback to openai if explicit setting is missing key', () => {
            process.env.DEFAULT_LLM_PROVIDER = 'anthropic';
            delete process.env.ANTHROPIC_API_KEY;
            process.env.OPENAI_API_KEY = 'key';
            // Logic: if provider=anthropic & key missing, check OpenAI
            // Actually code says: if provider=anthropic && key, return anthropic.
            // else if openai key, return openai.
            expect(getDefaultProvider()).toBe('openai');
        });

        it('should default to openai if no setting', () => {
            delete process.env.DEFAULT_LLM_PROVIDER;
            process.env.OPENAI_API_KEY = 'key';
            expect(getDefaultProvider()).toBe('openai');
        });

        it('should use anthropic if it is the only one available', () => {
            delete process.env.DEFAULT_LLM_PROVIDER;
            delete process.env.OPENAI_API_KEY;
            process.env.ANTHROPIC_API_KEY = 'key';
            expect(getDefaultProvider()).toBe('anthropic');
        });
    });
});
