/**
 * Tests for Redux UI Slice
 */

import uiReducer, {
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
} from './uiSlice';
import { PromptTemplate } from '@/core/templates/template.types';

const mockTemplate: PromptTemplate = {
    id: 'test-template',
    name: 'Test Template',
    category: 'general',
    description: 'A test template',
    template: 'Hello {name}!',
    variables: [
        { name: 'name', description: 'Your name', type: 'text', defaultValue: 'World' },
    ],
    tags: ['test'],
    difficulty: 'beginner',
    estimatedTokens: 10,
};

describe('uiSlice', () => {
    const initialState = {
        previewModalOpen: false,
        selectedTemplate: null,
        activeTab: 'enhancer' as const,
        variableValues: {},
        selectedModel: 'gpt-4' as const,
        selectedFormat: 'text' as const,
        tokenOptimization: false,
        inputPrompt: '',
        enhancedPrompt: '',
    };

    describe('setActiveTab', () => {
        it('should set active tab to enhancer', () => {
            const result = uiReducer(initialState, setActiveTab('enhancer'));

            expect(result.activeTab).toBe('enhancer');
        });

        it('should set active tab to templates', () => {
            const result = uiReducer(initialState, setActiveTab('templates'));

            expect(result.activeTab).toBe('templates');
        });

        it('should set active tab to patterns', () => {
            const result = uiReducer(initialState, setActiveTab('patterns'));

            expect(result.activeTab).toBe('patterns');
        });
    });

    describe('openTemplatePreview', () => {
        it('should open modal and set selected template', () => {
            const result = uiReducer(initialState, openTemplatePreview(mockTemplate));

            expect(result.previewModalOpen).toBe(true);
            expect(result.selectedTemplate).toEqual(mockTemplate);
        });

        it('should initialize variable values with defaults', () => {
            const result = uiReducer(initialState, openTemplatePreview(mockTemplate));

            expect(result.variableValues.name).toBe('World');
        });
    });

    describe('closeTemplatePreview', () => {
        it('should close modal and clear selection', () => {
            const stateWithModal = {
                ...initialState,
                previewModalOpen: true,
                selectedTemplate: mockTemplate,
                variableValues: { name: 'Test' },
            };

            const result = uiReducer(stateWithModal, closeTemplatePreview());

            expect(result.previewModalOpen).toBe(false);
            expect(result.selectedTemplate).toBeNull();
            expect(result.variableValues).toEqual({});
        });
    });

    describe('setVariableValue', () => {
        it('should set a single variable value', () => {
            const stateWithVars = {
                ...initialState,
                variableValues: { name: 'Old' },
            };

            const result = uiReducer(stateWithVars, setVariableValue({ name: 'name', value: 'New' }));

            expect(result.variableValues.name).toBe('New');
        });

        it('should add new variable without affecting others', () => {
            const stateWithVars = {
                ...initialState,
                variableValues: { existing: 'value' },
            };

            const result = uiReducer(stateWithVars, setVariableValue({ name: 'newVar', value: 'newValue' }));

            expect(result.variableValues.existing).toBe('value');
            expect(result.variableValues.newVar).toBe('newValue');
        });
    });

    describe('setAllVariableValues', () => {
        it('should replace all variable values', () => {
            const stateWithVars = {
                ...initialState,
                variableValues: { old: 'value' },
            };

            const result = uiReducer(stateWithVars, setAllVariableValues({ new1: 'a', new2: 'b' }));

            expect(result.variableValues).toEqual({ new1: 'a', new2: 'b' });
            expect(result.variableValues.old).toBeUndefined();
        });
    });

    describe('setSelectedModel', () => {
        it('should set selected model', () => {
            const result = uiReducer(initialState, setSelectedModel('claude-3'));

            expect(result.selectedModel).toBe('claude-3');
        });
    });

    describe('setSelectedFormat', () => {
        it('should set selected format', () => {
            const result = uiReducer(initialState, setSelectedFormat('json'));

            expect(result.selectedFormat).toBe('json');
        });
    });

    describe('setTokenOptimization', () => {
        it('should enable token optimization', () => {
            const result = uiReducer(initialState, setTokenOptimization(true));

            expect(result.tokenOptimization).toBe(true);
        });

        it('should disable token optimization', () => {
            const stateWithOptimization = { ...initialState, tokenOptimization: true };

            const result = uiReducer(stateWithOptimization, setTokenOptimization(false));

            expect(result.tokenOptimization).toBe(false);
        });
    });

    describe('setInputPrompt', () => {
        it('should set input prompt', () => {
            const result = uiReducer(initialState, setInputPrompt('Test prompt'));

            expect(result.inputPrompt).toBe('Test prompt');
        });

        it('should handle empty string', () => {
            const stateWithPrompt = { ...initialState, inputPrompt: 'existing' };

            const result = uiReducer(stateWithPrompt, setInputPrompt(''));

            expect(result.inputPrompt).toBe('');
        });
    });

    describe('setEnhancedPrompt', () => {
        it('should set enhanced prompt', () => {
            const result = uiReducer(initialState, setEnhancedPrompt('Enhanced prompt'));

            expect(result.enhancedPrompt).toBe('Enhanced prompt');
        });
    });

    describe('applyTemplateToEnhancer', () => {
        it('should set input prompt and switch to enhancer tab', () => {
            const stateWithModal = {
                ...initialState,
                activeTab: 'templates' as const,
                previewModalOpen: true,
                selectedTemplate: mockTemplate,
            };

            const result = uiReducer(stateWithModal, applyTemplateToEnhancer('Template content'));

            expect(result.inputPrompt).toBe('Template content');
            expect(result.activeTab).toBe('enhancer');
            expect(result.previewModalOpen).toBe(false);
            expect(result.selectedTemplate).toBeNull();
        });
    });

    describe('clearEnhancer', () => {
        it('should clear both input and enhanced prompts', () => {
            const stateWithPrompts = {
                ...initialState,
                inputPrompt: 'Input',
                enhancedPrompt: 'Enhanced',
            };

            const result = uiReducer(stateWithPrompts, clearEnhancer());

            expect(result.inputPrompt).toBe('');
            expect(result.enhancedPrompt).toBe('');
        });
    });
});
