/**
 * Smart Suggestions Engine
 * Real-time prompt improvement suggestions
 */

export interface Suggestion {
    id: string;
    type: 'add' | 'improve' | 'warning';
    category: SuggestionCategory;
    title: string;
    description: string;
    quickFix?: QuickFix;
    priority: 'high' | 'medium' | 'low';
}

export interface QuickFix {
    label: string;
    textToInsert: string;
    position: 'start' | 'end' | 'replace';
}

export type SuggestionCategory =
    | 'role'
    | 'context'
    | 'format'
    | 'specificity'
    | 'examples'
    | 'constraints'
    | 'clarity';

/**
 * Analyze prompt and generate real-time suggestions
 */
export function generateSuggestions(prompt: string): Suggestion[] {
    const suggestions: Suggestion[] = [];
    const lowerPrompt = prompt.toLowerCase();
    const wordCount = prompt.split(/\s+/).filter(Boolean).length;

    // Check for role specification
    if (!hasRoleSpecification(lowerPrompt)) {
        suggestions.push({
            id: 'add-role',
            type: 'add',
            category: 'role',
            title: 'Add Role Specification',
            description: 'Tell the AI who it should be (expert, teacher, developer, etc.)',
            priority: 'high',
            quickFix: {
                label: 'Add "You are an expert"',
                textToInsert: 'You are an expert in this field. ',
                position: 'start',
            },
        });
    }

    // Check for output format
    if (!hasOutputFormat(lowerPrompt)) {
        suggestions.push({
            id: 'add-format',
            type: 'add',
            category: 'format',
            title: 'Specify Output Format',
            description: 'Tell the AI how to structure the response (JSON, markdown, bullet points, etc.)',
            priority: 'medium',
            quickFix: {
                label: 'Add format instruction',
                textToInsert: '\n\nProvide the response in a clear, structured format with headings and bullet points.',
                position: 'end',
            },
        });
    }

    // Check for examples
    if (wordCount > 15 && !hasExamples(lowerPrompt)) {
        suggestions.push({
            id: 'add-examples',
            type: 'add',
            category: 'examples',
            title: 'Add Examples',
            description: 'Including examples helps the AI understand exactly what you want',
            priority: 'medium',
            quickFix: {
                label: 'Add example section',
                textToInsert: '\n\nExample:\nInput: [your example input]\nOutput: [desired output format]',
                position: 'end',
            },
        });
    }

    // Check for vague words
    const vagueWords = findVagueWords(prompt);
    if (vagueWords.length > 0) {
        suggestions.push({
            id: 'remove-vague',
            type: 'warning',
            category: 'clarity',
            title: 'Avoid Vague Language',
            description: `Replace vague words like "${vagueWords.slice(0, 2).join('", "')}" with specific terms`,
            priority: 'medium',
        });
    }

    // Check for action verb
    if (!hasActionVerb(lowerPrompt)) {
        suggestions.push({
            id: 'add-action',
            type: 'improve',
            category: 'clarity',
            title: 'Start with Action Verb',
            description: 'Begin with a clear action (Create, Write, Analyze, Explain, etc.)',
            priority: 'high',
            quickFix: {
                label: 'Add "Please create"',
                textToInsert: 'Please create ',
                position: 'start',
            },
        });
    }

    // Check for constraints
    if (wordCount > 20 && !hasConstraints(lowerPrompt)) {
        suggestions.push({
            id: 'add-constraints',
            type: 'add',
            category: 'constraints',
            title: 'Add Constraints',
            description: 'Set limits on length, scope, or style to get more focused responses',
            priority: 'low',
            quickFix: {
                label: 'Add length constraint',
                textToInsert: '\n\nKeep the response concise, around 200-300 words.',
                position: 'end',
            },
        });
    }

    // Check for context
    if (wordCount > 10 && !hasContext(lowerPrompt)) {
        suggestions.push({
            id: 'add-context',
            type: 'add',
            category: 'context',
            title: 'Add Background Context',
            description: 'Provide context about your situation, goal, or audience',
            priority: 'medium',
            quickFix: {
                label: 'Add context section',
                textToInsert: '\n\nContext: I am working on [describe your project/situation].',
                position: 'end',
            },
        });
    }

    // Check if prompt is too short
    if (wordCount < 10) {
        suggestions.push({
            id: 'too-short',
            type: 'warning',
            category: 'specificity',
            title: 'Prompt Too Short',
            description: 'Add more details to get better results. What specifically do you need?',
            priority: 'high',
        });
    }

    // Check for step-by-step request for complex tasks
    const complexKeywords = ['how to', 'build', 'create', 'develop', 'implement', 'design'];
    const needsSteps = complexKeywords.some(k => lowerPrompt.includes(k));
    const hasSteps = /step.by.step|steps?:|numbered|first.*then|1\./i.test(prompt);

    if (needsSteps && !hasSteps && wordCount > 10) {
        suggestions.push({
            id: 'add-steps',
            type: 'add',
            category: 'format',
            title: 'Request Step-by-Step',
            description: 'For complex tasks, asking for steps makes responses more actionable',
            priority: 'medium',
            quickFix: {
                label: 'Add step-by-step request',
                textToInsert: '\n\nProvide a step-by-step guide with clear, numbered instructions.',
                position: 'end',
            },
        });
    }

    // Sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return suggestions.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
}

