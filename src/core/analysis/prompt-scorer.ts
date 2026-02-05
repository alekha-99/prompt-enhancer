/**
 * Prompt Scoring Service
 * Analyzes prompt quality and provides actionable feedback
 */

export interface PromptScore {
    overall: number;  // 0-100
    breakdown: {
        clarity: number;
        specificity: number;
        context: number;
        structure: number;
        actionability: number;
    };
    suggestions: PromptSuggestion[];
    strengths: string[];
    weaknesses: string[];
}

export interface PromptSuggestion {
    type: 'add' | 'remove' | 'improve';
    category: string;
    message: string;
    priority: 'high' | 'medium' | 'low';
}

/**
 * Keywords that indicate good prompt structure
 */
const QUALITY_INDICATORS = {
    roleSpecification: [
        'you are', 'act as', 'assume the role', 'pretend you are',
        'as an expert', 'as a professional'
    ],
    outputFormat: [
        'format:', 'output:', 'respond with', 'provide as',
        'in json', 'in markdown', 'bullet points', 'numbered list'
    ],
    context: [
        'context:', 'background:', 'given that', 'considering',
        'based on', 'in the context of'
    ],
    examples: [
        'for example', 'for instance', 'such as', 'e.g.',
        'example:', 'like this'
    ],
    constraints: [
        'limit', 'maximum', 'minimum', 'at least', 'at most',
        'no more than', 'within', 'between'
    ],
    specificity: [
        'specifically', 'exactly', 'precisely', 'detailed',
        'step by step', 'step-by-step'
    ],
};

/**
 * Analyze prompt quality and generate score
 */
export function analyzePrompt(prompt: string): PromptScore {
    const lowerPrompt = prompt.toLowerCase();
    const wordCount = prompt.split(/\s+/).filter(Boolean).length;
    const sentenceCount = prompt.split(/[.!?]+/).filter(Boolean).length;

    const suggestions: PromptSuggestion[] = [];
    const strengths: string[] = [];
    const weaknesses: string[] = [];

    // Analyze each quality dimension
    const breakdown = {
        clarity: calculateClarity(prompt, lowerPrompt, wordCount, sentenceCount, suggestions, strengths, weaknesses),
        specificity: calculateSpecificity(lowerPrompt, suggestions, strengths, weaknesses),
        context: calculateContext(lowerPrompt, suggestions, strengths, weaknesses),
        structure: calculateStructure(prompt, lowerPrompt, suggestions, strengths, weaknesses),
        actionability: calculateActionability(lowerPrompt, suggestions, strengths, weaknesses),
    };

    // Calculate overall score (weighted average)
    const weights = { clarity: 0.25, specificity: 0.25, context: 0.2, structure: 0.15, actionability: 0.15 };
    const overall = Math.round(
        breakdown.clarity * weights.clarity +
        breakdown.specificity * weights.specificity +
        breakdown.context * weights.context +
        breakdown.structure * weights.structure +
        breakdown.actionability * weights.actionability
    );

    // Add general suggestions based on word count
    if (wordCount < 10) {
        suggestions.push({
            type: 'add',
            category: 'Length',
            message: 'Prompt is very short. Add more context and details.',
            priority: 'high',
        });
    }

    return {
        overall,
        breakdown,
        suggestions: suggestions.sort((a, b) =>
            a.priority === 'high' ? -1 : b.priority === 'high' ? 1 : 0
        ),
        strengths,
        weaknesses,
    };
}

function calculateClarity(
    prompt: string,
    lowerPrompt: string,
    wordCount: number,
    sentenceCount: number,
    suggestions: PromptSuggestion[],
    strengths: string[],
    weaknesses: string[]
): number {
    let score = 50;

    // Check for question or clear instruction
    const hasQuestion = prompt.includes('?');
    const hasImperative = /^(write|create|generate|explain|describe|list|analyze|build|help|make|provide|show|tell)/i.test(prompt);

    if (hasQuestion || hasImperative) {
        score += 20;
        strengths.push('Clear request or question');
    } else {
        weaknesses.push('No clear question or instruction');
        suggestions.push({
            type: 'improve',
            category: 'Clarity',
            message: 'Start with a clear action verb (Write, Create, Explain, etc.)',
            priority: 'high',
        });
    }

    // Average sentence length (10-20 words is ideal)
    const avgSentenceLength = wordCount / Math.max(sentenceCount, 1);
    if (avgSentenceLength >= 10 && avgSentenceLength <= 25) {
        score += 15;
    } else if (avgSentenceLength < 10) {
        score += 5;
    }

    // Check for vague words
    const vagueWords = ['thing', 'stuff', 'something', 'somehow', 'whatever', 'etc'];
    const vagueCount = vagueWords.filter(word => lowerPrompt.includes(word)).length;
    if (vagueCount > 0) {
        score -= vagueCount * 5;
        weaknesses.push(`Contains vague words (${vagueCount} found)`);
        suggestions.push({
            type: 'remove',
            category: 'Clarity',
            message: 'Replace vague words like "thing", "stuff", "something" with specific terms',
            priority: 'medium',
        });
    } else {
        strengths.push('Uses specific language');
    }

    return Math.max(0, Math.min(100, score));
}

