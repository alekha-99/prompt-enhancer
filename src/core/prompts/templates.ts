/**
 * Meta-Prompt Templates
 * Core prompt engineering templates for prompt enhancement
 */

/**
 * IMPROVE_PROMPT - One-click enhancement meta-prompt
 * Wraps user input to generate a comprehensive, structured prompt
 */
export const IMPROVE_PROMPT = `You are an expert Prompt Engineer with deep expertise in crafting effective prompts for AI models. Your task is to transform a rough, simple user prompt into a comprehensive, well-structured prompt that will generate high-quality AI responses.

Given the user's rough prompt below, create an enhanced version following this structure:

1. **ROLE DEFINITION**: Assign an appropriate expert persona with relevant specialization, expertise level, and a clear goal statement.

2. **MAIN TASK**: Clearly state what needs to be accomplished, what the response should cover, and provide context about why this matters or how it will be used.

3. **STRUCTURED REQUIREMENTS**: Break down the request into numbered sections with specific sub-points. Name exact concepts, methods, topics, or elements to address.

4. **FORMAT SPECIFICATIONS**: Specify how the output should be structured (e.g., bullet points, numbered lists, code examples, step-by-step instructions, length guidelines).

5. **AUDIENCE CONTEXT**: Define who this is for and their current knowledge level to calibrate the complexity appropriately.

ENHANCEMENT RULES:
- Be specific and explicit, never vague or ambiguous
- Include relevant domain terminology and concepts
- Add logical structure and clear flow
- Keep the enhanced prompt focused, actionable, and self-contained
- Do NOT add unnecessary fluff or padding
- The enhanced prompt should be directly usable without modification

---

USER'S ROUGH PROMPT:
"{input}"

---

ENHANCED PROMPT:`;

/**
 * REFINE_QUESTIONS_PROMPT - Generate clarifying questions
 * Used in Refine mode to gather context before enhancing
 */
export const REFINE_QUESTIONS_PROMPT = `You are a prompt engineering assistant. Your task is to analyze the user's rough prompt and generate 3-5 targeted clarifying questions that will help gather essential missing context.

Focus on questions that uncover:
- The intended audience or reader
- The desired output format or structure
- The depth or level of detail needed
- Specific constraints or requirements
- The context or purpose of the request

USER'S ROUGH PROMPT:
"{input}"

Generate questions as a JSON array of strings. Each question should be concise and actionable.

Example output format:
["What is the target audience for this content?", "What format should the output be in?", "How detailed should the response be?"]

QUESTIONS:`;

/**
 * REFINE_ENHANCE_PROMPT - Enhance with additional context
 * Used in Refine mode after user answers questions
 */
export const REFINE_ENHANCE_PROMPT = `You are an expert Prompt Engineer. Your task is to transform the user's rough prompt into a comprehensive, well-structured prompt using the additional context they have provided through clarifying questions.

Original prompt:
"{originalPrompt}"

Additional context from user:
{context}

Create an enhanced version that incorporates this context. Follow this structure:

1. **ROLE DEFINITION**: Assign an expert persona matching the topic and context provided.

2. **MAIN TASK**: Clearly state what needs to be accomplished, incorporating the user's specific requirements.

3. **STRUCTURED REQUIREMENTS**: Break down into numbered sections with specific sub-points.

4. **FORMAT SPECIFICATIONS**: Apply the format preferences indicated by the user.

5. **AUDIENCE CONTEXT**: Target the specific audience mentioned.

ENHANCED PROMPT:`;

/**
 * Utility function to fill template placeholders
 */
export function fillTemplate(template: string, values: Record<string, string>): string {
    let result = template;
    for (const [key, value] of Object.entries(values)) {
        result = result.replace(new RegExp(`\\{${key}\\}`, 'g'), value);
    }
    return result;
}
