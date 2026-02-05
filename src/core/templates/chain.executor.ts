/**
 * Chain Executor
 * Handles Chain of Thought prompt execution
 */

import { ChainStep } from './template.types';
import { renderTemplate } from './variable.engine';

/**
 * Result of executing a single chain step
 */
export interface StepResult {
    stepId: string;
    stepName: string;
    prompt: string;
    output: string;
    outputVariable: string;
}

/**
 * Result of executing a full chain
 */
export interface ChainResult {
    success: boolean;
    steps: StepResult[];
    finalOutput: string;
    context: Record<string, string>;
    error?: string;
}

/**
 * Function type for executing a single prompt
 */
export type PromptExecutor = (prompt: string) => Promise<string>;

/**
 * Validate chain steps for proper connections
 * @param steps - Chain steps to validate
 * @returns Validation result
 */
export function validateChain(steps: ChainStep[]): {
    isValid: boolean;
    errors: string[];
} {
    const errors: string[] = [];
    const definedVariables = new Set<string>();

    // Sort by order
    const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

    for (const step of sortedSteps) {
        // Check if all input variables are defined
        for (const inputVar of step.inputVariables) {
            if (!definedVariables.has(inputVar)) {
                errors.push(
                    `Step "${step.name}": Input variable "${inputVar}" is not defined by any previous step`
                );
            }
        }

        // Add output variable to defined set
        if (step.outputVariable) {
            definedVariables.add(step.outputVariable);
        }
    }

    return {
        isValid: errors.length === 0,
        errors,
    };
}

/**
 * Build a complete prompt from chain step with context
 * @param step - Chain step
 * @param context - Variable context
 * @returns Rendered prompt
 */
export function buildStepPrompt(
    step: ChainStep,
    context: Record<string, string>
): string {
    return renderTemplate(step.prompt, context);
}

/**
 * Execute a single chain step
 * @param step - Chain step to execute
 * @param context - Current variable context
 * @param executor - Function to execute the prompt
 * @returns Step result
 */
export async function executeStep(
    step: ChainStep,
    context: Record<string, string>,
    executor: PromptExecutor
): Promise<StepResult> {
    const prompt = buildStepPrompt(step, context);
    const output = await executor(prompt);

    return {
        stepId: step.id,
        stepName: step.name,
        prompt,
        output,
        outputVariable: step.outputVariable,
    };
}

/**
 * Execute a full chain of prompts
 * @param steps - Array of chain steps
 * @param initialContext - Initial variable values
 * @param executor - Function to execute each prompt
 * @returns Chain execution result
 */
export async function executeChain(
    steps: ChainStep[],
    initialContext: Record<string, string>,
    executor: PromptExecutor
): Promise<ChainResult> {
    const context = { ...initialContext };
    const results: StepResult[] = [];

    // Sort steps by order
    const sortedSteps = [...steps].sort((a, b) => a.order - b.order);

    try {
        for (const step of sortedSteps) {
            const result = await executeStep(step, context, executor);
            results.push(result);

            // Add output to context for next step
            if (step.outputVariable) {
                context[step.outputVariable] = result.output;
            }
        }

        return {
            success: true,
            steps: results,
            finalOutput: results.length > 0 ? results[results.length - 1].output : '',
            context,
        };
    } catch (error) {
        return {
            success: false,
            steps: results,
            finalOutput: '',
            context,
            error: error instanceof Error ? error.message : 'Chain execution failed',
        };
    }
}

/**
 * Create a simple chain from an array of prompts
 * @param prompts - Array of prompt strings
 * @returns Array of ChainStep objects
 */
export function createSimpleChain(prompts: string[]): ChainStep[] {
    return prompts.map((prompt, index) => ({
        id: `step-${index + 1}`,
        order: index + 1,
        name: `Step ${index + 1}`,
        prompt,
        outputVariable: `step${index + 1}Output`,
        inputVariables: index > 0 ? [`step${index}Output`] : [],
    }));
}