function calculateSpecificity(
    lowerPrompt: string,
    suggestions: PromptSuggestion[],
    strengths: string[],
    weaknesses: string[]
): number {
    let score = 40;

    // Check for specificity indicators
    const hasSpecificity = QUALITY_INDICATORS.specificity.some(ind => lowerPrompt.includes(ind));
    if (hasSpecificity) {
        score += 20;
        strengths.push('Includes specific instructions');
    }

    // Check for examples
    const hasExamples = QUALITY_INDICATORS.examples.some(ind => lowerPrompt.includes(ind));
    if (hasExamples) {
        score += 25;
        strengths.push('Provides examples');
    } else {
        suggestions.push({
            type: 'add',
            category: 'Specificity',
            message: 'Add examples to clarify your expectations',
            priority: 'medium',
        });
    }

    // Check for constraints
    const hasConstraints = QUALITY_INDICATORS.constraints.some(ind => lowerPrompt.includes(ind));
    if (hasConstraints) {
        score += 15;
        strengths.push('Defines constraints/limits');
    }

    return Math.max(0, Math.min(100, score));
}

function calculateContext(
    lowerPrompt: string,
    suggestions: PromptSuggestion[],
    strengths: string[],
    weaknesses: string[]
): number {
    let score = 40;

    // Check for role specification
    const hasRole = QUALITY_INDICATORS.roleSpecification.some(ind => lowerPrompt.includes(ind));
    if (hasRole) {
        score += 30;
        strengths.push('Specifies AI role');
    } else {
        suggestions.push({
            type: 'add',
            category: 'Context',
            message: 'Add role specification (e.g., "You are an expert...")',
            priority: 'high',
        });
    }

    // Check for context indicators
    const hasContext = QUALITY_INDICATORS.context.some(ind => lowerPrompt.includes(ind));
    if (hasContext) {
        score += 20;
        strengths.push('Provides background context');
    }

    // Check for audience specification
    const hasAudience = /for (beginners|experts|developers|users|students|professionals)/i.test(lowerPrompt);
    if (hasAudience) {
        score += 10;
        strengths.push('Specifies target audience');
    }

    return Math.max(0, Math.min(100, score));
}

function calculateStructure(
    prompt: string,
    lowerPrompt: string,
    suggestions: PromptSuggestion[],
    strengths: string[],
    weaknesses: string[]
): number {
    let score = 50;

    // Check for output format specification
    const hasOutputFormat = QUALITY_INDICATORS.outputFormat.some(ind => lowerPrompt.includes(ind));
    if (hasOutputFormat) {
        score += 25;
        strengths.push('Specifies output format');
    } else {
        suggestions.push({
            type: 'add',
            category: 'Structure',
            message: 'Specify desired output format (JSON, Markdown, bullet points, etc.)',
            priority: 'medium',
        });
    }

    // Check for numbered steps or bullet points
    const hasStructuredFormat = /(\d+\.|•|-|\*)\s/.test(prompt);
    if (hasStructuredFormat) {
        score += 15;
        strengths.push('Uses structured formatting');
    }

    // Check for sections/headers
    const hasSections = /^(#|##|###|\*\*|__)/m.test(prompt);
    if (hasSections) {
        score += 10;
        strengths.push('Organized with sections');
    }

    return Math.max(0, Math.min(100, score));
}

function calculateActionability(
    lowerPrompt: string,
    suggestions: PromptSuggestion[],
    strengths: string[],
    weaknesses: string[]
): number {
    let score = 50;

    // Check for action verbs
    const actionVerbs = [
        'create', 'write', 'generate', 'build', 'design', 'develop',
        'analyze', 'explain', 'describe', 'list', 'compare', 'summarize',
        'translate', 'convert', 'optimize', 'improve', 'review', 'fix'
    ];
    const hasAction = actionVerbs.some(verb => lowerPrompt.includes(verb));
    if (hasAction) {
        score += 25;
        strengths.push('Contains clear action verbs');
    } else {
        weaknesses.push('Missing clear action verb');
        suggestions.push({
            type: 'add',
            category: 'Actionability',
            message: 'Use clear action verbs (Create, Write, Analyze, etc.)',
            priority: 'high',
        });
    }

    // Check for expected outcome
    const hasOutcome = /should|must|will|expect|result|output/i.test(lowerPrompt);
    if (hasOutcome) {
        score += 15;
        strengths.push('Describes expected outcome');
    }

    // Check for step specification
    const hasSteps = /step|first|then|next|finally|after/i.test(lowerPrompt);
    if (hasSteps) {
        score += 10;
        strengths.push('Outlines steps or sequence');
    }

    return Math.max(0, Math.min(100, score));
}

/**
 * Get score color based on value
 */
export function getScoreColor(score: number): string {
    if (score >= 80) return '#22c55e';  // Green
    if (score >= 60) return '#eab308';  // Yellow
    if (score >= 40) return '#f97316';  // Orange
    return '#ef4444';  // Red
}

/**
 * Get score label based on value
 */
export function getScoreLabel(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Improvement';
}
