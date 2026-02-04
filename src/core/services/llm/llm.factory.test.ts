/**
 * @jest-environment node
 */

/**
 * Unit Tests for LLM Factory
 */

import {
    getLLMService,
    getAvailableProviders,
    resetLLMServices,
} from '@/core/services/llm/llm.factory';
import { OpenAIAdapter } from '@/core/services/llm/openai.adapter';
import { AnthropicAdapter } from '@/core/services/llm/anthropic.adapter';

// Reset services before each test to ensure clean state
beforeEach(() => {
    resetLLMServices();
});

describe('getLLMService', () => {
    it('should return OpenAI adapter when requesting openai', () => {
        const service = getLLMService('openai');
        expect(service).toBeInstanceOf(OpenAIAdapter);
        expect(service.getProviderName()).toBe('openai');
    });

    it('should return Anthropic adapter when requesting anthropic', () => {
        const service = getLLMService('anthropic');
        expect(service).toBeInstanceOf(AnthropicAdapter);
        expect(service.getProviderName()).toBe('anthropic');
    });

    it('should return default provider when no provider specified', () => {
        const service = getLLMService();
        expect(service).toBeDefined();
        expect(['openai', 'anthropic']).toContain(service.getProviderName());
    });

    it('should return same instance (singleton) for same provider', () => {
        const service1 = getLLMService('openai');
        const service2 = getLLMService('openai');
        expect(service1).toBe(service2);
    });

    it('should report isConfigured as true when API key is set', () => {
        const service = getLLMService('openai');
        expect(service.isConfigured()).toBe(true);
    });
});

describe('getAvailableProviders', () => {
    it('should return array of providers', () => {
        const providers = getAvailableProviders();
        expect(Array.isArray(providers)).toBe(true);
    });

    it('should include openai when OPENAI_API_KEY is set', () => {
        const providers = getAvailableProviders();
        expect(providers).toContain('openai');
    });

    it('should include anthropic when ANTHROPIC_API_KEY is set', () => {
        const providers = getAvailableProviders();
        expect(providers).toContain('anthropic');
    });
});

describe('resetLLMServices', () => {
    it('should create new instances after reset', () => {
        const service1 = getLLMService('openai');
        resetLLMServices();
        const service2 = getLLMService('openai');

        // After reset, should be different instances
        expect(service1).not.toBe(service2);
    });
});
