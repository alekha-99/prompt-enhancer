/**
 * Tests for Smart Suggestion Engine
 */

import {
    generateSuggestions,
    applyQuickFix,
    getCategoryIcon,
    Suggestion,
    QuickFix
} from './suggestion-engine';

describe('generateSuggestions', () => {
    describe('basic functionality', () => {
        it('should return an array of suggestions', () => {
            const result = generateSuggestions('Write something');

            expect(Array.isArray(result)).toBe(true);
        });

        it('should return suggestions for empty prompt', () => {
            const result = generateSuggestions('');

            // Empty prompt still returns suggestions array
            expect(Array.isArray(result)).toBe(true);
        });

        it('should return suggestions for very short prompts', () => {
            const result = generateSuggestions('hi');

            // Short prompts still return suggestions array
            expect(Array.isArray(result)).toBe(true);
        });

        it('should return suggestions with all required properties', () => {
            const result = generateSuggestions('help me with something');

            result.forEach(suggestion => {
                expect(suggestion).toHaveProperty('id');
                expect(suggestion).toHaveProperty('type');
                expect(suggestion).toHaveProperty('category');
                expect(suggestion).toHaveProperty('title');
                expect(suggestion).toHaveProperty('description');
                expect(suggestion).toHaveProperty('priority');
            });
        });
    });

    describe('role specification detection', () => {
        it('should suggest adding role for prompts without one', () => {
            const result = generateSuggestions('Write a function to sort an array');

            const roleSuggestion = result.find(s => s.id === 'add-role');
            expect(roleSuggestion).toBeDefined();
        });

        it('should NOT suggest adding role when role is present', () => {
            const result = generateSuggestions('You are an expert developer. Write a function.');

            const roleSuggestion = result.find(s => s.id === 'add-role');
            expect(roleSuggestion).toBeUndefined();
        });

        it('should detect "act as" role pattern', () => {
            const result = generateSuggestions('Act as a senior engineer. Review this code.');

            const roleSuggestion = result.find(s => s.id === 'add-role');
            expect(roleSuggestion).toBeUndefined();
        });
    });

    describe('output format detection', () => {
        it('should suggest adding format for prompts without one', () => {
            const result = generateSuggestions('List the top programming languages');

            const formatSuggestion = result.find(s => s.id === 'add-format');
            expect(formatSuggestion).toBeDefined();
        });

        it('should NOT suggest format when format is specified', () => {
            const result = generateSuggestions('List the top languages in JSON format');

            const formatSuggestion = result.find(s => s.id === 'add-format');
            expect(formatSuggestion).toBeUndefined();
        });

        it('should detect markdown format specification', () => {
            const result = generateSuggestions('Write this in markdown with bullet points');

            const formatSuggestion = result.find(s => s.id === 'add-format');
            expect(formatSuggestion).toBeUndefined();
        });
    });

    describe('examples detection', () => {
        it('should suggest adding examples for longer prompts without them', () => {
            // Need > 15 words
            const result = generateSuggestions('Write a function that transforms data from format A to format B based on certain complex business rules and conditions');

            const exampleSuggestion = result.find(s => s.id === 'add-examples');
            expect(exampleSuggestion).toBeDefined();
        });

        it('should NOT suggest examples when "for example" is present', () => {
            const result = generateSuggestions('Transform data for example input: 123 should become output: ABC');

            const exampleSuggestion = result.find(s => s.id === 'add-examples');
            expect(exampleSuggestion).toBeUndefined();
        });
    });

    describe('vague language detection', () => {
        it('should warn about vague words like "something", "stuff"', () => {
            const result = generateSuggestions('Do something with this stuff');

            const vagueSuggestion = result.find(s => s.id === 'remove-vague');
            expect(vagueSuggestion).toBeDefined();
        });

        it('should NOT warn when no vague words present', () => {
            const result = generateSuggestions('Create a React component for user authentication');

            const vagueSuggestion = result.find(s => s.id === 'remove-vague');
            expect(vagueSuggestion).toBeUndefined();
        });
    });

    describe('action verb detection', () => {
        it('should suggest adding action verb when missing', () => {
            const result = generateSuggestions('the sorting algorithm implementation');

            const actionSuggestion = result.find(s => s.id === 'add-action');
            expect(actionSuggestion).toBeDefined();
        });

        it('should NOT suggest action verb when present', () => {
            const result = generateSuggestions('Create a sorting algorithm');

            const actionSuggestion = result.find(s => s.id === 'add-action');
            expect(actionSuggestion).toBeUndefined();
        });

        it('should detect common action verbs like write, create, explain', () => {
            const verbs = ['Write', 'Create', 'Explain', 'Analyze', 'Build'];

            verbs.forEach(verb => {
                const result = generateSuggestions(`${verb} a test function`);
                const actionSuggestion = result.find(s => s.id === 'add-action');
                expect(actionSuggestion).toBeUndefined();
            });
        });
    });

    describe('constraints detection', () => {
        it('should suggest adding constraints for longer prompts', () => {
            // Need > 20 words
            const result = generateSuggestions('Write a comprehensive comprehensive comprehensive comprehensive comprehensive comprehensive guide to React hooks including useState useEffect useContext and custom hooks and many other things');

            const constraintSuggestion = result.find(s => s.id === 'add-constraints');
            expect(constraintSuggestion).toBeDefined();
        });

        it('should NOT suggest constraints when present', () => {
            const result = generateSuggestions('Write a guide about React. Keep it concise, maximum 500 words.');

            const constraintSuggestion = result.find(s => s.id === 'add-constraints');
            expect(constraintSuggestion).toBeUndefined();
        });
    });

    describe('context detection', () => {
        it('should suggest adding context for prompts without background', () => {
            // Need > 10 words
            const result = generateSuggestions('Write a function to process the user data transformation and handle errors gracefully');

            const contextSuggestion = result.find(s => s.id === 'add-context');
            expect(contextSuggestion).toBeDefined();
        });

        it('should NOT suggest context when provided', () => {
            const result = generateSuggestions('I am building a React app. I need a function to validate emails.');

            const contextSuggestion = result.find(s => s.id === 'add-context');
            expect(contextSuggestion).toBeUndefined();
        });
    });

    describe('short prompt detection', () => {
        it('should warn about too short prompts', () => {
            const result = generateSuggestions('sort array');

            const shortSuggestion = result.find(s => s.id === 'too-short');
            expect(shortSuggestion).toBeDefined();
        });

        it('should NOT warn for prompts with enough detail', () => {
            const result = generateSuggestions('Create a JavaScript function that sorts an array of objects by their date property in descending order');

            const shortSuggestion = result.find(s => s.id === 'too-short');
            expect(shortSuggestion).toBeUndefined();
        });
    });

    describe('step-by-step detection', () => {
        it('should suggest steps for complex task prompts', () => {
            // Need > 10 words
            const result = generateSuggestions('How to build a complete authentication system with login and registration pages using React');

            const stepsSuggestion = result.find(s => s.id === 'add-steps');
            expect(stepsSuggestion).toBeDefined();
        });

        it('should NOT suggest steps when already requested', () => {
            const result = generateSuggestions('How to build an auth system step by step');

            const stepsSuggestion = result.find(s => s.id === 'add-steps');
            expect(stepsSuggestion).toBeUndefined();
        });
    });

    describe('priority sorting', () => {
        it('should sort suggestions by priority (high first)', () => {
            const result = generateSuggestions('stuff things');

            if (result.length >= 2) {
                const priorities = result.map(s => s.priority);
                const priorityOrder = { high: 0, medium: 1, low: 2 };

                for (let i = 1; i < priorities.length; i++) {
                    expect(priorityOrder[priorities[i]]).toBeGreaterThanOrEqual(priorityOrder[priorities[i - 1]]);
                }
            }
        });
    });

    describe('quick fixes', () => {
        it('should provide quick fixes for applicable suggestions', () => {
            const result = generateSuggestions('sort the array please');

            const withQuickFix = result.filter(s => s.quickFix !== undefined);
            expect(withQuickFix.length).toBeGreaterThan(0);
        });

        it('quick fix should have required properties', () => {
            const result = generateSuggestions('sort array');

            result.forEach(suggestion => {
                if (suggestion.quickFix) {
                    expect(suggestion.quickFix).toHaveProperty('label');
                    expect(suggestion.quickFix).toHaveProperty('textToInsert');
                    expect(suggestion.quickFix).toHaveProperty('position');
                }
            });
        });
    });
});

