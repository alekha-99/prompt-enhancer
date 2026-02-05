/**
 * Tests for Redux Templates Slice
 */

import templatesReducer, {
    initializeFromStorage,
    setSearchQuery,
    setActiveCategory,
    toggleFavorite,
    addCustomTemplate,
    updateCustomTemplate,
    deleteCustomTemplate,
} from './templatesSlice';
import { PromptTemplate } from '@/core/templates/template.types';
import { CURATED_TEMPLATES } from '@/data/templates';

const mockTemplate: PromptTemplate = {
    id: 'custom-test',
    name: 'Custom Test',
    category: 'coding',
    description: 'A custom test template',
    template: 'Custom {variable}',
    variables: [
        { name: 'variable', label: 'Variable', type: 'text', required: true },
    ],
    tags: ['custom', 'test'],
    isCustom: true,
};

describe('templatesSlice', () => {
    const initialState = {
        curated: CURATED_TEMPLATES,
        custom: [],
        favorites: [],
        searchQuery: '',
        activeCategory: 'all' as const,
    };

    describe('setSearchQuery', () => {
        it('should set search query', () => {
            const result = templatesReducer(initialState, setSearchQuery('test query'));

            expect(result.searchQuery).toBe('test query');
        });

        it('should handle empty query', () => {
            const result = templatesReducer(
                { ...initialState, searchQuery: 'existing' },
                setSearchQuery('')
            );

            expect(result.searchQuery).toBe('');
        });
    });

    describe('setActiveCategory', () => {
        it('should set active category to all', () => {
            const result = templatesReducer(initialState, setActiveCategory('all'));

            expect(result.activeCategory).toBe('all');
        });

        it('should set active category to favorites', () => {
            const result = templatesReducer(initialState, setActiveCategory('favorites'));

            expect(result.activeCategory).toBe('favorites');
        });

        it('should set active category to custom', () => {
            const result = templatesReducer(initialState, setActiveCategory('custom'));

            expect(result.activeCategory).toBe('custom');
        });

        it('should set active category to a specific category', () => {
            const result = templatesReducer(initialState, setActiveCategory('coding'));

            expect(result.activeCategory).toBe('coding');
        });
    });

    describe('toggleFavorite', () => {
        it('should add template id to favorites', () => {
            const result = templatesReducer(initialState, toggleFavorite('template-1'));

            expect(result.favorites).toContain('template-1');
        });

        it('should remove template id if already in favorites', () => {
            const stateWithFavorite = {
                ...initialState,
                favorites: ['template-1'],
            };

            const result = templatesReducer(stateWithFavorite, toggleFavorite('template-1'));

            expect(result.favorites).not.toContain('template-1');
        });

        it('should not affect other favorites when removing', () => {
            const stateWithFavorites = {
                ...initialState,
                favorites: ['template-1', 'template-2'],
            };

            const result = templatesReducer(stateWithFavorites, toggleFavorite('template-1'));

            expect(result.favorites).not.toContain('template-1');
            expect(result.favorites).toContain('template-2');
        });
    });

    describe('addCustomTemplate', () => {
        it('should add a custom template', () => {
            const result = templatesReducer(initialState, addCustomTemplate(mockTemplate));

            expect(result.custom).toHaveLength(1);
            expect(result.custom[0].id).toBe('custom-test');
        });

        it('should mark template as custom', () => {
            const result = templatesReducer(initialState, addCustomTemplate(mockTemplate));

            expect(result.custom[0].isCustom).toBe(true);
        });

        it('should add createdAt timestamp', () => {
            const result = templatesReducer(initialState, addCustomTemplate(mockTemplate));

            expect(result.custom[0].createdAt).toBeDefined();
        });
    });

    describe('updateCustomTemplate', () => {
        it('should update an existing custom template', () => {
            const stateWithTemplate = {
                ...initialState,
                custom: [mockTemplate],
            };

            const updatedTemplate = { ...mockTemplate, name: 'Updated Name' };
            const result = templatesReducer(stateWithTemplate, updateCustomTemplate(updatedTemplate));

            expect(result.custom[0].name).toBe('Updated Name');
        });

        it('should add updatedAt timestamp', () => {
            const stateWithTemplate = {
                ...initialState,
                custom: [mockTemplate],
            };

            const updatedTemplate = { ...mockTemplate, name: 'Updated' };
            const result = templatesReducer(stateWithTemplate, updateCustomTemplate(updatedTemplate));

            expect(result.custom[0].updatedAt).toBeDefined();
        });

        it('should not modify state if id does not exist', () => {
            const nonExistentTemplate = { ...mockTemplate, id: 'non-existent' };

            const result = templatesReducer(initialState, updateCustomTemplate(nonExistentTemplate));

            expect(result.custom).toHaveLength(0);
        });
    });

    describe('deleteCustomTemplate', () => {
        it('should remove custom template by id', () => {
            const stateWithTemplate = {
                ...initialState,
                custom: [mockTemplate],
            };

            const result = templatesReducer(stateWithTemplate, deleteCustomTemplate('custom-test'));

            expect(result.custom).toHaveLength(0);
        });

        it('should not affect other templates', () => {
            const anotherTemplate = { ...mockTemplate, id: 'another-test' };
            const stateWithTemplates = {
                ...initialState,
                custom: [mockTemplate, anotherTemplate],
            };

            const result = templatesReducer(stateWithTemplates, deleteCustomTemplate('custom-test'));

            expect(result.custom).toHaveLength(1);
            expect(result.custom[0].id).toBe('another-test');
        });
    });

    describe('initializeFromStorage', () => {
        it('should initialize state', () => {
            const result = templatesReducer(initialState, initializeFromStorage());

            expect(result).toBeDefined();
            expect(result.favorites).toBeDefined();
            expect(result.custom).toBeDefined();
        });
    });
});
