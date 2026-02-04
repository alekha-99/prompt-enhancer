/**
 * Application Constants
 */

export const APP_NAME = 'Prompt Enhancer';
export const APP_VERSION = '1.0.0';

// LLM Configuration
export const LLM_CONFIG = {
    openai: {
        model: 'gpt-4o-mini',
        maxTokens: 4096,
        temperature: 0.7,
    },
    anthropic: {
        model: 'claude-3-haiku-20240307',
        maxTokens: 4096,
        temperature: 0.7,
    },
} as const;

// API Endpoints
export const API_ENDPOINTS = {
    enhance: '/api/enhance',
    refineQuestions: '/api/refine/questions',
    refineEnhance: '/api/refine/enhance',
    health: '/api/health',
} as const;

// UI Constants
export const UI_CONSTANTS = {
    maxPromptLength: 10000,
    minPromptLength: 3,
    copyResetDelay: 2000,
    debounceDelay: 300,
} as const;
