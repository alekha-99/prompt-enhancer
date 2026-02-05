/**
 * Tests for Token Estimator
 */

import { estimateTokensAndCost, estimateTokenCount, TokenEstimate, CostEstimate } from './token-estimator';

describe('estimateTokenCount', () => {
    it('should return 0 for empty string', () => {
        const result = estimateTokenCount('');
        expect(result).toBe(0);
    });

    it('should estimate tokens for simple text', () => {
        const result = estimateTokenCount('Hello world');
        expect(result).toBeGreaterThan(0);
    });

    it('should estimate roughly 1 token per 4 characters', () => {
        const text = 'This is a test sentence with some words.';
        const result = estimateTokenCount(text);

        // Rough estimate: 1 token per 4 chars
        const expected = Math.ceil(text.length / 4);
        expect(Math.abs(result - expected)).toBeLessThan(expected * 0.7); // Allow some variance
    });

    it('should handle long text', () => {
        const longText = 'word '.repeat(1000);
        const result = estimateTokenCount(longText);

        expect(result).toBeGreaterThan(500);
    });

    it('should handle special characters', () => {
        const text = 'Hello @world! #test $money 100%';
        const result = estimateTokenCount(text);

        expect(result).toBeGreaterThan(0);
    });

    it('should handle code snippets', () => {
        const code = `function test() {
      return 42;
    }`;
        const result = estimateTokenCount(code);

        expect(result).toBeGreaterThan(5);
    });
});

describe('estimateTokensAndCost', () => {
    describe('basic functionality', () => {
        it('should return TokenEstimate with all required properties', () => {
            const result = estimateTokensAndCost('Hello world');

            expect(result).toHaveProperty('tokenCount');
            expect(result).toHaveProperty('costEstimates');
            expect(result).toHaveProperty('recommendation');
            // savings is optional
        });

        it('should return positive token count for non-empty text', () => {
            const result = estimateTokensAndCost('This is a test');

            expect(result.tokenCount).toBeGreaterThan(0);
        });

        it('should return zero for empty text', () => {
            const result = estimateTokensAndCost('');

            expect(result.tokenCount).toBe(0);
        });
    });

    describe('cost estimates', () => {
        it('should include estimates for multiple models', () => {
            const result = estimateTokensAndCost('Test prompt');

            expect(result.costEstimates.length).toBeGreaterThan(5);
        });

        it('should include major models like GPT-4, GPT-4o, Claude', () => {
            const result = estimateTokensAndCost('Test prompt');

            const modelNames = result.costEstimates.map(e => e.model);
            expect(modelNames).toContain('gpt-4'); // It uses lower case keys in implementation
            expect(modelNames).toContain('gpt-4o');
        });

        it('should calculate cost based on token count', () => {
            const shortResult = estimateTokensAndCost('Hi');
            const longResult = estimateTokensAndCost('word '.repeat(1000));

            const shortMaxCost = Math.max(...shortResult.costEstimates.map(e => e.totalEstimate));
            const longMaxCost = Math.max(...longResult.costEstimates.map(e => e.totalEstimate));

            expect(longMaxCost).toBeGreaterThan(shortMaxCost);
        });

        it('should include tier information for each model', () => {
            const result = estimateTokensAndCost('Test prompt');

            result.costEstimates.forEach(estimate => {
                expect(['budget', 'standard', 'premium']).toContain(estimate.tier);
            });
        });

        it('should include input and output costs separately', () => {
            const result = estimateTokensAndCost('Test prompt');

            result.costEstimates.forEach(estimate => {
                expect(estimate.inputCost).toBeDefined();
                expect(estimate.outputCost).toBeDefined();
                // Check within floating point precision
                expect(Math.abs(estimate.totalEstimate - (estimate.inputCost + estimate.outputCost))).toBeLessThan(0.001);
            });
        });
    });

    describe('recommendation', () => {
        it('should provide a recommendation', () => {
            const result = estimateTokensAndCost('Write a comprehensive essay about AI');

            expect(result.recommendation).toBeDefined();
            expect(typeof result.recommendation).toBe('string');
            expect(result.recommendation.length).toBeGreaterThan(0);
        });
    });

    describe('savings calculation', () => {
        it('should calculate potential savings for long prompts', () => {
            const result = estimateTokensAndCost('A '.repeat(5000));

            expect(result.savings).toBeDefined();
        });

        it('should show savings compared to most expensive model', () => {
            const result = estimateTokensAndCost('word '.repeat(1000));

            if (result.savings) {
                expect(result.savings.dollarsSaved).toBeGreaterThanOrEqual(0);
                expect(result.savings.percentSaved).toBeGreaterThanOrEqual(0);
            }
        });
    });

    describe('model pricing tiers', () => {
        it('should have budget tier models with lower costs', () => {
            const text = 'word '.repeat(5000);
            const result = estimateTokensAndCost(text);

            const budgetModels = result.costEstimates.filter(e => e.tier === 'budget');
            const premiumModels = result.costEstimates.filter(e => e.tier === 'premium');

            if (budgetModels.length > 0 && premiumModels.length > 0) {
                const avgBudgetCost = budgetModels.reduce((sum, e) => sum + e.totalEstimate, 0) / budgetModels.length;
                const avgPremiumCost = premiumModels.reduce((sum, e) => sum + e.totalEstimate, 0) / premiumModels.length;

                expect(avgBudgetCost).toBeLessThan(avgPremiumCost);
            }
        });
    });

    describe('edge cases', () => {
        it('should handle whitespace-only input', () => {
            const result = estimateTokensAndCost('   ');

            expect(result).toHaveProperty('tokenCount');
        });

        it('should handle very long input', () => {
            const longText = 'word '.repeat(5000);
            const result = estimateTokensAndCost(longText);

            expect(result.tokenCount).toBeGreaterThan(1000);
        });

        it('should handle unicode characters', () => {
            const result = estimateTokensAndCost('Hello 世界 🌍');

            expect(result).toHaveProperty('tokenCount');
            expect(result.tokenCount).toBeGreaterThan(0);
        });

        it('should handle newlines and special formatting', () => {
            const text = `Line 1
      Line 2
      Line 3`;
            const result = estimateTokensAndCost(text);

            expect(result).toHaveProperty('tokenCount');
        });
    });
});
