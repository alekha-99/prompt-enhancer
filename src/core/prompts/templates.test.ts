/**
 * Unit Tests for Meta-Prompt Templates
 */

import {
    IMPROVE_PROMPT,
    REFINE_QUESTIONS_PROMPT,
    REFINE_ENHANCE_PROMPT,
    fillTemplate,
} from '@/core/prompts/templates';

describe('IMPROVE_PROMPT', () => {
    it('should contain key sections', () => {
        expect(IMPROVE_PROMPT).toContain('ROLE DEFINITION');
        expect(IMPROVE_PROMPT).toContain('MAIN TASK');
        expect(IMPROVE_PROMPT).toContain('STRUCTURED REQUIREMENTS');
        expect(IMPROVE_PROMPT).toContain('FORMAT SPECIFICATIONS');
        expect(IMPROVE_PROMPT).toContain('AUDIENCE CONTEXT');
    });

    it('should contain input placeholder', () => {
        expect(IMPROVE_PROMPT).toContain('{input}');
    });

    it('should contain enhancement rules', () => {
        expect(IMPROVE_PROMPT).toContain('ENHANCEMENT RULES');
    });
});

describe('REFINE_QUESTIONS_PROMPT', () => {
    it('should contain input placeholder', () => {
        expect(REFINE_QUESTIONS_PROMPT).toContain('{input}');
    });

    it('should mention JSON array output', () => {
        expect(REFINE_QUESTIONS_PROMPT).toContain('JSON array');
    });

    it('should mention clarifying questions', () => {
        expect(REFINE_QUESTIONS_PROMPT).toContain('clarifying questions');
    });
});

describe('REFINE_ENHANCE_PROMPT', () => {
    it('should contain both placeholders', () => {
        expect(REFINE_ENHANCE_PROMPT).toContain('{originalPrompt}');
        expect(REFINE_ENHANCE_PROMPT).toContain('{context}');
    });

    it('should mention additional context', () => {
        expect(REFINE_ENHANCE_PROMPT).toContain('Additional context');
    });
});

describe('fillTemplate', () => {
    it('should replace single placeholder', () => {
        const template = 'Hello {name}!';
        const result = fillTemplate(template, { name: 'World' });
        expect(result).toBe('Hello World!');
    });

    it('should replace multiple placeholders', () => {
        const template = '{greeting} {name}!';
        const result = fillTemplate(template, { greeting: 'Hello', name: 'World' });
        expect(result).toBe('Hello World!');
    });

    it('should replace same placeholder multiple times', () => {
        const template = '{name} said hello to {name}';
        const result = fillTemplate(template, { name: 'John' });
        expect(result).toBe('John said hello to John');
    });

    it('should handle empty values', () => {
        const template = 'Hello {name}!';
        const result = fillTemplate(template, { name: '' });
        expect(result).toBe('Hello !');
    });

    it('should not replace non-matching placeholders', () => {
        const template = 'Hello {name}!';
        const result = fillTemplate(template, { other: 'value' });
        expect(result).toBe('Hello {name}!');
    });

    it('should work with IMPROVE_PROMPT template', () => {
        const result = fillTemplate(IMPROVE_PROMPT, { input: 'explain react hooks' });
        expect(result).toContain('explain react hooks');
        expect(result).not.toContain('{input}');
    });

    it('should work with REFINE_ENHANCE_PROMPT template', () => {
        const result = fillTemplate(REFINE_ENHANCE_PROMPT, {
            originalPrompt: 'test prompt',
            context: 'Q: Who? A: Developers',
        });
        expect(result).toContain('test prompt');
        expect(result).toContain('Q: Who? A: Developers');
    });
});
