/**
 * Tests for Variable Engine
 */

import {
    renderTemplate,
    extractVariables,
    validateVariables,
    getVariableHistory,
    trackVariableUsage,
    getSuggestions,
    createVariableDefinitions,
    clearVariableHistory,
} from './variable.engine';
import { PromptTemplate } from './template.types';

// Mock localStorage
const localStorageMock = (() => {
    let store: Record<string, string> = {};
    return {
        getItem: (key: string) => store[key] || null,
        setItem: (key: string, value: string) => { store[key] = value; },
        removeItem: (key: string) => { delete store[key]; },
        clear: () => { store = {}; },
    };
})();

Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('renderTemplate', () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    it('should replace single variable', () => {
        const template = 'Hello, {name}!';
        const values = { name: 'World' };

        const result = renderTemplate(template, values);

        expect(result).toBe('Hello, World!');
    });

    it('should replace multiple variables', () => {
        const template = '{greeting}, {name}! Welcome to {place}.';
        const values = { greeting: 'Hello', name: 'John', place: 'Paris' };

        const result = renderTemplate(template, values);

        expect(result).toBe('Hello, John! Welcome to Paris.');
    });

    it('should keep placeholder for missing variables', () => {
        const template = 'Hello, {name}! Your role is {role}.';
        const values = { name: 'John' };

        const result = renderTemplate(template, values);

        expect(result).toBe('Hello, John! Your role is {role}.');
    });

    it('should handle empty values', () => {
        const template = 'Hello, {name}!';
        const values = { name: '' };

        const result = renderTemplate(template, values);

        expect(result).toBe('Hello, !');
    });

    it('should handle template without variables', () => {
        const template = 'Hello, World!';
        const values = {};

        const result = renderTemplate(template, values);

        expect(result).toBe('Hello, World!');
    });

    it('should handle duplicate variable occurrences', () => {
        const template = '{name} said: Hello, {name}!';
        const values = { name: 'John' };

        const result = renderTemplate(template, values);

        expect(result).toBe('John said: Hello, John!');
    });

    it('should handle special characters in values', () => {
        const template = 'Code: {code}';
        const values = { code: 'const x = 1 + 2; // comment' };

        const result = renderTemplate(template, values);

        expect(result).toContain('const x = 1 + 2');
    });

    it('should handle multiline values', () => {
        const template = 'Content:\n{content}';
        const values = { content: 'Line 1\nLine 2\nLine 3' };

        const result = renderTemplate(template, values);

        expect(result).toContain('Line 1');
        expect(result).toContain('Line 2');
    });
});

describe('extractVariables', () => {
    it('should extract single variable', () => {
        const template = 'Hello, {name}!';

        const result = extractVariables(template);

        expect(result).toContain('name');
    });

    it('should extract multiple variables', () => {
        const template = '{greeting}, {name}! Welcome to {place}.';

        const result = extractVariables(template);

        expect(result).toContain('greeting');
        expect(result).toContain('name');
        expect(result).toContain('place');
    });

    it('should return unique variables only', () => {
        const template = '{name} said: Hello, {name}!';

        const result = extractVariables(template);

        expect(result.filter(v => v === 'name').length).toBe(1);
    });

    it('should return empty array for no variables', () => {
        const template = 'Hello, World!';

        const result = extractVariables(template);

        expect(result).toHaveLength(0);
    });

    it('should handle empty template', () => {
        const result = extractVariables('');

        expect(result).toHaveLength(0);
    });
});

describe('validateVariables', () => {
    const mockTemplate: PromptTemplate = {
        id: 'test',
        name: 'Test',
        category: 'coding',
        description: 'Test template',
        template: 'Hello {name}, you are {role}',
        variables: [
            { name: 'name', label: 'Name', type: 'text', required: true },
            { name: 'role', label: 'Role', type: 'text', required: false },
            { name: 'extra', label: 'Extra', type: 'text', required: true },
        ],
        tags: [],
    };

    it('should return valid for complete required values', () => {
        const values = { name: 'John', extra: 'value' };

        const result = validateVariables(mockTemplate, values);

        expect(result.isValid).toBe(true);
        expect(result.missing).toHaveLength(0);
    });

    it('should return errors for missing required values', () => {
        const values = { role: 'admin' };

        const result = validateVariables(mockTemplate, values);

        expect(result.isValid).toBe(false);
        expect(result.missing.length).toBeGreaterThan(0);
    });

    it('should allow empty optional values', () => {
        const values = { name: 'John', extra: 'value', role: '' };

        const result = validateVariables(mockTemplate, values);

        expect(result.isValid).toBe(true);
    });

    it('should handle empty variables array', () => {
        const templateWithNoVars: PromptTemplate = {
            ...mockTemplate,
            variables: [],
        };
        const values = {};

        const result = validateVariables(templateWithNoVars, values);

        expect(result.isValid).toBe(true);
    });
});

describe('variable history', () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    it('should return empty object when no history', () => {
        const result = getVariableHistory();

        expect(result).toEqual({});
    });

    it('should track variable usage', () => {
        trackVariableUsage('name', 'John');

        const history = getVariableHistory();
        expect(history.name).toContain('John');
    });

    it('should get suggestions for variable', () => {
        trackVariableUsage('name', 'John');
        trackVariableUsage('name', 'Jane');

        const suggestions = getSuggestions('name');
        expect(suggestions).toContain('John');
        expect(suggestions).toContain('Jane');
    });

    it('should return empty array for unknown variable', () => {
        const suggestions = getSuggestions('unknown');

        expect(suggestions).toEqual([]);
    });

    it('should clear variable history', () => {
        trackVariableUsage('name', 'John');
        clearVariableHistory();

        const history = getVariableHistory();
        expect(history).toEqual({});
    });
});

describe('createVariableDefinitions', () => {
    it('should create definitions from template', () => {
        const template = 'Hello {name}, your role is {role}';

        const result = createVariableDefinitions(template);

        expect(result).toHaveLength(2);
        expect(result.map(v => v.name)).toContain('name');
        expect(result.map(v => v.name)).toContain('role');
    });

    it('should include required properties', () => {
        const template = 'Hello {name}';

        const result = createVariableDefinitions(template);

        result.forEach(def => {
            expect(def).toHaveProperty('name');
            expect(def).toHaveProperty('label');
            expect(def).toHaveProperty('type');
        });
    });

    it('should handle template without variables', () => {
        const template = 'Hello World';

        const result = createVariableDefinitions(template);

        expect(result).toHaveLength(0);
    });
});
