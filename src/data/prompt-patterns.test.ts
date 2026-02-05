/**
 * Tests for Prompt Patterns Library
 */

import {
    PROMPT_PATTERNS,
    PATTERN_CATEGORIES,
    PromptPattern,
    PatternCategory,
    getPatternsByCategory,
    searchPatterns,
    getTopPatterns,
} from './prompt-patterns';

describe('PROMPT_PATTERNS', () => {
    it('should have more than 10 patterns', () => {
        expect(PROMPT_PATTERNS.length).toBeGreaterThan(10);
    });

    it('all patterns should have required properties', () => {
        PROMPT_PATTERNS.forEach(pattern => {
            expect(pattern).toHaveProperty('id');
            expect(pattern).toHaveProperty('name');
            expect(pattern).toHaveProperty('category');
            expect(pattern).toHaveProperty('description');
            expect(pattern).toHaveProperty('template');
            expect(pattern).toHaveProperty('example');
            expect(pattern).toHaveProperty('tags');
            expect(pattern).toHaveProperty('effectiveness');
            expect(pattern).toHaveProperty('difficulty');
        });
    });

    it('all pattern IDs should be unique', () => {
        const ids = PROMPT_PATTERNS.map(p => p.id);
        const uniqueIds = new Set(ids);

        expect(ids.length).toBe(uniqueIds.size);
    });

    it('all templates should contain placeholders or be usable as-is', () => {
        PROMPT_PATTERNS.forEach(pattern => {
            expect(pattern.template.length).toBeGreaterThan(10);
        });
    });

    it('all examples should be non-empty', () => {
        PROMPT_PATTERNS.forEach(pattern => {
            expect(pattern.example.length).toBeGreaterThan(10);
        });
    });

    it('all patterns should have at least one tag', () => {
        PROMPT_PATTERNS.forEach(pattern => {
            expect(pattern.tags.length).toBeGreaterThan(0);
        });
    });

    it('effectiveness should be valid value', () => {
        const validEffectiveness = ['high', 'medium', 'standard'];

        PROMPT_PATTERNS.forEach(pattern => {
            expect(validEffectiveness).toContain(pattern.effectiveness);
        });
    });

    it('difficulty should be valid value', () => {
        const validDifficulty = ['beginner', 'intermediate', 'advanced'];

        PROMPT_PATTERNS.forEach(pattern => {
            expect(validDifficulty).toContain(pattern.difficulty);
        });
    });
});

