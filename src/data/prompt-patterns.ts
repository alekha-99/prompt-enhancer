/**
 * Prompt Patterns Library
 * Pre-built patterns for effective prompting
 */

export interface PromptPattern {
    id: string;
    name: string;
    category: PatternCategory;
    description: string;
    template: string;
    example: string;
    tags: string[];
    effectiveness: 'high' | 'medium' | 'standard';
    difficulty: 'beginner' | 'intermediate' | 'advanced';
}

export type PatternCategory =
    | 'reasoning'
    | 'structure'
    | 'context'
    | 'output'
    | 'interaction'
    | 'specialized';

export const PATTERN_CATEGORIES: Record<PatternCategory, { label: string; icon: string; color: string }> = {
    reasoning: { label: 'Reasoning', icon: '🧠', color: '#a855f7' },
    structure: { label: 'Structure', icon: '📋', color: '#3b82f6' },
    context: { label: 'Context', icon: '🎯', color: '#22c55e' },
    output: { label: 'Output', icon: '📝', color: '#eab308' },
    interaction: { label: 'Interaction', icon: '💬', color: '#06b6d4' },
    specialized: { label: 'Specialized', icon: '⚡', color: '#f97316' },
};

export const PROMPT_PATTERNS: PromptPattern[] = [
    // REASONING PATTERNS
    {
        id: 'chain-of-thought',
        name: 'Chain of Thought',
        category: 'reasoning',
        description: 'Step-by-step reasoning for complex problems',
        template: `Let's think through this step by step:

{task}

Please reason through each step before providing your final answer.`,
        example: "Let's think through this step by step:\n\nCalculate the compound interest on $10,000 at 5% for 3 years.\n\nPlease reason through each step before providing your final answer.",
        tags: ['reasoning', 'math', 'logic', 'problem-solving'],
        effectiveness: 'high',
        difficulty: 'beginner',
    },
    {
        id: 'tree-of-thought',
        name: 'Tree of Thought',
        category: 'reasoning',
        description: 'Explore multiple reasoning paths before deciding',
        template: `Consider multiple approaches to solve this problem:

{task}

For each approach:
1. Describe the method
2. List pros and cons
3. Rate likelihood of success (1-10)

Then select the best approach and execute it.`,
        example: "Consider multiple approaches to solve this problem:\n\nHow can we reduce customer churn by 20%?\n\nFor each approach:\n1. Describe the method\n2. List pros and cons\n3. Rate likelihood of success (1-10)\n\nThen select the best approach and execute it.",
        tags: ['strategy', 'decision-making', 'analysis'],
        effectiveness: 'high',
        difficulty: 'advanced',
    },
    {
        id: 'self-consistency',
        name: 'Self-Consistency',
        category: 'reasoning',
        description: 'Generate multiple answers and find consensus',
        template: `Generate 3 different solutions for this problem:

{task}

For each solution:
- Show your reasoning
- Provide the answer

Then compare all solutions and identify the most consistent/reliable answer.`,
        example: "Generate 3 different solutions for this problem:\n\nWhat's 17% of 340?\n\nFor each solution:\n- Show your reasoning\n- Provide the answer\n\nThen compare all solutions and identify the most consistent/reliable answer.",
        tags: ['verification', 'accuracy', 'math'],
        effectiveness: 'high',
        difficulty: 'intermediate',
    },
    {
        id: 'reflection',
        name: 'Reflection',
        category: 'reasoning',
        description: 'Self-critique and refine the response',
        template: `{task}

After providing your initial response, please:
1. Critique your own answer - what could be wrong or missing?
2. Consider alternative perspectives
3. Provide an improved, refined final answer`,
        example: "Explain quantum entanglement to a high school student.\n\nAfter providing your initial response, please:\n1. Critique your own answer - what could be wrong or missing?\n2. Consider alternative perspectives\n3. Provide an improved, refined final answer",
        tags: ['improvement', 'self-critique', 'refinement'],
        effectiveness: 'high',
        difficulty: 'intermediate',
    },

    // STRUCTURE PATTERNS
    {
        id: 'few-shot',
        name: 'Few-Shot Learning',
        category: 'structure',
        description: 'Provide examples to guide the output format',
        template: `Here are some examples:

Example 1:
Input: {example_input_1}
Output: {example_output_1}

Example 2:
Input: {example_input_2}
Output: {example_output_2}

Now apply the same pattern:
Input: {actual_input}
Output:`,
        example: "Here are some examples:\n\nExample 1:\nInput: The movie was great\nOutput: Positive\n\nExample 2:\nInput: I hated the service\nOutput: Negative\n\nNow apply the same pattern:\nInput: The food was okay but overpriced\nOutput:",
        tags: ['examples', 'formatting', 'learning'],
        effectiveness: 'high',
        difficulty: 'beginner',
    },
    {
        id: 'structured-output',
        name: 'Structured Output',
        category: 'structure',
        description: 'Request specific output format (JSON, table, etc.)',
        template: `{task}

Respond in the following JSON format:
\`\`\`json
{
  "summary": "brief summary",
  "key_points": ["point 1", "point 2"],
  "recommendation": "your recommendation",
  "confidence": "high/medium/low"
}
\`\`\``,
        example: 'Analyze whether we should expand to the European market.\n\nRespond in the following JSON format:\n```json\n{\n  "summary": "brief summary",\n  "key_points": ["point 1", "point 2"],\n  "recommendation": "your recommendation",\n  "confidence": "high/medium/low"\n}\n```',
        tags: ['json', 'formatting', 'structured'],
        effectiveness: 'medium',
        difficulty: 'beginner',
    },
    {
        id: 'step-by-step',
        name: 'Step-by-Step',
        category: 'structure',
        description: 'Request numbered step instructions',
        template: `{task}

Provide a clear, numbered step-by-step guide:
1. Start with prerequisites
2. Include specific commands/actions
3. Add tips for each step
4. End with verification steps`,
        example: "How do I set up a React project with TypeScript?\n\nProvide a clear, numbered step-by-step guide:\n1. Start with prerequisites\n2. Include specific commands/actions\n3. Add tips for each step\n4. End with verification steps",
        tags: ['tutorial', 'instructions', 'guide'],
        effectiveness: 'medium',
        difficulty: 'beginner',
    },

    // CONTEXT PATTERNS
    {
        id: 'role-assignment',
        name: 'Role Assignment',
        category: 'context',
        description: 'Assign a specific expert persona',
        template: `You are a {role} with {years} years of experience. You specialize in {specialty}.

Your task: {task}

Respond as this expert would, using appropriate terminology and depth.`,
        example: "You are a senior software architect with 15 years of experience. You specialize in distributed systems and microservices.\n\nYour task: Review this API design and identify potential scalability issues.\n\nRespond as this expert would, using appropriate terminology and depth.",
        tags: ['persona', 'expert', 'roleplay'],
        effectiveness: 'high',
        difficulty: 'beginner',
    },
    {
        id: 'audience-context',
        name: 'Audience Context',
        category: 'context',
        description: 'Specify the target audience for appropriate response',
        template: `{task}

IMPORTANT: Your audience is {audience}. 
- Adjust vocabulary and complexity accordingly
- Use examples they would understand
- Avoid jargon unless necessary (explain if used)`,
        example: "Explain how machine learning works.\n\nIMPORTANT: Your audience is high school students with no programming experience.\n- Adjust vocabulary and complexity accordingly\n- Use examples they would understand\n- Avoid jargon unless necessary (explain if used)",
        tags: ['audience', 'explanation', 'teaching'],
        effectiveness: 'medium',
        difficulty: 'beginner',
    },
    {
        id: 'constraints',
        name: 'Constraints',
        category: 'context',
        description: 'Add specific limits and requirements',
        template: `{task}

Constraints:
- Length: {length_limit}
- Tone: {tone}
- Must include: {requirements}
- Must avoid: {restrictions}`,
        example: "Write a product description for a smart water bottle.\n\nConstraints:\n- Length: 100-150 words\n- Tone: Enthusiastic but professional\n- Must include: key features, price point, target audience\n- Must avoid: Hyperbolic claims, competitor mentions",
        tags: ['limits', 'requirements', 'rules'],
        effectiveness: 'medium',
        difficulty: 'beginner',
    },

    // OUTPUT PATTERNS
    {
        id: 'pros-cons',
        name: 'Pros & Cons Analysis',
        category: 'output',
        description: 'Balanced analysis with advantages and disadvantages',
        template: `Analyze: {topic}

Provide a balanced assessment:

## Pros
- List 3-5 advantages
- Include specific examples

## Cons  
- List 3-5 disadvantages
- Include specific examples

## Verdict
Provide your overall recommendation with reasoning.`,
        example: "Analyze: Remote work vs. office work for software developers\n\nProvide a balanced assessment:\n\n## Pros\n- List 3-5 advantages\n- Include specific examples\n\n## Cons\n- List 3-5 disadvantages\n- Include specific examples\n\n## Verdict\nProvide your overall recommendation with reasoning.",
        tags: ['analysis', 'comparison', 'decision'],
        effectiveness: 'medium',
        difficulty: 'beginner',
    },
    {
        id: 'eli5',
        name: 'ELI5 (Explain Like I\'m 5)',
        category: 'output',
        description: 'Simple explanation using analogies',
        template: `Explain {concept} as if I'm 5 years old.

Requirements:
- Use simple everyday words
- Include a relatable analogy
- No technical jargon
- Make it fun and engaging`,
        example: "Explain blockchain as if I'm 5 years old.\n\nRequirements:\n- Use simple everyday words\n- Include a relatable analogy\n- No technical jargon\n- Make it fun and engaging",
        tags: ['simple', 'explanation', 'analogy'],
        effectiveness: 'medium',
        difficulty: 'beginner',
    },

    // INTERACTION PATTERNS
    {
        id: 'socratic',
        name: 'Socratic Method',
        category: 'interaction',
        description: 'Guide through questions rather than direct answers',
        template: `Topic: {topic}

Instead of giving me the answer directly, help me discover it myself by:
1. Asking me clarifying questions
2. Challenging my assumptions
3. Guiding me to the right conclusions
4. Only reveal the answer if I'm stuck after 3 attempts`,
        example: "Topic: Why do seasons change?\n\nInstead of giving me the answer directly, help me discover it myself by:\n1. Asking me clarifying questions\n2. Challenging my assumptions\n3. Guiding me to the right conclusions\n4. Only reveal the answer if I'm stuck after 3 attempts",
        tags: ['learning', 'questions', 'teaching'],
        effectiveness: 'medium',
        difficulty: 'intermediate',
    },
    {
        id: 'devils-advocate',
        name: "Devil's Advocate",
        category: 'interaction',
        description: 'Challenge and argue against the given position',
        template: `My position: {position}

Play devil's advocate and:
1. Present the strongest counter-arguments
2. Identify weaknesses in my reasoning
3. Suggest what I might be missing
4. Rate the strength of my original position (1-10)`,
        example: "My position: AI will replace most jobs within 20 years.\n\nPlay devil's advocate and:\n1. Present the strongest counter-arguments\n2. Identify weaknesses in my reasoning\n3. Suggest what I might be missing\n4. Rate the strength of my original position (1-10)",
        tags: ['debate', 'critical-thinking', 'analysis'],
        effectiveness: 'high',
        difficulty: 'intermediate',
    },

    // SPECIALIZED PATTERNS
    {
        id: 'code-review',
        name: 'Code Review',
        category: 'specialized',
        description: 'Systematic code review with actionable feedback',
        template: `Review this code:

\`\`\`{language}
{code}
\`\`\`

Analyze for:
1. **Bugs**: Logic errors, edge cases, potential crashes
2. **Security**: Vulnerabilities, injection risks
3. **Performance**: Inefficiencies, memory leaks
4. **Readability**: Naming, structure, comments
5. **Best Practices**: Design patterns, conventions

For each issue, provide:
- Severity (Critical/Major/Minor)
- Line number(s)
- Suggested fix with code`,
        example: '```javascript\nfunction calc(x) {\n  return x * 2 + 1\n}\n```\n\nAnalyze for:\n1. **Bugs**: Logic errors, edge cases\n2. **Security**: Vulnerabilities\n3. **Performance**: Inefficiencies\n4. **Readability**: Naming, structure\n5. **Best Practices**: Conventions',
        tags: ['code', 'review', 'programming'],
        effectiveness: 'high',
        difficulty: 'intermediate',
    },
    {
        id: 'debug-helper',
        name: 'Debug Helper',
        category: 'specialized',
        description: 'Systematic debugging assistance',
        template: `I'm getting this error:

\`\`\`
{error_message}
\`\`\`

Context:
- Language/Framework: {language}
- What I'm trying to do: {goal}
- What I've tried: {attempts}

Please:
1. Explain what this error means
2. Identify likely causes (ranked by probability)
3. Provide step-by-step debugging approach
4. Give the most likely solution with code`,
        example: "I'm getting this error:\n\n```\nTypeError: Cannot read property 'map' of undefined\n```\n\nContext:\n- Language/Framework: React\n- What I'm trying to do: Render a list of items from API\n- What I've tried: Added console.log, data looks correct\n\nPlease:\n1. Explain what this error means\n2. Identify likely causes\n3. Provide step-by-step debugging approach\n4. Give the most likely solution with code",
        tags: ['debugging', 'error', 'programming'],
        effectiveness: 'high',
        difficulty: 'beginner',
    },
    {
        id: 'prompt-generator',
        name: 'Prompt Generator',
        category: 'specialized',
        description: 'Generate effective prompts for any task',
        template: `I need help with: {task}

Generate an effective prompt for this that includes:
1. Clear context and role specification
2. Specific instructions with constraints
3. Output format specification
4. Examples if helpful

Then explain WHY this prompt structure works.`,
        example: "I need help with: Getting AI to write marketing copy that converts\n\nGenerate an effective prompt for this that includes:\n1. Clear context and role specification\n2. Specific instructions with constraints\n3. Output format specification\n4. Examples if helpful\n\nThen explain WHY this prompt structure works.",
        tags: ['meta', 'prompt-engineering', 'helper'],
        effectiveness: 'high',
        difficulty: 'advanced',
    },
];

/**
 * Get patterns by category
 */
export function getPatternsByCategory(category: PatternCategory): PromptPattern[] {
    return PROMPT_PATTERNS.filter(p => p.category === category);
}

/**
 * Search patterns
 */
export function searchPatterns(query: string): PromptPattern[] {
    const lower = query.toLowerCase();
    return PROMPT_PATTERNS.filter(p =>
        p.name.toLowerCase().includes(lower) ||
        p.description.toLowerCase().includes(lower) ||
        p.tags.some(t => t.includes(lower))
    );
}

/**
 * Get high-effectiveness patterns
 */
export function getTopPatterns(): PromptPattern[] {
    return PROMPT_PATTERNS.filter(p => p.effectiveness === 'high');
}
