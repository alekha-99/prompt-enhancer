/**
 * LLM-Based Prompt Analyzer
 * Uses AI to evaluate prompt quality with semantic understanding
 */

export interface LLMPromptAnalysis {
    overall: number;  // 0-100
    breakdown: {
        clarity: number;
        completeness: number;
        specificity: number;
        effectiveness: number;
    };
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    predictedOutcome: string;
    confidence: 'high' | 'medium' | 'low';
}

/**
 * System prompt for the analyzer
 */
const ANALYZER_SYSTEM_PROMPT = `You are an expert prompt engineer evaluating prompt quality. 

Analyze the given prompt and provide a JSON response with this EXACT structure:
{
  "overall": <number 0-100>,
  "breakdown": {
    "clarity": <number 0-100, how clear and unambiguous is the request>,
    "completeness": <number 0-100, does it have all necessary information>,
    "specificity": <number 0-100, how specific vs vague>,
    "effectiveness": <number 0-100, will this produce a useful AI response>
  },
  "strengths": [<array of 1-3 specific things done well>],
  "weaknesses": [<array of 1-3 specific problems>],
  "suggestions": [<array of 1-3 concrete improvements with examples>],
  "predictedOutcome": "<1 sentence describing what response this prompt would likely get>",
  "confidence": "<high|medium|low>"
}

IMPORTANT SCORING RULES:
- A prompt with NO clear task should score <30 overall
- A vague prompt like "help me" should score <20
- A prompt with keywords but no substance should score <40
- Only prompts that would genuinely produce excellent AI responses should score >80
- Be STRICT - most casual prompts should score 40-60
- Consider: Would a professional prompt engineer approve this?

Examples of what to penalize:
- No actual task specified
- Overly broad requests ("tell me everything about X")
- Missing context that would be needed
- Ambiguous instructions
- No clear expected output format for complex tasks

RESPOND ONLY WITH VALID JSON, NO MARKDOWN.`;

/**
 * Analyze prompt using LLM
 */
export async function analyzePromptWithLLM(
    prompt: string,
    apiEndpoint: string = '/api/analyze-prompt'
): Promise<LLMPromptAnalysis> {
    const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
        throw new Error('Failed to analyze prompt');
    }

    const data = await response.json();

    if (!data.success) {
        throw new Error(data.error || 'Analysis failed');
    }

    return data.analysis;
}

/**
 * Get the analyzer system prompt (for API route)
 */
export function getAnalyzerSystemPrompt(): string {
    return ANALYZER_SYSTEM_PROMPT;
}

/**
 * Parse LLM response to analysis object
 */
export function parseAnalysisResponse(response: string): LLMPromptAnalysis {
    try {
        // Clean response - remove markdown if present
        let cleaned = response.trim();
        if (cleaned.startsWith('```')) {
            cleaned = cleaned.replace(/```json?\n?/g, '').replace(/```\n?$/g, '');
        }

        const parsed = JSON.parse(cleaned);

        // Validate structure
        if (typeof parsed.overall !== 'number' || !parsed.breakdown) {
            throw new Error('Invalid response structure');
        }

        return {
            overall: Math.max(0, Math.min(100, parsed.overall)),
            breakdown: {
                clarity: parsed.breakdown.clarity || 50,
                completeness: parsed.breakdown.completeness || 50,
                specificity: parsed.breakdown.specificity || 50,
                effectiveness: parsed.breakdown.effectiveness || 50,
            },
            strengths: parsed.strengths || [],
            weaknesses: parsed.weaknesses || [],
            suggestions: parsed.suggestions || [],
            predictedOutcome: parsed.predictedOutcome || 'Unable to predict outcome',
            confidence: parsed.confidence || 'medium',
        };
    } catch (error) {
        console.error('Failed to parse LLM response:', error);
        // Return fallback
        return {
            overall: 50,
            breakdown: { clarity: 50, completeness: 50, specificity: 50, effectiveness: 50 },
            strengths: ['Unable to analyze'],
            weaknesses: ['Analysis failed'],
            suggestions: ['Try again'],
            predictedOutcome: 'Unable to predict',
            confidence: 'low',
        };
    }
}

/**
 * Get score color (reused from heuristic scorer)
 */
export function getLLMScoreColor(score: number): string {
    if (score >= 80) return '#22c55e';  // Green
    if (score >= 60) return '#eab308';  // Yellow
    if (score >= 40) return '#f97316';  // Orange
    return '#ef4444';  // Red
}

/**
 * Get score label
 */
export function getLLMScoreLabel(score: number): string {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Needs Work';
    if (score >= 20) return 'Poor';
    return 'Very Poor';
}
