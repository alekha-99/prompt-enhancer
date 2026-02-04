/**
 * API Request/Response Types
 */

export interface EnhanceRequest {
    prompt: string;
    provider?: 'openai' | 'anthropic';
}

export interface EnhanceResponse {
    enhancedPrompt: string;
    success: boolean;
    error?: string;
}

export interface RefineQuestionsRequest {
    prompt: string;
    provider?: 'openai' | 'anthropic';
}

export interface RefineQuestionsResponse {
    questions: string[];
    success: boolean;
    error?: string;
}

export interface RefineEnhanceRequest {
    prompt: string;
    answers: Record<string, string>;
    provider?: 'openai' | 'anthropic';
}

export interface RefineEnhanceResponse {
    enhancedPrompt: string;
    success: boolean;
    error?: string;
}

export interface HealthCheckResponse {
    status: 'ok' | 'error';
    timestamp: string;
    version: string;
}

export interface ApiError {
    message: string;
    code: string;
    details?: unknown;
}
