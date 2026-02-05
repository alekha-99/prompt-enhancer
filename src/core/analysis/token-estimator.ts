/**
 * Token Cost Estimator
 * Estimates token count and cost for different AI models
 */

export interface TokenEstimate {
    tokenCount: number;
    costEstimates: CostEstimate[];
    recommendation: string;
    savings?: {
        model: string;
        percentSaved: number;
        dollarsSaved: number;
    };
}

export interface CostEstimate {
    model: string;
    provider: string;
    inputCost: number;
    outputCost: number;
    totalEstimate: number;  // Assuming 2x output tokens
    tier: 'budget' | 'standard' | 'premium';
}

/**
 * Model pricing per 1K tokens (as of 2024)
 */
const MODEL_PRICING: Record<string, { input: number; output: number; provider: string; tier: CostEstimate['tier'] }> = {
    'gpt-4': { input: 0.03, output: 0.06, provider: 'OpenAI', tier: 'premium' },
    'gpt-4-turbo': { input: 0.01, output: 0.03, provider: 'OpenAI', tier: 'standard' },
    'gpt-4o': { input: 0.005, output: 0.015, provider: 'OpenAI', tier: 'standard' },
    'gpt-4o-mini': { input: 0.00015, output: 0.0006, provider: 'OpenAI', tier: 'budget' },
    'gpt-3.5-turbo': { input: 0.0005, output: 0.0015, provider: 'OpenAI', tier: 'budget' },
    'claude-3-opus': { input: 0.015, output: 0.075, provider: 'Anthropic', tier: 'premium' },
    'claude-3-sonnet': { input: 0.003, output: 0.015, provider: 'Anthropic', tier: 'standard' },
    'claude-3-haiku': { input: 0.00025, output: 0.00125, provider: 'Anthropic', tier: 'budget' },
    'gemini-pro': { input: 0.00025, output: 0.0005, provider: 'Google', tier: 'budget' },
    'gemini-ultra': { input: 0.001, output: 0.002, provider: 'Google', tier: 'standard' },
};

/**
 * Estimate token count from text
 * Uses a simple approximation: ~4 characters per token for English
 */
export function estimateTokenCount(text: string): number {
    if (!text) return 0;

    // More accurate estimation - accounting for whitespace and special chars
    const cleanText = text.trim();
    const wordCount = cleanText.split(/\s+/).length;
    const charCount = cleanText.length;

    // Average: ~0.75 tokens per word, or ~4 chars per token
    // Use a blend of both methods
    const tokensByWord = Math.ceil(wordCount * 1.3);
    const tokensByChar = Math.ceil(charCount / 4);

    return Math.round((tokensByWord + tokensByChar) / 2);
}

/**
 * Calculate cost for a specific model
 */
function calculateModelCost(
    inputTokens: number,
    model: string,
    outputMultiplier = 2
): CostEstimate | null {
    const pricing = MODEL_PRICING[model];
    if (!pricing) return null;

    const estimatedOutputTokens = inputTokens * outputMultiplier;
    const inputCost = (inputTokens / 1000) * pricing.input;
    const outputCost = (estimatedOutputTokens / 1000) * pricing.output;

    return {
        model,
        provider: pricing.provider,
        inputCost: Math.round(inputCost * 10000) / 10000,
        outputCost: Math.round(outputCost * 10000) / 10000,
        totalEstimate: Math.round((inputCost + outputCost) * 10000) / 10000,
        tier: pricing.tier,
    };
}

/**
 * Generate full token and cost estimate
 */
export function estimateTokensAndCost(text: string): TokenEstimate {
    const tokenCount = estimateTokenCount(text);

    // Calculate costs for all models
    const costEstimates: CostEstimate[] = [];
    for (const model of Object.keys(MODEL_PRICING)) {
        const estimate = calculateModelCost(tokenCount, model);
        if (estimate) {
            costEstimates.push(estimate);
        }
    }

    // Sort by total cost
    costEstimates.sort((a, b) => a.totalEstimate - b.totalEstimate);

    // Generate recommendation
    const cheapest = costEstimates[0];
    const mostExpensive = costEstimates[costEstimates.length - 1];

    let recommendation: string;
    if (tokenCount < 500) {
        recommendation = 'Short prompt - any model works well. Use GPT-4o-mini for best value.';
    } else if (tokenCount < 2000) {
        recommendation = 'Medium prompt - consider GPT-4o or Claude 3 Sonnet for quality/cost balance.';
    } else {
        recommendation = 'Long prompt - use GPT-4o-mini or Claude 3 Haiku to save costs, unless you need premium quality.';
    }

    // Calculate potential savings
    const savings = mostExpensive.totalEstimate > 0 && cheapest.totalEstimate > 0 ? {
        model: cheapest.model,
        percentSaved: Math.round((1 - cheapest.totalEstimate / mostExpensive.totalEstimate) * 100),
        dollarsSaved: Math.round((mostExpensive.totalEstimate - cheapest.totalEstimate) * 10000) / 10000,
    } : undefined;

    return {
        tokenCount,
        costEstimates,
        recommendation,
        savings,
    };
}

/**
 * Format cost as currency string
 */
export function formatCost(cost: number): string {
    if (cost < 0.01) {
        return `$${(cost * 100).toFixed(4)}¢`;
    }
    return `$${cost.toFixed(4)}`;
}

/**
 * Get tier color
 */
export function getTierColor(tier: CostEstimate['tier']): string {
    switch (tier) {
        case 'budget': return '#22c55e';
        case 'standard': return '#eab308';
        case 'premium': return '#a855f7';
    }
}