// Helper functions
function hasRoleSpecification(prompt: string): boolean {
    const rolePatterns = [
        'you are', 'act as', 'assume the role', 'pretend you',
        'as an expert', 'as a professional', 'as a senior',
        'imagine you', 'you\'re a', 'you work as'
    ];
    return rolePatterns.some(p => prompt.includes(p));
}

function hasOutputFormat(prompt: string): boolean {
    const formatPatterns = [
        'format:', 'in json', 'in markdown', 'as a table',
        'bullet points', 'numbered list', 'structured',
        'output:', 'respond in', 'respond with', 'provide as',
        'in the following format', 'formatted as'
    ];
    return formatPatterns.some(p => prompt.includes(p));
}

function hasExamples(prompt: string): boolean {
    const examplePatterns = [
        'for example', 'example:', 'such as', 'e.g.',
        'for instance', 'like this', 'input:', 'output:'
    ];
    return examplePatterns.some(p => prompt.includes(p));
}

function hasActionVerb(prompt: string): boolean {
    const actionVerbs = [
        'write', 'create', 'generate', 'build', 'design', 'develop',
        'analyze', 'explain', 'describe', 'list', 'compare', 'summarize',
        'translate', 'convert', 'optimize', 'improve', 'review', 'fix',
        'help', 'show', 'tell', 'find', 'make', 'give', 'provide'
    ];
    const firstWords = prompt.split(/\s+/).slice(0, 3).join(' ');
    return actionVerbs.some(v => firstWords.includes(v));
}

function hasConstraints(prompt: string): boolean {
    const constraintPatterns = [
        'limit', 'maximum', 'minimum', 'at least', 'at most',
        'no more than', 'within', 'between', 'words', 'characters',
        'sentences', 'paragraphs', 'brief', 'concise', 'detailed'
    ];
    return constraintPatterns.some(p => prompt.includes(p));
}

function hasContext(prompt: string): boolean {
    const contextPatterns = [
        'context:', 'background:', 'given that', 'considering',
        'based on', 'in the context of', 'i am', 'i\'m', 'i need',
        'my goal', 'the purpose', 'for a', 'working on'
    ];
    return contextPatterns.some(p => prompt.includes(p));
}

function findVagueWords(prompt: string): string[] {
    const vagueWords = [
        'thing', 'things', 'stuff', 'something', 'somehow',
        'whatever', 'etc', 'and so on', 'and more', 'various',
        'some', 'kind of', 'sort of', 'basically', 'really'
    ];
    const found: string[] = [];
    const lower = prompt.toLowerCase();

    for (const word of vagueWords) {
        if (lower.includes(word)) {
            found.push(word);
        }
    }

    return found;
}

/**
 * Apply a quick fix to the prompt
 */
export function applyQuickFix(prompt: string, quickFix: QuickFix): string {
    switch (quickFix.position) {
        case 'start':
            return quickFix.textToInsert + prompt;
        case 'end':
            return prompt + quickFix.textToInsert;
        case 'replace':
            return quickFix.textToInsert;
        default:
            return prompt;
    }
}

/**
 * Get category icon
 */
export function getCategoryIcon(category: SuggestionCategory): string {
    const icons: Record<SuggestionCategory, string> = {
        role: '🎭',
        context: '📋',
        format: '📝',
        specificity: '🎯',
        examples: '💡',
        constraints: '📏',
        clarity: '✨',
    };
    return icons[category];
}
