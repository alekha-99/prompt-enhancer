/**
 * Context Adapter
 * Adapts prompts for different AI models and output formats
 */

import { AIModel, OutputFormat } from './template.types';

/**
 * Model-specific prompt prefixes/instructions
 */
const MODEL_PREFIXES: Record<AIModel, string> = {
    'gpt-4': '',
    'gpt-4o-mini': '',
    'claude': '',
    'gemini': '',
    'llama': 'You are a helpful AI assistant. ',
};

/**
 * Output format instructions
 */
const FORMAT_INSTRUCTIONS: Record<OutputFormat, string> = {
    text: '',
    markdown: '\n\nFormat your response using Markdown with headers, lists, and code blocks where appropriate.',
    json: '\n\nRespond ONLY with valid JSON. Do not include any text before or after the JSON object.',
    code: '\n\nRespond with code only. Include comments for explanation. Do not include markdown code fences.',
};

/**
 * Adapt a prompt for a specific AI model
 * @param prompt - Original prompt
 * @param model - Target AI model
 * @returns Adapted prompt
 */
export function adaptForModel(prompt: string, model: AIModel): string {
    const prefix = MODEL_PREFIXES[model];
    return prefix ? `${prefix}${prompt}` : prompt;
}

/**
 * Add output format instructions to a prompt
 * @param prompt - Original prompt
 * @param format - Desired output format
 * @returns Prompt with format instructions
 */
export function addFormatInstructions(
    prompt: string,
    format: OutputFormat
): string {
    const instruction = FORMAT_INSTRUCTIONS[format];
    return instruction ? `${prompt}${instruction}` : prompt;
}

/**
 * Optimize prompt for token efficiency
 * Removes redundant whitespace and simplifies language
 * @param prompt - Original prompt
 * @returns Optimized prompt
 */
export function optimizeTokens(prompt: string): string {
    let optimized = prompt;

    // Remove excessive whitespace
    optimized = optimized.replace(/\s+/g, ' ');

    // Remove redundant phrases
    const redundantPhrases = [
        /please\s+/gi,
        /I would like you to\s+/gi,
        /Could you please\s+/gi,
        /I want you to\s+/gi,
        /Can you\s+/gi,
    ];

    for (const phrase of redundantPhrases) {
        optimized = optimized.replace(phrase, '');
    }

    // Trim and ensure proper capitalization
    optimized = optimized.trim();
    if (optimized.length > 0) {
        optimized = optimized.charAt(0).toUpperCase() + optimized.slice(1);
    }

    return optimized;
}

/**
 * Estimate token count (rough approximation)
 * @param text - Text to estimate
 * @returns Estimated token count
 */
export function estimateTokens(text: string): number {
    // Rough estimate: 1 token ≈ 4 characters for English
    return Math.ceil(text.length / 4);
}

/**
 * Apply all context adaptations to a prompt
 * @param prompt - Original prompt
 * @param options - Adaptation options
 * @returns Fully adapted prompt
 */
export function applyContextAdaptations(
    prompt: string,
    options: {
        model?: AIModel;
        format?: OutputFormat;
        optimizeTokens?: boolean;
    }
): { prompt: string; tokenCount: number; savings: number } {
    let adapted = prompt;
    const originalTokens = estimateTokens(prompt);

    // Apply token optimization first
    if (options.optimizeTokens) {
        adapted = optimizeTokens(adapted);
    }

    // Add format instructions
    if (options.format) {
        adapted = addFormatInstructions(adapted, options.format);
    }

    // Adapt for model
    if (options.model) {
        adapted = adaptForModel(adapted, options.model);
    }

    const finalTokens = estimateTokens(adapted);

    return {
        prompt: adapted,
        tokenCount: finalTokens,
        savings: Math.max(0, originalTokens - finalTokens),
    };
}
