/**
 * Template Service
 * Main service for template CRUD operations and rendering
 */

import {
    PromptTemplate,
    TemplateCategory,
    RenderedTemplate,
    UserTemplateData,
    AIModel,
    OutputFormat,
} from './template.types';
import {
    renderTemplate,
    validateVariables,
    trackVariableUsage,
} from './variable.engine';
import { applyContextAdaptations } from './context.adapter';
import { CURATED_TEMPLATES } from '../../data/templates';

// localStorage keys
const STORAGE_KEY_FAVORITES = 'prompt-enhancer-favorites';
const STORAGE_KEY_CUSTOM = 'prompt-enhancer-custom-templates';

/**
 * Get all available templates (curated + custom)
 * @returns Array of all templates
 */
export function getAllTemplates(): PromptTemplate[] {
    const customTemplates = getCustomTemplates();
    return [...CURATED_TEMPLATES, ...customTemplates];
}

/**
 * Get templates by category
 * @param category - Category to filter by
 * @returns Filtered templates
 */
export function getTemplatesByCategory(
    category: TemplateCategory
): PromptTemplate[] {
    return getAllTemplates().filter((t) => t.category === category);
}

/**
 * Get a single template by ID
 * @param id - Template ID
 * @returns Template if found
 */
export function getTemplateById(id: string): PromptTemplate | undefined {
    return getAllTemplates().find((t) => t.id === id);
}

/**
 * Search templates by name, description, or tags
 * @param query - Search query
 * @returns Matching templates
 */
export function searchTemplates(query: string): PromptTemplate[] {
    const lowerQuery = query.toLowerCase();
    return getAllTemplates().filter(
        (t) =>
            t.name.toLowerCase().includes(lowerQuery) ||
            t.description.toLowerCase().includes(lowerQuery) ||
            t.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
}

/**
 * Render a template with variable values and context options
 * @param template - Template to render
 * @param values - Variable values
 * @param options - Context options
 * @returns Rendered template result
 */
export function renderFullTemplate(
    template: PromptTemplate,
    values: Record<string, string>,
    options?: {
        model?: AIModel;
        format?: OutputFormat;
        optimizeTokens?: boolean;
    }
): RenderedTemplate {
    // Validate variables
    const validation = validateVariables(template, values);
    if (!validation.isValid) {
        throw new Error(`Missing required variables: ${validation.missing.join(', ')}`);
    }

    // Track variable usage for auto-suggestions
    Object.entries(values).forEach(([name, value]) => {
        trackVariableUsage(name, value);
    });

    // Render template with variables
    let rendered = renderTemplate(template.template, values);

    // Apply context adaptations
    if (options) {
        const adapted = applyContextAdaptations(rendered, options);
        rendered = adapted.prompt;
    }

    return {
        template,
        renderedPrompt: rendered,
        variables: values,
        targetModel: options?.model,
        outputFormat: options?.format,
        tokenOptimized: options?.optimizeTokens,
    };
}

// =============================================================================
// Favorites Management
// =============================================================================

/**
 * Get favorite template IDs
 */
export function getFavorites(): string[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY_FAVORITES);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

/**
 * Add a template to favorites
 */
export function addFavorite(templateId: string): void {
    const favorites = getFavorites();
    if (!favorites.includes(templateId)) {
        favorites.push(templateId);
        localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
    }
}

/**
 * Remove a template from favorites
 */
export function removeFavorite(templateId: string): void {
    const favorites = getFavorites().filter((id) => id !== templateId);
    localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(favorites));
}

/**
 * Check if a template is favorited
 */
export function isFavorite(templateId: string): boolean {
    return getFavorites().includes(templateId);
}

/**
 * Get favorite templates
 */
export function getFavoriteTemplates(): PromptTemplate[] {
    const favoriteIds = getFavorites();
    return getAllTemplates().filter((t) => favoriteIds.includes(t.id));
}

// =============================================================================
// Custom Templates Management
// =============================================================================

/**
 * Get custom templates
 */
export function getCustomTemplates(): PromptTemplate[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(STORAGE_KEY_CUSTOM);
        return stored ? JSON.parse(stored) : [];
    } catch {
        return [];
    }
}

/**
 * Save a custom template
 */
export function saveCustomTemplate(template: PromptTemplate): void {
    const templates = getCustomTemplates();
    const existingIndex = templates.findIndex((t) => t.id === template.id);

    const updatedTemplate = {
        ...template,
        isCustom: true,
        updatedAt: new Date().toISOString(),
    };

    if (existingIndex >= 0) {
        templates[existingIndex] = updatedTemplate;
    } else {
        updatedTemplate.createdAt = new Date().toISOString();
        templates.push(updatedTemplate);
    }

    localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(templates));
}

/**
 * Delete a custom template
 */
export function deleteCustomTemplate(templateId: string): void {
    const templates = getCustomTemplates().filter((t) => t.id !== templateId);
    localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(templates));
}

/**
 * Generate a unique template ID
 */
export function generateTemplateId(): string {
    return `custom-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// =============================================================================
// Export User Data
// =============================================================================

/**
 * Get all user template data for backup/sync
 */
export function getUserTemplateData(): UserTemplateData {
    return {
        favorites: getFavorites(),
        customTemplates: getCustomTemplates(),
        variableHistory: {},  // TODO: Get from variable.engine
    };
}

/**
 * Import user template data
 */
export function importUserTemplateData(data: Partial<UserTemplateData>): void {
    if (data.favorites) {
        localStorage.setItem(STORAGE_KEY_FAVORITES, JSON.stringify(data.favorites));
    }
    if (data.customTemplates) {
        localStorage.setItem(STORAGE_KEY_CUSTOM, JSON.stringify(data.customTemplates));
    }
}