describe('applyQuickFix', () => {
    it('should add text at start for position "start"', () => {
        const quickFix: QuickFix = {
            label: 'Add role',
            textToInsert: 'You are an expert. ',
            position: 'start',
        };

        const result = applyQuickFix('Write code', quickFix);

        expect(result).toBe('You are an expert. Write code');
    });

    it('should add text at end for position "end"', () => {
        const quickFix: QuickFix = {
            label: 'Add format',
            textToInsert: ' Format as JSON.',
            position: 'end',
        };

        const result = applyQuickFix('List items', quickFix);

        expect(result).toBe('List items Format as JSON.');
    });

    it('should replace text for position "replace"', () => {
        const quickFix: QuickFix = {
            label: 'Replace',
            textToInsert: 'New prompt text',
            position: 'replace',
        };

        const result = applyQuickFix('Old prompt', quickFix);

        expect(result).toBe('New prompt text');
    });
});

describe('getCategoryIcon', () => {
    it('should return an icon for each category', () => {
        const categories = ['role', 'context', 'format', 'specificity', 'examples', 'constraints', 'clarity'] as const;

        categories.forEach(category => {
            const icon = getCategoryIcon(category);
            expect(icon).toBeDefined();
            expect(typeof icon).toBe('string');
        });
    });
});
