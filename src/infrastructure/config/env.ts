/**
 * Environment Configuration with Validation
 * Fail-fast if required environment variables are missing
 */

interface EnvConfig {
    OPENAI_API_KEY: string | undefined;
    ANTHROPIC_API_KEY: string | undefined;
    DEFAULT_LLM_PROVIDER: 'openai' | 'anthropic';
    NODE_ENV: string;
}

function getEnvConfig(): EnvConfig {
    return {
        OPENAI_API_KEY: process.env.OPENAI_API_KEY,
        ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
        DEFAULT_LLM_PROVIDER: (process.env.DEFAULT_LLM_PROVIDER as 'openai' | 'anthropic') || 'openai',
        NODE_ENV: process.env.NODE_ENV || 'development',
    };
}

export function validateEnvConfig(): void {
    const config = getEnvConfig();

    // At least one LLM API key must be configured
    if (!config.OPENAI_API_KEY && !config.ANTHROPIC_API_KEY) {
        throw new Error(
            'Configuration Error: At least one LLM API key must be configured. ' +
            'Set either OPENAI_API_KEY or ANTHROPIC_API_KEY in your environment.'
        );
    }
}

export function getOpenAIApiKey(): string {
    const key = process.env.OPENAI_API_KEY;
    if (!key) {
        throw new Error('OpenAI API key is not configured');
    }
    return key;
}

export function getAnthropicApiKey(): string {
    const key = process.env.ANTHROPIC_API_KEY;
    if (!key) {
        throw new Error('Anthropic API key is not configured');
    }
    return key;
}

export function getDefaultProvider(): 'openai' | 'anthropic' {
    const provider = process.env.DEFAULT_LLM_PROVIDER as 'openai' | 'anthropic';

    if (provider === 'anthropic' && process.env.ANTHROPIC_API_KEY) {
        return 'anthropic';
    }

    if (process.env.OPENAI_API_KEY) {
        return 'openai';
    }

    if (process.env.ANTHROPIC_API_KEY) {
        return 'anthropic';
    }

    return 'openai';
}

export function hasOpenAIKey(): boolean {
    return !!process.env.OPENAI_API_KEY;
}

export function hasAnthropicKey(): boolean {
    return !!process.env.ANTHROPIC_API_KEY;
}

export const env = getEnvConfig();
