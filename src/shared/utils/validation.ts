/**
 * Input Validation Utilities
 */

export const MIN_PROMPT_LENGTH = 3;
export const MAX_PROMPT_LENGTH = 10000;

export interface ValidationResult {
    isValid: boolean;
    error?: string;
}

export function validatePrompt(prompt: string): ValidationResult {
    if (!prompt || typeof prompt !== 'string') {
        return { isValid: false, error: 'Prompt is required' };
    }

    const trimmedPrompt = prompt.trim();

    if (trimmedPrompt.length < MIN_PROMPT_LENGTH) {
        return {
            isValid: false,
            error: `Prompt must be at least ${MIN_PROMPT_LENGTH} characters`
        };
    }

    if (trimmedPrompt.length > MAX_PROMPT_LENGTH) {
        return {
            isValid: false,
            error: `Prompt must be less than ${MAX_PROMPT_LENGTH} characters`
        };
    }

    return { isValid: true };
}

export function sanitizePrompt(prompt: string): string {
    return prompt.trim();
}
