/**
 * Tests for Template Service
 */

import {
    getAllTemplates,
    getTemplateById,
    getTemplatesByCategory,
    searchTemplates,
    getFavorites,
    addFavorite,
    removeFavorite,
    isFavorite,
    getFavoriteTemplates,
    getCustomTemplates,
} from './template.service';

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

describe('getAllTemplates', () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    it('should return an array of templates', () => {
        const result = getAllTemplates();

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBeGreaterThan(0);
    });

    it('all templates should have required properties', () => {
        const templates = getAllTemplates();

        templates.forEach(template => {
            expect(template).toHaveProperty('id');
            expect(template).toHaveProperty('name');
            expect(template).toHaveProperty('category');
            expect(template).toHaveProperty('description');
            expect(template).toHaveProperty('template');
            expect(template).toHaveProperty('variables');
        });
    });

    it('all template IDs should be unique', () => {
        const templates = getAllTemplates();
        const ids = templates.map(t => t.id);
        const uniqueIds = new Set(ids);

        expect(ids.length).toBe(uniqueIds.size);
    });
});

describe('getTemplateById', () => {
    it('should return template for valid ID', () => {
        const templates = getAllTemplates();
        if (templates.length > 0) {
            const firstTemplate = templates[0];
            const result = getTemplateById(firstTemplate.id);

            expect(result).toBeDefined();
            expect(result?.id).toBe(firstTemplate.id);
        }
    });

    it('should return undefined for invalid ID', () => {
        const result = getTemplateById('nonexistent-template-id-12345');

        expect(result).toBeUndefined();
    });

    it('should return undefined for empty ID', () => {
        const result = getTemplateById('');

        expect(result).toBeUndefined();
    });
});

describe('getTemplatesByCategory', () => {
    it('should return templates filtered by category', () => {
        const allTemplates = getAllTemplates();
        if (allTemplates.length > 0) {
            const firstCategory = allTemplates[0].category;
            const result = getTemplatesByCategory(firstCategory);

            expect(result.length).toBeGreaterThan(0);
            result.forEach(template => {
                expect(template.category).toBe(firstCategory);
            });
        }
    });

    it('should return empty array for non-existent category', () => {
        // @ts-expect-error Testing with invalid category
        const result = getTemplatesByCategory('nonexistent-category');

        expect(result).toHaveLength(0);
    });
});

describe('searchTemplates', () => {
    it('should find templates by name', () => {
        const allTemplates = getAllTemplates();
        if (allTemplates.length > 0) {
            const searchTerm = allTemplates[0].name.split(' ')[0];
            const result = searchTemplates(searchTerm);

            expect(result.length).toBeGreaterThan(0);
        }
    });

    it('should be case insensitive', () => {
        const lowerResult = searchTemplates('code');
        const upperResult = searchTemplates('CODE');

        expect(lowerResult.length).toBe(upperResult.length);
    });

    it('should return empty array for no matches', () => {
        const result = searchTemplates('xyznonexistentterm123456');

        expect(result).toHaveLength(0);
    });

    it('should search in description as well', () => {
        const allTemplates = getAllTemplates();
        if (allTemplates.length > 0) {
            const firstDescription = allTemplates[0].description;
            const searchWord = firstDescription.split(' ').find(w => w.length > 4);

            if (searchWord) {
                const result = searchTemplates(searchWord);
                expect(result.length).toBeGreaterThan(0);
            }
        }
    });

    it('should handle empty search query', () => {
        const result = searchTemplates('');
        const allTemplates = getAllTemplates();

        // Empty query should match all templates
        expect(result.length).toBe(allTemplates.length);
    });
});

describe('favorites management', () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    it('should return empty array when no favorites', () => {
        const result = getFavorites();

        expect(result).toEqual([]);
    });

    it('should add template to favorites', () => {
        addFavorite('template-1');

        const favorites = getFavorites();
        expect(favorites).toContain('template-1');
    });

    it('should not add duplicate favorites', () => {
        addFavorite('template-1');
        addFavorite('template-1');

        const favorites = getFavorites();
        expect(favorites.filter(id => id === 'template-1').length).toBe(1);
    });

    it('should remove favorite', () => {
        addFavorite('template-1');
        addFavorite('template-2');
        removeFavorite('template-1');

        const favorites = getFavorites();
        expect(favorites).not.toContain('template-1');
        expect(favorites).toContain('template-2');
    });

    it('should check if template is favorited', () => {
        addFavorite('template-1');

        expect(isFavorite('template-1')).toBe(true);
        expect(isFavorite('template-2')).toBe(false);
    });

    it('should get favorite templates', () => {
        const allTemplates = getAllTemplates();
        if (allTemplates.length > 0) {
            addFavorite(allTemplates[0].id);

            const favorites = getFavoriteTemplates();
            expect(favorites.length).toBe(1);
            expect(favorites[0].id).toBe(allTemplates[0].id);
        }
    });
});

describe('custom templates management', () => {
    beforeEach(() => {
        localStorageMock.clear();
    });

    it('should return empty array when no custom templates', () => {
        const result = getCustomTemplates();

        expect(result).toEqual([]);
    });
});

describe('template content', () => {
    it('templates should contain variable placeholders', () => {
        const templates = getAllTemplates();

        templates.forEach(template => {
            if (template.variables.length > 0) {
                // Template should contain at least one variable placeholder
                const hasPlaceholder = template.variables.some(v =>
                    template.template.includes(`{${v.name}}`) ||
                    template.template.includes(`{{${v.name}}}`)
                );
                expect(hasPlaceholder).toBe(true);
            }
        });
    });

    it('templates should have minimum length', () => {
        const templates = getAllTemplates();

        templates.forEach(template => {
            expect(template.template.length).toBeGreaterThan(20);
        });
    });
});

describe('template variables', () => {
    it('all variables should have required properties', () => {
        const templates = getAllTemplates();

        templates.forEach(template => {
            template.variables.forEach(variable => {
                expect(variable).toHaveProperty('name');
                expect(variable).toHaveProperty('label');
                expect(variable).toHaveProperty('type');
            });
        });
    });

    it('variable types should be valid', () => {
        const validTypes = ['text', 'textarea', 'select', 'number']; // No boolean in types
        const templates = getAllTemplates();

        templates.forEach(template => {
            template.variables.forEach(variable => {
                expect(validTypes).toContain(variable.type);
            });
        });
    });
});
