/**
 * Use Case Detection Service
 * Auto-detects prompt intent and categorizes by use case
 */

export type UseCase =
    | 'coding'
    | 'creative'
    | 'analysis'
    | 'writing'
    | 'marketing'
    | 'education'
    | 'business'
    | 'general';

export interface UseCaseDetection {
    primary: UseCase;
    confidence: number;  // 0-100
    secondary?: UseCase;
    keywords: string[];
    icon: string;
    color: string;
    suggestedModel: string;
}

/**
 * Keywords for each use case
 */
const USE_CASE_PATTERNS: Record<UseCase, { keywords: string[]; weight: number }> = {
    coding: {
        keywords: [
            'code', 'function', 'class', 'api', 'debug', 'error', 'bug',
            'javascript', 'typescript', 'python', 'java', 'react', 'node',
            'database', 'sql', 'algorithm', 'programming', 'developer',
            'github', 'git', 'compile', 'runtime', 'test', 'unit test',
            'refactor', 'optimize', 'performance', 'variable', 'loop'
        ],
        weight: 1.2,
    },
    creative: {
        keywords: [
            'story', 'poem', 'novel', 'character', 'plot', 'dialogue',
            'creative', 'fiction', 'fantasy', 'imagine', 'world building',
            'narrative', 'scene', 'chapter', 'protagonist', 'antagonist',
            'twist', 'genre', 'setting', 'mood', 'tone', 'voice'
        ],
        weight: 1.1,
    },
    analysis: {
        keywords: [
            'analyze', 'analysis', 'compare', 'contrast', 'evaluate',
            'assess', 'review', 'examine', 'study', 'research',
            'data', 'statistics', 'metrics', 'trends', 'patterns',
            'insights', 'findings', 'conclusion', 'hypothesis'
        ],
        weight: 1.0,
    },
    writing: {
        keywords: [
            'write', 'essay', 'article', 'blog', 'content', 'paragraph',
            'summary', 'summarize', 'proofread', 'edit', 'grammar',
            'tone', 'formal', 'informal', 'professional', 'rewrite',
            'draft', 'outline', 'structure', 'thesis', 'argument'
        ],
        weight: 1.0,
    },
    marketing: {
        keywords: [
            'marketing', 'ad', 'advertisement', 'campaign', 'brand',
            'social media', 'seo', 'conversion', 'landing page', 'cta',
            'headline', 'copy', 'copywriting', 'email', 'newsletter',
            'audience', 'engagement', 'viral', 'influencer', 'roi'
        ],
        weight: 1.1,
    },
    education: {
        keywords: [
            'explain', 'teach', 'learn', 'student', 'lesson', 'course',
            'tutorial', 'guide', 'beginner', 'introduction', 'basics',
            'concept', 'understand', 'knowledge', 'skill', 'practice',
            'quiz', 'exercise', 'example', 'simple terms'
        ],
        weight: 1.0,
    },
    business: {
        keywords: [
            'business', 'strategy', 'plan', 'meeting', 'proposal',
            'presentation', 'report', 'executive', 'stakeholder',
            'budget', 'revenue', 'profit', 'growth', 'kpi',
            'swot', 'competitor', 'market', 'customer', 'client'
        ],
        weight: 1.0,
    },
    general: {
        keywords: [],
        weight: 0.5,
    },
};

/**
 * Use case metadata
 */
const USE_CASE_META: Record<UseCase, { icon: string; color: string; suggestedModel: string }> = {
    coding: { icon: '💻', color: '#22c55e', suggestedModel: 'GPT-4' },
    creative: { icon: '🎨', color: '#a855f7', suggestedModel: 'Claude' },
    analysis: { icon: '📊', color: '#3b82f6', suggestedModel: 'GPT-4' },
    writing: { icon: '✍️', color: '#eab308', suggestedModel: 'Claude' },
    marketing: { icon: '📢', color: '#f97316', suggestedModel: 'GPT-4o-mini' },
    education: { icon: '📚', color: '#06b6d4', suggestedModel: 'GPT-4' },
    business: { icon: '💼', color: '#6366f1', suggestedModel: 'GPT-4' },
    general: { icon: '💬', color: '#64748b', suggestedModel: 'GPT-4o-mini' },
};

/**
 * Detect the primary use case of a prompt
 */
export function detectUseCase(prompt: string): UseCaseDetection {
    const lowerPrompt = prompt.toLowerCase();
    const scores: Record<UseCase, { score: number; keywords: string[] }> = {
        coding: { score: 0, keywords: [] },
        creative: { score: 0, keywords: [] },
        analysis: { score: 0, keywords: [] },
        writing: { score: 0, keywords: [] },
        marketing: { score: 0, keywords: [] },
        education: { score: 0, keywords: [] },
        business: { score: 0, keywords: [] },
        general: { score: 0, keywords: [] },
    };

    // Score each use case
    for (const [useCase, { keywords, weight }] of Object.entries(USE_CASE_PATTERNS)) {
        for (const keyword of keywords) {
            if (lowerPrompt.includes(keyword)) {
                scores[useCase as UseCase].score += weight;
                scores[useCase as UseCase].keywords.push(keyword);
            }
        }
    }

    // Sort by score
    const sorted = Object.entries(scores)
        .sort(([, a], [, b]) => b.score - a.score);

    const [primaryCase, primaryData] = sorted[0];
    const [secondaryCase, secondaryData] = sorted[1];

    // Calculate confidence
    const maxScore = Math.max(primaryData.score, 1);
    const totalScore = sorted.reduce((sum, [, data]) => sum + data.score, 0);
    const confidence = totalScore > 0
        ? Math.min(100, Math.round((primaryData.score / Math.max(totalScore, 1)) * 100))
        : 50;

    const primary = (primaryData.score > 0 ? primaryCase : 'general') as UseCase;
    const meta = USE_CASE_META[primary];

    return {
        primary,
        confidence,
        secondary: secondaryData.score > 0 ? secondaryCase as UseCase : undefined,
        keywords: primaryData.keywords.slice(0, 5),
        icon: meta.icon,
        color: meta.color,
        suggestedModel: meta.suggestedModel,
    };
}

/**
 * Get use case display name
 */
export function getUseCaseLabel(useCase: UseCase): string {
    const labels: Record<UseCase, string> = {
        coding: 'Coding & Development',
        creative: 'Creative Writing',
        analysis: 'Data Analysis',
        writing: 'Content Writing',
        marketing: 'Marketing & Sales',
        education: 'Education & Learning',
        business: 'Business & Strategy',
        general: 'General Purpose',
    };
    return labels[useCase];
}
