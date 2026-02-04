/**
 * Enhance Service
 * Core business logic for prompt enhancement
 */

import { getLLMService } from '../llm';
import { IMPROVE_PROMPT, REFINE_QUESTIONS_PROMPT, REFINE_ENHANCE_PROMPT, fillTemplate } from '../../prompts';
import { LLMProvider } from '@/shared/types';
import { ValidationError } from '@/shared/utils';
import { validatePrompt, sanitizePrompt } from '@/shared/utils';

export interface EnhanceResult {
    enhancedPrompt: string;
    provider: LLMProvider;
}

export interface RefineQuestionsResult {
    questions: string[];
    provider: LLMProvider;
}

/**
 * Enhance a prompt using the Improve mode (one-click)
 */
export async function enhancePrompt(
    prompt: string,
    provider?: LLMProvider
): Promise<EnhanceResult> {
    // Validate input
    const validation = validatePrompt(prompt);
    if (!validation.isValid) {
        throw new ValidationError(validation.error || 'Invalid prompt');
    }

    const sanitizedPrompt = sanitizePrompt(prompt);
    const llmService = getLLMService(provider);

    // Build the meta-prompt
    const metaPrompt = fillTemplate(IMPROVE_PROMPT, { input: sanitizedPrompt });

    // Call LLM
    const response = await llmService.complete({
        messages: [
            { role: 'user', content: metaPrompt }
        ],
    });

    return {
        enhancedPrompt: response.content.trim(),
        provider: llmService.getProviderName(),
    };
}

/**
 * Generate clarifying questions for Refine mode
 */
export async function generateRefineQuestions(
    prompt: string,
    provider?: LLMProvider
): Promise<RefineQuestionsResult> {
    // Validate input
    const validation = validatePrompt(prompt);
    if (!validation.isValid) {
        throw new ValidationError(validation.error || 'Invalid prompt');
    }

    const sanitizedPrompt = sanitizePrompt(prompt);
    const llmService = getLLMService(provider);

    // Build the questions prompt
    const questionsPrompt = fillTemplate(REFINE_QUESTIONS_PROMPT, { input: sanitizedPrompt });

    // Call LLM
    const response = await llmService.complete({
        messages: [
            { role: 'user', content: questionsPrompt }
        ],
    });

    // Parse JSON array from response
    const content = response.content.trim();
    let questions: string[];

    try {
        // Try to extract JSON array from response
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            questions = JSON.parse(jsonMatch[0]);
        } else {
            throw new Error('No JSON array found');
        }
    } catch {
        // Fallback: split by newlines if JSON parsing fails
        questions = content
            .split('\n')
            .filter(line => line.trim().length > 0)
            .map(line => line.replace(/^[\d\-\*\.]+\s*/, '').trim())
            .filter(q => q.length > 0)
            .slice(0, 5);
    }

    return {
        questions,
        provider: llmService.getProviderName(),
    };
}

/**
 * Enhance prompt with context from answered questions (Refine mode step 2)
 */
export async function enhanceWithContext(
    originalPrompt: string,
    answers: Record<string, string>,
    provider?: LLMProvider
): Promise<EnhanceResult> {
    // Validate input
    const validation = validatePrompt(originalPrompt);
    if (!validation.isValid) {
        throw new ValidationError(validation.error || 'Invalid prompt');
    }

    const sanitizedPrompt = sanitizePrompt(originalPrompt);
    const llmService = getLLMService(provider);

    // Format answers as context string
    const contextLines = Object.entries(answers)
        .map(([question, answer]) => `Q: ${question}\nA: ${answer}`)
        .join('\n\n');

    // Build the enhance prompt with context
    const enhancePrompt = fillTemplate(REFINE_ENHANCE_PROMPT, {
        originalPrompt: sanitizedPrompt,
        context: contextLines,
    });

    // Call LLM
    const response = await llmService.complete({
        messages: [
            { role: 'user', content: enhancePrompt }
        ],
    });

    return {
        enhancedPrompt: response.content.trim(),
        provider: llmService.getProviderName(),
    };
}
