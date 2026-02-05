/**
 * Template Selectors
 * Memoized selectors for efficient template queries
 */

import { createSelector } from '@reduxjs/toolkit';
import { RootState } from './store';
import { PromptTemplate } from '@/core/templates/template.types';

// Base selectors
const selectTemplatesState = (state: RootState) => state.templates;
const selectCurated = (state: RootState) => state.templates.curated;
const selectCustom = (state: RootState) => state.templates.custom;
const selectFavorites = (state: RootState) => state.templates.favorites;
const selectSearchQuery = (state: RootState) => state.templates.searchQuery;
const selectActiveCategory = (state: RootState) => state.templates.activeCategory;

// All templates combined
export const selectAllTemplates = createSelector(
    [selectCurated, selectCustom],
    (curated, custom): PromptTemplate[] => [...curated, ...custom]
);

// Templates filtered by category
export const selectFilteredTemplates = createSelector(
    [selectAllTemplates, selectActiveCategory, selectFavorites],
    (all, category, favorites): PromptTemplate[] => {
        switch (category) {
            case 'all':
                return all;
            case 'favorites':
                return all.filter((t) => favorites.includes(t.id));
            case 'custom':
                return all.filter((t) => t.isCustom);
            default:
                return all.filter((t) => t.category === category);
        }
    }
);

// Templates filtered by search + category
export const selectSearchFilteredTemplates = createSelector(
    [selectFilteredTemplates, selectSearchQuery],
    (templates, query): PromptTemplate[] => {
        if (!query.trim()) return templates;

        const lowerQuery = query.toLowerCase();
        return templates.filter(
            (t) =>
                t.name.toLowerCase().includes(lowerQuery) ||
                t.description.toLowerCase().includes(lowerQuery) ||
                t.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
    }
);

// Check if a template is favorited
export const selectIsFavorite = (templateId: string) =>
    createSelector([selectFavorites], (favorites): boolean =>
        favorites.includes(templateId)
    );

// Get template by ID
export const selectTemplateById = (templateId: string) =>
    createSelector([selectAllTemplates], (templates): PromptTemplate | undefined =>
        templates.find((t) => t.id === templateId)
    );

// Favorite templates
export const selectFavoriteTemplates = createSelector(
    [selectAllTemplates, selectFavorites],
    (templates, favorites): PromptTemplate[] =>
        templates.filter((t) => favorites.includes(t.id))
);

// Template count by category
export const selectTemplateCounts = createSelector(
    [selectAllTemplates, selectFavorites],
    (templates, favorites) => ({
        all: templates.length,
        coding: templates.filter((t) => t.category === 'coding').length,
        writing: templates.filter((t) => t.category === 'writing').length,
        marketing: templates.filter((t) => t.category === 'marketing').length,
        productivity: templates.filter((t) => t.category === 'productivity').length,
        creative: templates.filter((t) => t.category === 'creative').length,
        favorites: favorites.length,
        custom: templates.filter((t) => t.isCustom).length,
    })
);
