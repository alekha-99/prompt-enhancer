/**
 * UI Slice
 * Manages UI state: modals, selections, active views
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PromptTemplate, AIModel, OutputFormat } from '@/core/templates/template.types';

interface UIState {
    // Template preview modal
    previewModalOpen: boolean;
    selectedTemplate: PromptTemplate | null;

    // Main tabs
    activeTab: 'enhancer' | 'templates' | 'patterns';

    // Template variables
    variableValues: Record<string, string>;

    // Context settings
    selectedModel: AIModel;
    selectedFormat: OutputFormat;
    tokenOptimization: boolean;

    // Prompt enhancer
    inputPrompt: string;
    enhancedPrompt: string;
}

const initialState: UIState = {
    previewModalOpen: false,
    selectedTemplate: null,
    activeTab: 'enhancer',
    variableValues: {},
    selectedModel: 'gpt-4',
    selectedFormat: 'text',
    tokenOptimization: false,
    inputPrompt: '',
    enhancedPrompt: '',
};

export const uiSlice = createSlice({
    name: 'ui',
    initialState,
    reducers: {
        // Tabs
        setActiveTab: (state, action: PayloadAction<UIState['activeTab']>) => {
            state.activeTab = action.payload;
        },

        // Template preview
        openTemplatePreview: (state, action: PayloadAction<PromptTemplate>) => {
            state.selectedTemplate = action.payload;
            state.previewModalOpen = true;
            // Initialize variable values with defaults
            const values: Record<string, string> = {};
            action.payload.variables.forEach((v) => {
                values[v.name] = v.defaultValue || '';
            });
            state.variableValues = values;
        },

        closeTemplatePreview: (state) => {
            state.previewModalOpen = false;
            state.selectedTemplate = null;
            state.variableValues = {};
        },

        // Variable values
        setVariableValue: (state, action: PayloadAction<{ name: string; value: string }>) => {
            state.variableValues[action.payload.name] = action.payload.value;
        },

        setAllVariableValues: (state, action: PayloadAction<Record<string, string>>) => {
            state.variableValues = action.payload;
        },

        // Context settings
        setSelectedModel: (state, action: PayloadAction<AIModel>) => {
            state.selectedModel = action.payload;
        },

        setSelectedFormat: (state, action: PayloadAction<OutputFormat>) => {
            state.selectedFormat = action.payload;
        },

        setTokenOptimization: (state, action: PayloadAction<boolean>) => {
            state.tokenOptimization = action.payload;
        },

        // Prompt enhancer
        setInputPrompt: (state, action: PayloadAction<string>) => {
            state.inputPrompt = action.payload;
        },

        setEnhancedPrompt: (state, action: PayloadAction<string>) => {
            state.enhancedPrompt = action.payload;
        },

        // Apply template to enhancer
        applyTemplateToEnhancer: (state, action: PayloadAction<string>) => {
            state.inputPrompt = action.payload;
            state.activeTab = 'enhancer';
            state.previewModalOpen = false;
            state.selectedTemplate = null;
        },

        // Clear all
        clearEnhancer: (state) => {
            state.inputPrompt = '';
            state.enhancedPrompt = '';
        },
    },
});

export const {
    setActiveTab,
    openTemplatePreview,
    closeTemplatePreview,
    setVariableValue,
    setAllVariableValues,
    setSelectedModel,
    setSelectedFormat,
    setTokenOptimization,
    setInputPrompt,
    setEnhancedPrompt,
    applyTemplateToEnhancer,
    clearEnhancer,
} = uiSlice.actions;

export default uiSlice.reducer;
