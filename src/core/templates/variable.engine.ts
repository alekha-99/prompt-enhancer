/**
 * Variable Engine
 * Handles variable extraction, rendering, and auto-suggestions
 */

import {
    VariableDefinition,
    PromptTemplate,
    VariableHistory,
} from './template.types';

// Regex to match {variableName} pattern (LangChain style)
const VARIABLE_REGEX = /\{(\w+)\}/g;

// Max history items to store per variable
const MAX_HISTORY_ITEMS = 10;

// localStorage key for variable history
const HISTORY_STORAGE_KEY = 'prompt-enhancer-variable-history';

/**
 * Extract variable names from a template string
 * @param template - Template string with {variables}
 * @returns Array of variable names found
 */
export function extractVariables(template: string): string[] {
    const matches = template.matchAll(VARIABLE_REGEX);
    const variables = new Set<string>();

    for (const match of matches) {
        variables.add(match[1]);
    }

    return Array.from(variables);
}

/**
 * Validate that all required variables have values
 * @param template - PromptTemplate to validate
 * @param values - Variable values provided
 * @returns Object with isValid flag and missing variables
 */
export function validateVariables(
    template: PromptTemplate,
    values: Record<string, string>
): { isValid: boolean; missing: string[] } {
    const missing: string[] = [];

    for (const variable of template.variables) {
        if (variable.required && !values[variable.name]?.trim()) {
            missing.push(variable.name);
        }
    }

    return {
        isValid: missing.length === 0,
        missing,
    };
}

/**
 * Render a template by replacing {variables} with values
 * @param template - Template string with {variables}
 * @param values - Variable values to inject
 * @returns Rendered string
 */
export function renderTemplate(
    template: string,
    values: Record<string, string>
): string {
    return template.replace(VARIABLE_REGEX, (match, varName) => {
        return values[varName] !== undefined ? values[varName] : match;
    });
}

/**
 * Get variable history from localStorage
 * @returns VariableHistory object
 */
export function getVariableHistory(): VariableHistory {
    if (typeof window === 'undefined') return {};

    try {
        const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
        return stored ? JSON.parse(stored) : {};
    } catch {
        return {};
    }
}

/**
 * Save variable history to localStorage
 * @param history - VariableHistory object
 */
function saveVariableHistory(history: VariableHistory): void {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch {
        // localStorage might be full or disabled
        console.warn('Failed to save variable history');
    }
}

/**
 * Track variable usage for auto-suggestions
 * @param variableName - Name of the variable
 * @param value - Value used
 */
export function trackVariableUsage(variableName: string, value: string): void {
    if (!value.trim()) return;

    const history = getVariableHistory();
    const existing = history[variableName] || [];

    // Remove duplicates and add new value at the start
    const updated = [value, ...existing.filter((v) => v !== value)].slice(
        0,
        MAX_HISTORY_ITEMS
    );

    history[variableName] = updated;
    saveVariableHistory(history);
}

/**
 * Get auto-suggestions for a variable
 * @param variableName - Name of the variable
 * @param limit - Max suggestions to return
 * @returns Array of suggestion strings
 */
export function getSuggestions(variableName: string, limit = 5): string[] {
    const history = getVariableHistory();
    return (history[variableName] || []).slice(0, limit);
}

/**
 * Create variable definitions from extracted variable names
 * @param template - Template string
 * @returns Array of basic VariableDefinition objects
 */
export function createVariableDefinitions(
    template: string
): VariableDefinition[] {
    const names = extractVariables(template);

    return names.map((name) => ({
        name,
        label: formatVariableLabel(name),
        type: 'text' as const,
        placeholder: `Enter ${formatVariableLabel(name).toLowerCase()}...`,
        required: true,
    }));
}

/**
 * Format variable name to display label
 * @param name - camelCase or snake_case name
 * @returns Human-readable label
 */
function formatVariableLabel(name: string): string {
    // Convert camelCase to spaces
    const spaced = name.replace(/([A-Z])/g, ' $1');
    // Convert snake_case to spaces
    const formatted = spaced.replace(/_/g, ' ');
    // Capitalize first letter
    return formatted.charAt(0).toUpperCase() + formatted.slice(1).trim();
}

/**
 * Clear variable history
 */
export function clearVariableHistory(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(HISTORY_STORAGE_KEY);
}
