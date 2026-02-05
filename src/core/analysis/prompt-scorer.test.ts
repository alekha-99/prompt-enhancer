/**
 * Tests for Prompt Scorer
 */

import { analyzePrompt, PromptScore } from './prompt-scorer';

describe('analyzePrompt', () => {
    describe('basic functionality', () => {
        it('should return a score object with all required properties', () => {
            const result = analyzePrompt('Write a function to sort an array');

            expect(result).toHaveProperty('overall');
            expect(result).toHaveProperty('breakdown');
            expect(result).toHaveProperty('suggestions');
            expect(result).toHaveProperty('strengths');
            expect(result).toHaveProperty('weaknesses');
        });

        it('should return overall score between 0 and 100', () => {
            const result = analyzePrompt('Create a React component');

            expect(result.overall).toBeGreaterThanOrEqual(0);
            expect(result.overall).toBeLessThanOrEqual(100);
        });

        it('should return low score for empty prompt', () => {
            const result = analyzePrompt('');

            expect(result.overall).toBeLessThan(60);
            expect(result.suggestions.length).toBeGreaterThan(0);
        });

        it('should return low score for whitespace-only prompt', () => {
            const result = analyzePrompt('   ');

            expect(result.overall).toBeLessThan(60);
            expect(result.suggestions.length).toBeGreaterThan(0);
        });
    });

    describe('clarity dimension', () => {
        it('should score higher for prompts with clear action verbs', () => {
            const clearPrompt = 'Create a function that calculates the factorial of a number';
            const unclearPrompt = 'factorial thing';

            const clearResult = analyzePrompt(clearPrompt);
            const unclearResult = analyzePrompt(unclearPrompt);

            expect(clearResult.breakdown.clarity).toBeGreaterThan(unclearResult.breakdown.clarity);
        });

        it('should detect action verbs like create, write, explain', () => {
            const result = analyzePrompt('Explain how async/await works in JavaScript');

            expect(result.breakdown.clarity).toBeGreaterThan(50);
        });
    });

    describe('specificity dimension', () => {
        it('should score higher for prompts with specific details', () => {
            const specificPrompt = 'Write a rigid Python 3 function to strictly validate email addresses using the "re" standard library module. It must follow RFC 5322 specifications exactly, return a boolean, and handle edge cases including empty strings and unicode characters.';
            const vaguePrompt = 'emails stuff';

            const specificResult = analyzePrompt(specificPrompt);
            const vagueResult = analyzePrompt(vaguePrompt);

            expect(specificResult.breakdown.specificity).toBeGreaterThan(vagueResult.breakdown.specificity);
        });

        it('should penalize vague words like something, stuff, things', () => {
            const vaguePrompt = 'Do something with this stuff and make it better somehow';
            const result = analyzePrompt(vaguePrompt);

            expect(result.breakdown.specificity).toBeLessThan(60);
        });
    });

    describe('context dimension', () => {
        it('should score higher for prompts with role specification', () => {
            const withRole = 'You are an expert Python developer. Write a function to parse JSON.';
            const withoutRole = 'Write a function to parse JSON';

            const withRoleResult = analyzePrompt(withRole);
            const withoutRoleResult = analyzePrompt(withoutRole);

            expect(withRoleResult.breakdown.context).toBeGreaterThan(withoutRoleResult.breakdown.context);
        });

        it('should detect role patterns like "you are", "act as"', () => {
            const result = analyzePrompt('Act as a senior software architect. Review this code.');

            expect(result.breakdown.context).toBeGreaterThan(50);
        });
    });

    describe('structure dimension', () => {
        it('should score higher for prompts with output format specification', () => {
            const withFormat = 'List 5 programming languages. Format: bullet points with brief descriptions.';
            const withoutFormat = 'List some programming languages';

            const withFormatResult = analyzePrompt(withFormat);
            const withoutFormatResult = analyzePrompt(withoutFormat);

            expect(withFormatResult.breakdown.structure).toBeGreaterThan(withoutFormatResult.breakdown.structure);
        });

        it('should detect format specifications like JSON, markdown, bullet points', () => {
            const result = analyzePrompt('Analyze this data and return the result in JSON format');

            expect(result.breakdown.structure).toBeGreaterThan(40);
        });
    });

    describe('actionability dimension', () => {
        it('should score higher for prompts with step-by-step requests', () => {
            const withSteps = 'Explain step by step how to deploy a Node.js app to AWS';
            const withoutSteps = 'How to deploy to AWS';

            const withStepsResult = analyzePrompt(withSteps);
            const withoutStepsResult = analyzePrompt(withoutSteps);

            expect(withStepsResult.breakdown.actionability).toBeGreaterThan(withoutStepsResult.breakdown.actionability);
        });
    });

    describe('suggestions generation', () => {
        it('should generate suggestions for improvement', () => {
            const result = analyzePrompt('help me with code');

            expect(result.suggestions.length).toBeGreaterThan(0);
        });

        it('should suggest adding role for prompts without one', () => {
            const result = analyzePrompt('Write a function');

            const hasRoleSuggestion = result.suggestions.some(s =>
                s.message.toLowerCase().includes('role') || s.message.toLowerCase().includes('expert')
            );
            expect(hasRoleSuggestion).toBe(true);
        });
    });

    describe('strengths detection', () => {
        it('should detect strengths in well-formed prompts', () => {
            const goodPrompt = 'You are a senior React developer. Create a reusable button component with TypeScript. Include props for variant, size, and onClick handler. Return the code in a code block.';
            const result = analyzePrompt(goodPrompt);

            expect(result.strengths.length).toBeGreaterThan(0);
        });
    });

    describe('weaknesses detection', () => {
        it('should detect weaknesses in poorly-formed prompts', () => {
            const badPrompt = 'do stuff';
            const result = analyzePrompt(badPrompt);

            expect(result.weaknesses.length).toBeGreaterThan(0);
        });
    });

    describe('edge cases', () => {
        it('should handle very long prompts', () => {
            const longPrompt = 'Write a function '.repeat(100);
            const result = analyzePrompt(longPrompt);

            expect(result).toHaveProperty('overall');
            expect(typeof result.overall).toBe('number');
        });

        it('should handle prompts with special characters', () => {
            const specialPrompt = 'Write a regex to match emails: test@example.com (with @, ., _ symbols)';
            const result = analyzePrompt(specialPrompt);

            expect(result).toHaveProperty('overall');
        });

        it('should handle prompts with unicode characters', () => {
            const unicodePrompt = 'Translate "Hello 世界" to Spanish 🌍';
            const result = analyzePrompt(unicodePrompt);

            expect(result).toHaveProperty('overall');
        });
    });
});
