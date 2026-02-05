/**
 * Smart Template System - Type Definitions
 * LangChain-style variable syntax with extended features
 */

// =============================================================================
// Core Types
// =============================================================================

export type TemplateCategory =
    | 'coding'
    | 'writing'
    | 'marketing'
    | 'productivity'
    | 'creative';

export type VariableType = 'text' | 'textarea' | 'select' | 'number';

export type OutputFormat = 'text' | 'markdown' | 'json' | 'code';

export type AIModel = 'gpt-4' | 'gpt-4o-mini' | 'claude' | 'gemini' | 'llama';

// =============================================================================
// Variable Definitions
// =============================================================================

export interface VariableDefinition {
    /** Variable name (used in template as {name}) */
    name: string;
    /** Display label for the form */
    label: string;
    /** Input type */
    type: VariableType;
    /** Placeholder text */
    placeholder?: string;
    /** Default value */
    defaultValue?: string;
    /** Options for select type */
    options?: string[];
    /** Auto-suggest values from history */
    suggestions?: string[];
    /** Is this variable required? */
    required: boolean;
}

// =============================================================================
// Template Sections (for composition)
// =============================================================================

export interface TemplateSection {
    /** Unique section ID */
    id: string;
    /** Section name */
    name: string;
    /** Section content (can contain variables) */
    content: string;
    /** Can this section be removed? */
    isOptional: boolean;
    /** Display order */
    order: number;
}

// =============================================================================
// Chain of Thought Steps
// =============================================================================

export interface ChainStep {
    /** Unique step ID */
    id: string;
    /** Step order in the chain */
    order: number;
    /** Step name/title */
    name: string;
    /** Prompt template for this step */
    prompt: string;
    /** Variable name to store output (feeds into next step) */
    outputVariable: string;
    /** Variables this step depends on */
    inputVariables: string[];
}

// =============================================================================
// Context Options
// =============================================================================

export interface ContextOptions {
    /** Supported AI models */
    targetModels: AIModel[];
    /** Supported output formats */
    outputFormats: OutputFormat[];
    /** Enable token optimization */
    tokenOptimization: boolean;
}

// =============================================================================
// Main Template Interface
// =============================================================================

export interface PromptTemplate {
    /** Unique template ID */
    id: string;
    /** Template name */
    name: string;
    /** Template description */
    description: string;
    /** Category for filtering */
    category: TemplateCategory;
    /** The actual prompt template with {variables} */
    template: string;
    /** Variable definitions */
    variables: VariableDefinition[];
    /** Tags for search */
    tags: string[];
    /** Composable sections (optional) */
    sections?: TemplateSection[];
    /** Chain of thought steps (optional) */
    chainSteps?: ChainStep[];
    /** Context adaptation options */
    contextOptions?: ContextOptions;
    /** Is this a user-created template? */
    isCustom?: boolean;
    /** Creation timestamp */
    createdAt?: string;
    /** Last modified timestamp */
    updatedAt?: string;
}

// =============================================================================
// Rendered Template Result
// =============================================================================

export interface RenderedTemplate {
    /** Original template */
    template: PromptTemplate;
    /** Final rendered prompt string */
    renderedPrompt: string;
    /** Variables used */
    variables: Record<string, string>;
    /** Target AI model */
    targetModel?: AIModel;
    /** Output format */
    outputFormat?: OutputFormat;
    /** Was token optimization applied? */
    tokenOptimized?: boolean;
}

// =============================================================================
// User History (for auto-suggestions)
// =============================================================================

export interface VariableHistory {
    [variableName: string]: string[];  // Last N values used
}

// =============================================================================
// Favorites & Custom Storage
// =============================================================================

export interface UserTemplateData {
    /** IDs of favorite templates */
    favorites: string[];
    /** User-created custom templates */
    customTemplates: PromptTemplate[];
    /** Variable usage history */
    variableHistory: VariableHistory;
}