describe('PATTERN_CATEGORIES', () => {
    it('should have all required categories', () => {
        const requiredCategories = ['reasoning', 'structure', 'context', 'output', 'interaction', 'specialized'];

        requiredCategories.forEach(category => {
            expect(PATTERN_CATEGORIES).toHaveProperty(category);
        });
    });

    it('each category should have label, icon, and color', () => {
        Object.values(PATTERN_CATEGORIES).forEach(category => {
            expect(category).toHaveProperty('label');
            expect(category).toHaveProperty('icon');
            expect(category).toHaveProperty('color');
        });
    });

    it('each category icon should be an emoji or symbol', () => {
        Object.values(PATTERN_CATEGORIES).forEach(category => {
            expect(category.icon.length).toBeGreaterThan(0);
        });
    });

    it('each category color should be a valid hex color', () => {
        Object.values(PATTERN_CATEGORIES).forEach(category => {
            expect(category.color).toMatch(/^#[0-9a-fA-F]{6}$/);
        });
    });
});

describe('getPatternsByCategory', () => {
    it('should return patterns for reasoning category', () => {
        const result = getPatternsByCategory('reasoning');

        expect(result.length).toBeGreaterThan(0);
        result.forEach(pattern => {
            expect(pattern.category).toBe('reasoning');
        });
    });

    it('should return patterns for structure category', () => {
        const result = getPatternsByCategory('structure');

        expect(result.length).toBeGreaterThan(0);
        result.forEach(pattern => {
            expect(pattern.category).toBe('structure');
        });
    });

    it('should return patterns for context category', () => {
        const result = getPatternsByCategory('context');

        expect(result.length).toBeGreaterThan(0);
        result.forEach(pattern => {
            expect(pattern.category).toBe('context');
        });
    });

    it('should return patterns for output category', () => {
        const result = getPatternsByCategory('output');

        expect(result.length).toBeGreaterThan(0);
        result.forEach(pattern => {
            expect(pattern.category).toBe('output');
        });
    });

    it('should return patterns for interaction category', () => {
        const result = getPatternsByCategory('interaction');

        expect(result.length).toBeGreaterThan(0);
        result.forEach(pattern => {
            expect(pattern.category).toBe('interaction');
        });
    });

    it('should return patterns for specialized category', () => {
        const result = getPatternsByCategory('specialized');

        expect(result.length).toBeGreaterThan(0);
        result.forEach(pattern => {
            expect(pattern.category).toBe('specialized');
        });
    });

    it('should return empty array for non-existent category', () => {
        // @ts-expect-error Testing invalid category
        const result = getPatternsByCategory('nonexistent');

        expect(result).toHaveLength(0);
    });
});

describe('searchPatterns', () => {
    it('should find patterns by name', () => {
        const result = searchPatterns('chain of thought');

        expect(result.length).toBeGreaterThan(0);
        expect(result.some(p => p.name.toLowerCase().includes('chain'))).toBe(true);
    });

    it('should find patterns by description', () => {
        const result = searchPatterns('reasoning'); // Valid search term in description

        expect(result.length).toBeGreaterThan(0);
    });

    it('should find patterns by tags', () => {
        const result = searchPatterns('reasoning');

        expect(result.length).toBeGreaterThan(0);
    });

    it('should be case insensitive', () => {
        const lowerResult = searchPatterns('code');
        const upperResult = searchPatterns('CODE');

        expect(lowerResult.length).toBe(upperResult.length);
    });

    it('should return empty array for no matches', () => {
        const result = searchPatterns('xyznonexistentpattern123');

        expect(result).toHaveLength(0);
    });

    it('should find patterns with partial matches', () => {
        const result = searchPatterns('few');

        expect(result.length).toBeGreaterThan(0);
    });
});

describe('getTopPatterns', () => {
    it('should return only high-effectiveness patterns', () => {
        const result = getTopPatterns();

        result.forEach(pattern => {
            expect(pattern.effectiveness).toBe('high');
        });
    });

    it('should return multiple patterns', () => {
        const result = getTopPatterns();

        expect(result.length).toBeGreaterThan(3);
    });

    it('should include chain of thought pattern', () => {
        const result = getTopPatterns();

        const chainOfThought = result.find(p => p.id === 'chain-of-thought');
        expect(chainOfThought).toBeDefined();
    });
});

describe('specific patterns', () => {
    describe('Chain of Thought pattern', () => {
        it('should exist and have correct properties', () => {
            const pattern = PROMPT_PATTERNS.find(p => p.id === 'chain-of-thought');

            expect(pattern).toBeDefined();
            expect(pattern?.category).toBe('reasoning');
            expect(pattern?.effectiveness).toBe('high');
            expect(pattern?.difficulty).toBe('beginner');
        });

        it('should have a template with task placeholder', () => {
            const pattern = PROMPT_PATTERNS.find(p => p.id === 'chain-of-thought');

            expect(pattern?.template).toContain('{task}');
        });
    });

    describe('Few-Shot pattern', () => {
        it('should exist and have example placeholders', () => {
            const pattern = PROMPT_PATTERNS.find(p => p.id === 'few-shot');

            expect(pattern).toBeDefined();
            expect(pattern?.template).toContain('Example');
        });
    });

    describe('Role Assignment pattern', () => {
        it('should exist and have role placeholder', () => {
            const pattern = PROMPT_PATTERNS.find(p => p.id === 'role-assignment');

            expect(pattern).toBeDefined();
            expect(pattern?.template).toContain('{role}');
        });
    });

    describe('Code Review pattern', () => {
        it('should exist and be in specialized category', () => {
            const pattern = PROMPT_PATTERNS.find(p => p.id === 'code-review');

            expect(pattern).toBeDefined();
            expect(pattern?.category).toBe('specialized');
        });

        it('should include code block in template', () => {
            const pattern = PROMPT_PATTERNS.find(p => p.id === 'code-review');

            expect(pattern?.template).toContain('```');
        });
    });

    describe('Debug Helper pattern', () => {
        it('should exist and include error message placeholder', () => {
            const pattern = PROMPT_PATTERNS.find(p => p.id === 'debug-helper');

            expect(pattern).toBeDefined();
            expect(pattern?.template).toContain('error');
        });
    });
});

describe('pattern coverage', () => {
    it('should have patterns for each category', () => {
        const categories = Object.keys(PATTERN_CATEGORIES) as PatternCategory[];

        categories.forEach(category => {
            const patterns = getPatternsByCategory(category);
            expect(patterns.length).toBeGreaterThan(0);
        });
    });

    it('should have at least one beginner-level pattern', () => {
        const beginnerPatterns = PROMPT_PATTERNS.filter(p => p.difficulty === 'beginner');

        expect(beginnerPatterns.length).toBeGreaterThan(0);
    });

    it('should have at least one advanced-level pattern', () => {
        const advancedPatterns = PROMPT_PATTERNS.filter(p => p.difficulty === 'advanced');

        expect(advancedPatterns.length).toBeGreaterThan(0);
    });
});
