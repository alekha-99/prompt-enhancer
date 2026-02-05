/**
 * Tests for LLM Analyzer
 */

import {
    parseAnalysisResponse,
    getAnalyzerSystemPrompt,
    getLLMScoreColor,
    getLLMScoreLabel,
    LLMPromptAnalysis
} from './llm-analyzer';

describe('getAnalyzerSystemPrompt', () => {
    it('should return a non-empty string', () => {
        const result = getAnalyzerSystemPrompt();

        expect(typeof result).toBe('string');
        expect(result.length).toBeGreaterThan(100);
    });

    it('should contain scoring criteria', () => {
        const result = getAnalyzerSystemPrompt();

        expect(result.toLowerCase()).toContain('score');
    });

    it('should mention JSON format requirement', () => {
        const result = getAnalyzerSystemPrompt();

        expect(result.toLowerCase()).toContain('json');
    });

    it('should include scoring dimensions', () => {
        const result = getAnalyzerSystemPrompt();

        expect(result.toLowerCase()).toContain('clarity');
    });
});

describe('parseAnalysisResponse', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        // Silence console.error for expected errors
        jest.spyOn(console, 'error').mockImplementation(() => { });
    });

    afterEach(() => {
        jest.restoreAllMocks();
    });
    it('should parse valid JSON response', () => {
        const validResponse = JSON.stringify({
            overall: 75,
            breakdown: {
                clarity: 80,
                completeness: 70,
                specificity: 75,
                effectiveness: 75,
            },
            strengths: ['Clear objective', 'Good structure'],
            weaknesses: ['Could be more specific'],
            suggestions: ['Add more context'],
            predictedOutcome: 'Good quality response expected',
            confidence: 'high',
        });

        const result = parseAnalysisResponse(validResponse);

        expect(result.overall).toBe(75);
        expect(result.breakdown.clarity).toBe(80);
        expect(result.strengths).toHaveLength(2);
        expect(result.weaknesses).toHaveLength(1);
        expect(result.suggestions).toHaveLength(1);
        expect(result.predictedOutcome).toBeDefined();
        expect(result.confidence).toBe('high');
    });

    it('should handle JSON wrapped in code blocks', () => {
        const wrappedResponse = `\`\`\`json
{
  "overall": 60,
  "breakdown": {
    "clarity": 60,
    "completeness": 60,
    "specificity": 60,
    "effectiveness": 60
  },
  "strengths": ["Test"],
  "weaknesses": ["Test"],
  "suggestions": ["Test"],
  "predictedOutcome": "Test",
  "confidence": "medium"
}
\`\`\``;

        const result = parseAnalysisResponse(wrappedResponse);

        expect(result.overall).toBe(60);
    });

    it('should return default values for invalid JSON', () => {
        const invalidResponse = 'This is not JSON';

        const result = parseAnalysisResponse(invalidResponse);

        expect(result).toHaveProperty('overall');
        expect(result).toHaveProperty('breakdown');
        expect(typeof result.overall).toBe('number');
    });

    it('should handle empty response', () => {
        const result = parseAnalysisResponse('');

        expect(result).toHaveProperty('overall');
        expect(result).toHaveProperty('breakdown');
    });

    it('should handle partial JSON with defaults', () => {
        const partialResponse = JSON.stringify({
            overall: 50,
            breakdown: {
                clarity: 50,
                completeness: 50,
                specificity: 50,
                effectiveness: 50,
            },
        });

        const result = parseAnalysisResponse(partialResponse);

        expect(result.overall).toBe(50);
        // Should have defaults for missing fields
        expect(result.strengths).toBeDefined();
        expect(result.weaknesses).toBeDefined();
    });

    it('should cap score at 100', () => {
        const outOfRangeResponse = JSON.stringify({
            overall: 150,
            breakdown: {
                clarity: 50,
                completeness: 50,
                specificity: 50,
                effectiveness: 50,
            },
            strengths: [],
            weaknesses: [],
            suggestions: [],
            predictedOutcome: 'Test',
            confidence: 'low',
        });

        const result = parseAnalysisResponse(outOfRangeResponse);

        expect(result.overall).toBeLessThanOrEqual(100);
    });

    it('should cap score at 0 minimum', () => {
        const negativeResponse = JSON.stringify({
            overall: -10,
            breakdown: {
                clarity: 50,
                completeness: 50,
                specificity: 50,
                effectiveness: 50,
            },
            strengths: [],
            weaknesses: [],
            suggestions: [],
            predictedOutcome: 'Test',
            confidence: 'low',
        });

        const result = parseAnalysisResponse(negativeResponse);

        expect(result.overall).toBeGreaterThanOrEqual(0);
    });

    describe('breakdown validation', () => {
        it('should have all required breakdown dimensions', () => {
            const response = JSON.stringify({
                overall: 80,
                breakdown: {
                    clarity: 80,
                    completeness: 75,
                    specificity: 85,
                    effectiveness: 80,
                },
                strengths: [],
                weaknesses: [],
                suggestions: [],
                predictedOutcome: 'Test',
                confidence: 'high',
            });

            const result = parseAnalysisResponse(response);

            expect(result.breakdown).toHaveProperty('clarity');
            expect(result.breakdown).toHaveProperty('completeness');
            expect(result.breakdown).toHaveProperty('specificity');
            expect(result.breakdown).toHaveProperty('effectiveness');
        });
    });

    describe('confidence validation', () => {
        it('should accept valid confidence values', () => {
            const validConfidences = ['low', 'medium', 'high'];

            validConfidences.forEach(confidence => {
                const response = JSON.stringify({
                    overall: 50,
                    breakdown: {
                        clarity: 50,
                        completeness: 50,
                        specificity: 50,
                        effectiveness: 50,
                    },
                    strengths: [],
                    weaknesses: [],
                    suggestions: [],
                    predictedOutcome: 'Test',
                    confidence,
                });

                const result = parseAnalysisResponse(response);
                expect(['low', 'medium', 'high']).toContain(result.confidence);
            });
        });
    });
});

describe('getLLMScoreColor', () => {
    it('should return green for excellent scores', () => {
        const result = getLLMScoreColor(85);

        expect(result).toBe('#22c55e');
    });

    it('should return yellow for good scores', () => {
        const result = getLLMScoreColor(65);

        expect(result).toBe('#eab308');
    });

    it('should return orange for fair scores', () => {
        const result = getLLMScoreColor(45);

        expect(result).toBe('#f97316');
    });

    it('should return red for poor scores', () => {
        const result = getLLMScoreColor(20);

        expect(result).toBe('#ef4444');
    });
});

describe('getLLMScoreLabel', () => {
    it('should return Excellent for high scores', () => {
        const result = getLLMScoreLabel(85);

        expect(result).toBe('Excellent');
    });

    it('should return Good for medium-high scores', () => {
        const result = getLLMScoreLabel(65);

        expect(result).toBe('Good');
    });

    it('should return Needs Work for medium scores', () => {
        const result = getLLMScoreLabel(45);

        expect(result).toBe('Needs Work');
    });

    it('should return Poor for low scores', () => {
        const result = getLLMScoreLabel(25);

        expect(result).toBe('Poor');
    });

    it('should return Very Poor for very low scores', () => {
        const result = getLLMScoreLabel(10);

        expect(result).toBe('Very Poor');
    });
});
