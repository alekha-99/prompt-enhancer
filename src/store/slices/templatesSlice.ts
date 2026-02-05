/**
 * Templates Slice
 * Manages template state: curated, custom, favorites
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PromptTemplate, TemplateCategory } from '@/core/templates/template.types';
import { CURATED_TEMPLATES } from '@/data/templates';

interface TemplatesState {
    curated: PromptTemplate[];
    custom: PromptTemplate[];
    favorites: string[];
    searchQuery: string;
    activeCategory: TemplateCategory | 'all' | 'favorites' | 'custom';
}

// Load from localStorage
const loadFromStorage = <T>(key: string, defaultValue: T): T => {
    if (typeof window === 'undefined') return defaultValue;
    try {
        const stored = localStorage.getItem(key);
        return stored ? JSON.parse(stored) : defaultValue;
    } catch {
        return defaultValue;
    }
};

// Save to localStorage
const saveToStorage = (key: string, value: unknown): void => {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(key, JSON.stringify(value));
    } catch {
        console.warn(`Failed to save ${key} to localStorage`);
    }
};

const STORAGE_KEY_FAVORITES = 'prompt-enhancer-favorites';
const STORAGE_KEY_CUSTOM = 'prompt-enhancer-custom-templates';

const initialState: TemplatesState = {
    curated: CURATED_TEMPLATES,
    custom: [],
    favorites: [],
    searchQuery: '',
    activeCategory: 'all',
};

export const templatesSlice = createSlice({
    name: 'templates',
    initialState,
    reducers: {
        // Initialize state from localStorage (call on mount)
        initializeFromStorage: (state) => {
            state.favorites = loadFromStorage<string[]>(STORAGE_KEY_FAVORITES, []);
            state.custom = loadFromStorage<PromptTemplate[]>(STORAGE_KEY_CUSTOM, []);
        },

        // Search
        setSearchQuery: (state, action: PayloadAction<string>) => {
            state.searchQuery = action.payload;
        },

        // Category filter
        setActiveCategory: (state, action: PayloadAction<TemplatesState['activeCategory']>) => {
            state.activeCategory = action.payload;
        },

        // Favorites
        toggleFavorite: (state, action: PayloadAction<string>) => {
            const templateId = action.payload;
            const index = state.favorites.indexOf(templateId);

            if (index >= 0) {
                state.favorites.splice(index, 1);
            } else {
                state.favorites.push(templateId);
            }

            saveToStorage(STORAGE_KEY_FAVORITES, state.favorites);
        },

        // Custom templates
        addCustomTemplate: (state, action: PayloadAction<PromptTemplate>) => {
            const template = {
                ...action.payload,
                isCustom: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
            };
            state.custom.push(template);
            saveToStorage(STORAGE_KEY_CUSTOM, state.custom);
        },

        updateCustomTemplate: (state, action: PayloadAction<PromptTemplate>) => {
            const index = state.custom.findIndex((t) => t.id === action.payload.id);
            if (index >= 0) {
                state.custom[index] = {
                    ...action.payload,
                    updatedAt: new Date().toISOString(),
                };
                saveToStorage(STORAGE_KEY_CUSTOM, state.custom);
            }
        },

        deleteCustomTemplate: (state, action: PayloadAction<string>) => {
            state.custom = state.custom.filter((t) => t.id !== action.payload);
            saveToStorage(STORAGE_KEY_CUSTOM, state.custom);
        },
    },
});

export const {
    initializeFromStorage,
    setSearchQuery,
    setActiveCategory,
    toggleFavorite,
    addCustomTemplate,
    updateCustomTemplate,
    deleteCustomTemplate,
} = templatesSlice.actions;

export default templatesSlice.reducer;
