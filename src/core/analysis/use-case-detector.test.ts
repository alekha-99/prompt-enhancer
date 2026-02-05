/**
 * Tests for Use Case Detector
 */

import { detectUseCase, UseCaseDetection } from './use-case-detector';

describe('detectUseCase', () => {
    describe('basic functionality', () => {
        it('should return detection object with all required properties', () => {
            const result = detectUseCase('Write a function');

            expect(result).toHaveProperty('primary');
            expect(result).toHaveProperty('confidence');
            expect(result).toHaveProperty('secondary');
            expect(result).toHaveProperty('keywords');
            expect(result).toHaveProperty('icon');
            expect(result).toHaveProperty('color');
            expect(result).toHaveProperty('suggestedModel');
        });

        it('should return confidence between 0 and 100', () => {
            const result = detectUseCase('Create a React component with TypeScript');

            expect(result.confidence).toBeGreaterThanOrEqual(0);
            expect(result.confidence).toBeLessThanOrEqual(100);
        });
    });

    describe('coding detection', () => {
        it('should detect coding use case for programming prompts', () => {
            const result = detectUseCase('Write a JavaScript function to sort an array');

            expect(result.primary).toBe('coding');
        });

        it('should detect coding for debugging prompts', () => {
            const result = detectUseCase('Debug this Python code that has an error');

            expect(result.primary).toBe('coding');
        });

        it('should detect coding for API-related prompts', () => {
            const result = detectUseCase('Create a REST API endpoint for user authentication');

            expect(result.primary).toBe('coding');
        });

        it('should suggest GPT-4 for coding tasks', () => {
            const result = detectUseCase('Implement a binary search tree in TypeScript');

            expect(result.suggestedModel).toContain('GPT');
        });
    });

    describe('creative detection', () => {
        it('should detect creative use case for story prompts', () => {
            const result = detectUseCase('Write a short story about a dragon');

            expect(result.primary).toBe('creative');
        });

        it('should detect creative for poetry prompts', () => {
            const result = detectUseCase('Write a poem about the sunset');

            expect(result.primary).toBe('creative');
        });

        it('should detect creative for character development', () => {
            const result = detectUseCase('Create a character for my fantasy novel');

            expect(result.primary).toBe('creative');
        });

        it('should suggest Claude for creative tasks', () => {
            const result = detectUseCase('Write a creative narrative about space exploration');

            expect(result.suggestedModel).toContain('Claude');
        });
    });

    describe('analysis detection', () => {
        it('should detect analysis use case for data analysis prompts', () => {
            const result = detectUseCase('Analyze this dataset and find patterns');

            expect(result.primary).toBe('analysis');
        });

        it('should detect analysis for comparison prompts', () => {
            // Avoid tech terms that trigger 'coding'
            const result = detectUseCase('Compare the benefits of solar energy vs wind energy');

            expect(result.primary).toBe('analysis');
        });

        it('should detect analysis for statistical prompts', () => {
            const result = detectUseCase('Calculate the statistical significance of this data');

            expect(result.primary).toBe('analysis');
        });
    });

    describe('writing detection', () => {
        it('should detect writing use case for essay prompts', () => {
            const result = detectUseCase('Write an essay about climate change');

            expect(result.primary).toBe('writing');
        });

        it('should detect writing for summarization prompts', () => {
            const result = detectUseCase('Summarize this article in 3 paragraphs');

            expect(result.primary).toBe('writing');
        });

        it('should detect writing for blog post prompts', () => {
            const result = detectUseCase('Write a blog post about remote work benefits');

            expect(result.primary).toBe('writing');
        });
    });

    describe('marketing detection', () => {
        it('should detect marketing use case for ad copy prompts', () => {
            const result = detectUseCase('Write an ad copy for our new product launch');

            expect(result.primary).toBe('marketing');
        });

        it('should detect marketing for SEO prompts', () => {
            const result = detectUseCase('Develop a comprehensive digital marketing strategy including SEO and ad campaigns');

            expect(result.primary).toBe('marketing');
        });

        it('should detect marketing for campaign prompts', () => {
            const result = detectUseCase('Design a marketing campaign for social media');

            expect(result.primary).toBe('marketing');
        });
    });

    describe('education detection', () => {
        it('should detect education use case for teaching prompts', () => {
            const result = detectUseCase('Explain quantum physics to a beginner');

            expect(result.primary).toBe('education');
        });

        it('should detect education for tutorial prompts', () => {
            const result = detectUseCase('Create a tutorial for learning Python');

            expect(result.primary).toBe('education');
        });

        it('should detect education for lesson plan prompts', () => {
            const result = detectUseCase('Design a lesson plan for teaching fractions');

            expect(result.primary).toBe('education');
        });
    });

    describe('business detection', () => {
        it('should detect business use case for strategy prompts', () => {
            const result = detectUseCase('Develop a business strategy for market expansion');

            expect(result.primary).toBe('business');
        });

        it('should detect business for proposal prompts', () => {
            const result = detectUseCase('Write a business proposal for the stakeholders');

            expect(result.primary).toBe('business');
        });
    });

    describe('general detection', () => {
        it('should detect general use case for ambiguous prompts', () => {
            const result = detectUseCase('Help me with this');

            expect(result.primary).toBe('general');
        });

        it('should have lower confidence for general prompts', () => {
            const result = detectUseCase('what is this');

            expect(result.confidence).toBeLessThan(70);
        });
    });

    describe('secondary detection', () => {
        it('should detect secondary use cases for mixed prompts', () => {
            const result = detectUseCase('Write a technical blog post with code examples about React hooks');

            // Should have a secondary use case
            expect(result.secondary).toBeDefined();
        });
    });

    describe('keyword extraction', () => {
        it('should extract relevant keywords from the prompt', () => {
            const result = detectUseCase('Create a Python function to process JSON data');

            expect(result.keywords.length).toBeGreaterThan(0);
        });
    });

    describe('icon and color', () => {
        it('should return appropriate icon and color for each use case', () => {
            const codingResult = detectUseCase('Write code');
            const creativeResult = detectUseCase('Write a story');

            expect(codingResult.icon).toBeDefined();
            expect(codingResult.color).toBeDefined();
            expect(creativeResult.icon).toBeDefined();
            expect(creativeResult.color).toBeDefined();
        });
    });

    describe('edge cases', () => {
        it('should handle empty prompt', () => {
            const result = detectUseCase('');

            expect(result).toHaveProperty('primary');
            expect(result.primary).toBe('general');
        });

        it('should handle very short prompts', () => {
            const result = detectUseCase('hi');

            expect(result).toHaveProperty('primary');
        });

        it('should handle very long prompts', () => {
            const longPrompt = 'Write a comprehensive analysis of '.repeat(50);
            const result = detectUseCase(longPrompt);

            expect(result).toHaveProperty('primary');
        });
    });
});
