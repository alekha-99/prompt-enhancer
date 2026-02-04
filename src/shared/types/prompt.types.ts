/**
 * Prompt-related Types
 */

export interface PromptEnhancementResult {
    original: string;
    enhanced: string;
    timestamp: Date;
}

export interface RefineQuestion {
    id: string;
    question: string;
    answer?: string;
}

export interface RefineContext {
    originalPrompt: string;
    questions: RefineQuestion[];
    answers: Record<string, string>;
}

export type EnhancementMode = 'improve' | 'refine';

export interface PromptMetadata {
    mode: EnhancementMode;
    provider: string;
    processingTime?: number;
}
