/**
 * Curated Templates Data
 * 25 templates across 5 categories: Coding, Writing, Marketing, Productivity, Creative
 */

import { PromptTemplate } from '../core/templates/template.types';

export const CURATED_TEMPLATES: PromptTemplate[] = [
    // =============================================================================
    // CODING TEMPLATES (5)
    // =============================================================================
    {
        id: 'coding-code-review',
        name: 'Code Review',
        description: 'Get a thorough code review with best practices and improvements',
        category: 'coding',
        template: `Review the following {language} code for:
- Code quality and readability
- Potential bugs or edge cases
- Performance optimizations
- Best practices and design patterns

{additionalFocus}

Code to review:
\`\`\`{language}
{code}
\`\`\`

Provide specific, actionable feedback with code examples where helpful.`,
        variables: [
            { name: 'language', label: 'Programming Language', type: 'select', options: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Rust', 'C++'], required: true },
            { name: 'code', label: 'Code to Review', type: 'textarea', placeholder: 'Paste your code here...', required: true },
            { name: 'additionalFocus', label: 'Additional Focus Areas', type: 'text', placeholder: 'e.g., security, accessibility...', required: false },
        ],
        tags: ['code', 'review', 'quality', 'best practices'],
    },
    {
        id: 'coding-bug-fix',
        name: 'Bug Fix Helper',
        description: 'Debug and fix issues in your code',
        category: 'coding',
        template: `I have a bug in my {language} code.

**Expected behavior:**
{expectedBehavior}

**Actual behavior:**
{actualBehavior}

**Error message (if any):**
{errorMessage}

**Code with the bug:**
\`\`\`{language}
{code}
\`\`\`

Please:
1. Identify the root cause of the bug
2. Explain why it's happening
3. Provide a corrected version of the code
4. Suggest how to prevent similar bugs in the future`,
        variables: [
            { name: 'language', label: 'Programming Language', type: 'select', options: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Rust'], required: true },
            { name: 'expectedBehavior', label: 'Expected Behavior', type: 'text', placeholder: 'What should happen?', required: true },
            { name: 'actualBehavior', label: 'Actual Behavior', type: 'text', placeholder: 'What actually happens?', required: true },
            { name: 'errorMessage', label: 'Error Message', type: 'textarea', placeholder: 'Paste any error messages...', required: false },
            { name: 'code', label: 'Code with Bug', type: 'textarea', placeholder: 'Paste the buggy code...', required: true },
        ],
        tags: ['debug', 'fix', 'error', 'troubleshoot'],
    },
    {
        id: 'coding-refactor',
        name: 'Code Refactor',
        description: 'Refactor code for better structure and maintainability',
        category: 'coding',
        template: `Refactor the following {language} code with focus on:
{refactorGoals}

Current code:
\`\`\`{language}
{code}
\`\`\`

Please provide:
1. The refactored code
2. Explanation of changes made
3. Benefits of the refactoring`,
        variables: [
            { name: 'language', label: 'Programming Language', type: 'select', options: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go'], required: true },
            { name: 'refactorGoals', label: 'Refactoring Goals', type: 'select', options: ['Improve readability', 'Reduce complexity', 'Apply SOLID principles', 'Optimize performance', 'Add type safety'], required: true },
            { name: 'code', label: 'Code to Refactor', type: 'textarea', placeholder: 'Paste code to refactor...', required: true },
        ],
        tags: ['refactor', 'clean code', 'architecture'],
    },
    {
        id: 'coding-explain',
        name: 'Explain Code',
        description: 'Get a clear explanation of complex code',
        category: 'coding',
        template: `Explain the following {language} code in {explanationLevel} terms.

\`\`\`{language}
{code}
\`\`\`

Please provide:
1. A high-level overview of what the code does
2. Line-by-line breakdown of key parts
3. Any patterns or techniques used
4. Potential gotchas or important notes`,
        variables: [
            { name: 'language', label: 'Programming Language', type: 'select', options: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go', 'Rust', 'C++'], required: true },
            { name: 'explanationLevel', label: 'Explanation Level', type: 'select', options: ['beginner-friendly', 'intermediate', 'technical/advanced'], required: true },
            { name: 'code', label: 'Code to Explain', type: 'textarea', placeholder: 'Paste code to explain...', required: true },
        ],
        tags: ['explain', 'learn', 'understand'],
    },
    {
        id: 'coding-write-tests',
        name: 'Write Tests',
        description: 'Generate comprehensive unit tests for your code',
        category: 'coding',
        template: `Write {testFramework} unit tests for the following {language} code:

\`\`\`{language}
{code}
\`\`\`

Requirements:
- Cover happy path scenarios
- Include edge cases and error scenarios
- Use descriptive test names
- Add comments explaining test purpose
- Aim for high coverage`,
        variables: [
            { name: 'language', label: 'Programming Language', type: 'select', options: ['TypeScript', 'JavaScript', 'Python', 'Java', 'Go'], required: true },
            { name: 'testFramework', label: 'Test Framework', type: 'select', options: ['Jest', 'Vitest', 'pytest', 'JUnit', 'Go testing'], required: true },
            { name: 'code', label: 'Code to Test', type: 'textarea', placeholder: 'Paste code to generate tests for...', required: true },
        ],
        tags: ['tests', 'unit tests', 'coverage', 'TDD'],
    },

    // =============================================================================
    // WRITING TEMPLATES (5)
    // =============================================================================
    {
        id: 'writing-blog-outline',
        name: 'Blog Post Outline',
        description: 'Create a structured outline for your blog post',
        category: 'writing',
        template: `Create a detailed blog post outline about: {topic}

Target audience: {audience}
Desired length: {length}
Tone: {tone}

Include:
1. Compelling title options (3 variations)
2. Hook/introduction approach
3. Main sections with sub-points
4. Key takeaways
5. Call to action ideas`,
        variables: [
            { name: 'topic', label: 'Blog Topic', type: 'text', placeholder: 'What is your blog post about?', required: true },
            { name: 'audience', label: 'Target Audience', type: 'text', placeholder: 'e.g., developers, marketers, beginners...', required: true },
            { name: 'length', label: 'Desired Length', type: 'select', options: ['Short (500-800 words)', 'Medium (1000-1500 words)', 'Long-form (2000+ words)'], required: true },
            { name: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Casual', 'Educational', 'Humorous', 'Inspirational'], required: true },
        ],
        tags: ['blog', 'outline', 'content', 'structure'],
    },
    {
        id: 'writing-email-draft',
        name: 'Email Draft',
        description: 'Draft professional emails quickly',
        category: 'writing',
        template: `Write a {emailType} email with the following details:

**Purpose:** {purpose}
**Recipient:** {recipient}
**Key points to include:**
{keyPoints}

**Tone:** {tone}

Provide the email with:
- Subject line
- Greeting
- Body
- Professional closing`,
        variables: [
            { name: 'emailType', label: 'Email Type', type: 'select', options: ['Follow-up', 'Introduction', 'Request', 'Thank you', 'Apology', 'Proposal'], required: true },
            { name: 'purpose', label: 'Email Purpose', type: 'text', placeholder: 'What is the main goal of this email?', required: true },
            { name: 'recipient', label: 'Recipient Context', type: 'text', placeholder: 'e.g., hiring manager, client, colleague...', required: true },
            { name: 'keyPoints', label: 'Key Points', type: 'textarea', placeholder: 'List the main points to cover...', required: true },
            { name: 'tone', label: 'Tone', type: 'select', options: ['Formal', 'Professional but warm', 'Casual', 'Urgent'], required: true },
        ],
        tags: ['email', 'professional', 'communication'],
    },
    {
        id: 'writing-summarize',
        name: 'Summarize Text',
        description: 'Condense long content into key points',
        category: 'writing',
        template: `Summarize the following text in {summaryLength}.

**Format:** {format}

Text to summarize:
{text}

Focus on the most important points and main takeaways.`,
        variables: [
            { name: 'text', label: 'Text to Summarize', type: 'textarea', placeholder: 'Paste the text you want summarized...', required: true },
            { name: 'summaryLength', label: 'Summary Length', type: 'select', options: ['1-2 sentences', '1 paragraph', '3-5 bullet points', '1 page summary'], required: true },
            { name: 'format', label: 'Output Format', type: 'select', options: ['Bullet points', 'Paragraph', 'Executive summary', 'TL;DR'], required: true },
        ],
        tags: ['summarize', 'condense', 'digest'],
    },
    {
        id: 'writing-rewrite-tone',
        name: 'Rewrite Tone',
        description: 'Change the tone of your writing',
        category: 'writing',
        template: `Rewrite the following text to be more {targetTone}.

Original text:
{text}

Keep the core message but adjust:
- Word choice
- Sentence structure
- Overall voice

Provide the rewritten version.`,
        variables: [
            { name: 'text', label: 'Text to Rewrite', type: 'textarea', placeholder: 'Paste text to change tone...', required: true },
            { name: 'targetTone', label: 'Target Tone', type: 'select', options: ['Professional', 'Casual/Friendly', 'Academic', 'Persuasive', 'Empathetic', 'Authoritative'], required: true },
        ],
        tags: ['rewrite', 'tone', 'voice'],
    },
    {
        id: 'writing-proofread',
        name: 'Proofread & Edit',
        description: 'Polish your writing for clarity and correctness',
        category: 'writing',
        template: `Proofread and edit the following text for:
- Grammar and spelling errors
- Clarity and readability
- Sentence structure
- Word choice improvements

{additionalInstructions}

Text to proofread:
{text}

Provide:
1. The corrected text
2. Summary of changes made`,
        variables: [
            { name: 'text', label: 'Text to Proofread', type: 'textarea', placeholder: 'Paste text to proofread...', required: true },
            { name: 'additionalInstructions', label: 'Additional Instructions', type: 'text', placeholder: 'Any specific focus areas?', required: false },
        ],
        tags: ['proofread', 'edit', 'grammar', 'polish'],
    },

    // =============================================================================
    // MARKETING TEMPLATES (5)
    // =============================================================================
    {
        id: 'marketing-ad-copy',
        name: 'Ad Copy',
        description: 'Create compelling ad copy for any platform',
        category: 'marketing',
        template: `Create {adType} ad copy for:

**Product/Service:** {product}
**Target Audience:** {audience}
**Key Benefit:** {keyBenefit}
**Call to Action:** {cta}

Platform: {platform}

Provide 3 variations with different angles/hooks.`,
        variables: [
            { name: 'adType', label: 'Ad Type', type: 'select', options: ['Awareness', 'Consideration', 'Conversion', 'Retargeting'], required: true },
            { name: 'product', label: 'Product/Service', type: 'text', placeholder: 'What are you advertising?', required: true },
            { name: 'audience', label: 'Target Audience', type: 'text', placeholder: 'Who is this for?', required: true },
            { name: 'keyBenefit', label: 'Key Benefit', type: 'text', placeholder: 'Main value proposition...', required: true },
            { name: 'cta', label: 'Call to Action', type: 'text', placeholder: 'e.g., Sign up, Learn more...', required: true },
            { name: 'platform', label: 'Platform', type: 'select', options: ['Facebook/Instagram', 'Google Ads', 'LinkedIn', 'Twitter/X', 'TikTok'], required: true },
        ],
        tags: ['ads', 'copy', 'marketing', 'conversion'],
    },
    {
        id: 'marketing-landing-page',
        name: 'Landing Page Copy',
        description: 'Write high-converting landing page content',
        category: 'marketing',
        template: `Write landing page copy for:

**Product/Service:** {product}
**Target Audience:** {audience}
**Main Problem Solved:** {problem}
**Key Features:** {features}
**Social Proof:** {socialProof}

Include:
1. Headline (3 options)
2. Subheadline
3. Hero section copy
4. Benefits section
5. Feature highlights
6. CTA button text options`,
        variables: [
            { name: 'product', label: 'Product/Service', type: 'text', required: true },
            { name: 'audience', label: 'Target Audience', type: 'text', required: true },
            { name: 'problem', label: 'Problem Solved', type: 'textarea', required: true },
            { name: 'features', label: 'Key Features', type: 'textarea', placeholder: 'List main features...', required: true },
            { name: 'socialProof', label: 'Social Proof', type: 'text', placeholder: 'e.g., 10,000+ users, Featured in...', required: false },
        ],
        tags: ['landing page', 'conversion', 'copy'],
    },
    {
        id: 'marketing-social-post',
        name: 'Social Media Post',
        description: 'Create engaging social media content',
        category: 'marketing',
        template: `Create a {platform} post about: {topic}

Goal: {goal}
Tone: {tone}
Include hashtags: {includeHashtags}

Provide:
1. Main post text
2. Hook/opening line options
3. Relevant hashtags (if applicable)
4. Best time to post suggestion`,
        variables: [
            { name: 'platform', label: 'Platform', type: 'select', options: ['Twitter/X', 'LinkedIn', 'Instagram', 'Facebook', 'TikTok'], required: true },
            { name: 'topic', label: 'Topic/Content', type: 'textarea', placeholder: 'What do you want to post about?', required: true },
            { name: 'goal', label: 'Post Goal', type: 'select', options: ['Engagement', 'Drive traffic', 'Build authority', 'Promote product', 'Share knowledge'], required: true },
            { name: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Casual', 'Thought leadership', 'Fun/Playful'], required: true },
            { name: 'includeHashtags', label: 'Include Hashtags', type: 'select', options: ['Yes', 'No'], required: true },
        ],
        tags: ['social media', 'post', 'engagement'],
    },
    {
        id: 'marketing-seo-meta',
        name: 'SEO Meta Tags',
        description: 'Generate SEO-optimized meta titles and descriptions',
        category: 'marketing',
        template: `Create SEO meta tags for a page about: {pageContent}

Target keyword: {keyword}
Page type: {pageType}

Provide:
1. Meta title (50-60 characters) - 3 options
2. Meta description (150-160 characters) - 3 options
3. URL slug suggestion
4. H1 heading options`,
        variables: [
            { name: 'pageContent', label: 'Page Content Summary', type: 'textarea', required: true },
            { name: 'keyword', label: 'Target Keyword', type: 'text', required: true },
            { name: 'pageType', label: 'Page Type', type: 'select', options: ['Homepage', 'Product page', 'Blog post', 'Service page', 'About page'], required: true },
        ],
        tags: ['SEO', 'meta', 'search', 'optimization'],
    },
    {
        id: 'marketing-product-description',
        name: 'Product Description',
        description: 'Write compelling product descriptions',
        category: 'marketing',
        template: `Write a product description for:

**Product Name:** {productName}
**Product Category:** {category}
**Key Features:** {features}
**Target Customer:** {targetCustomer}
**Price Point:** {pricePoint}

Include:
1. Headline/tagline
2. Short description (1-2 sentences)
3. Full description (2-3 paragraphs)
4. Bullet point features
5. Why buy now (urgency/value)`,
        variables: [
            { name: 'productName', label: 'Product Name', type: 'text', required: true },
            { name: 'category', label: 'Category', type: 'text', required: true },
            { name: 'features', label: 'Key Features', type: 'textarea', required: true },
            { name: 'targetCustomer', label: 'Target Customer', type: 'text', required: true },
            { name: 'pricePoint', label: 'Price Point', type: 'select', options: ['Budget', 'Mid-range', 'Premium', 'Luxury'], required: true },
        ],
        tags: ['product', 'e-commerce', 'description'],
    },

    // =============================================================================
    // PRODUCTIVITY TEMPLATES (5)
    // =============================================================================
    {
        id: 'productivity-meeting-notes',
        name: 'Meeting Notes',
        description: 'Summarize and organize meeting discussions',
        category: 'productivity',
        template: `Organize the following meeting notes into a structured summary:

Meeting raw notes:
{rawNotes}

Format as:
1. **Meeting Overview** (date, attendees if mentioned, purpose)
2. **Key Discussion Points**
3. **Decisions Made**
4. **Action Items** (with owners if mentioned)
5. **Follow-up Required**`,
        variables: [
            { name: 'rawNotes', label: 'Raw Meeting Notes', type: 'textarea', placeholder: 'Paste your rough meeting notes...', required: true },
        ],
        tags: ['meeting', 'notes', 'organize', 'summary'],
    },
    {
        id: 'productivity-task-breakdown',
        name: 'Task Breakdown',
        description: 'Break down large tasks into manageable steps',
        category: 'productivity',
        template: `Break down the following task into actionable steps:

**Task:** {task}
**Timeline:** {timeline}
**Resources available:** {resources}

Provide:
1. Step-by-step breakdown
2. Estimated time for each step
3. Dependencies between steps
4. Potential blockers
5. Success criteria`,
        variables: [
            { name: 'task', label: 'Task to Break Down', type: 'textarea', required: true },
            { name: 'timeline', label: 'Timeline', type: 'select', options: ['Today', 'This week', 'This month', 'This quarter'], required: true },
            { name: 'resources', label: 'Available Resources', type: 'text', placeholder: 'Team size, tools, budget...', required: false },
        ],
        tags: ['task', 'breakdown', 'planning', 'project'],
    },
    {
        id: 'productivity-decision-matrix',
        name: 'Decision Matrix',
        description: 'Compare options systematically to make better decisions',
        category: 'productivity',
        template: `Create a decision matrix to compare options:

**Decision:** {decision}
**Options:** {options}
**Key criteria to consider:** {criteria}

Provide:
1. Weighted criteria table
2. Score each option (1-10) against criteria
3. Calculate weighted scores
4. Recommendation with reasoning
5. Risks for top choice`,
        variables: [
            { name: 'decision', label: 'Decision to Make', type: 'text', required: true },
            { name: 'options', label: 'Options to Compare', type: 'textarea', placeholder: 'List options, one per line...', required: true },
            { name: 'criteria', label: 'Evaluation Criteria', type: 'textarea', placeholder: 'List criteria, e.g., cost, time, quality...', required: true },
        ],
        tags: ['decision', 'compare', 'analysis', 'matrix'],
    },
    {
        id: 'productivity-swot',
        name: 'SWOT Analysis',
        description: 'Analyze strengths, weaknesses, opportunities, and threats',
        category: 'productivity',
        template: `Perform a SWOT analysis for:

**Subject:** {subject}
**Context:** {context}

Provide detailed analysis of:
1. **Strengths** (internal positives)
2. **Weaknesses** (internal negatives)
3. **Opportunities** (external positives)
4. **Threats** (external negatives)
5. **Strategic recommendations** based on the analysis`,
        variables: [
            { name: 'subject', label: 'Subject of Analysis', type: 'text', placeholder: 'Company, product, project...', required: true },
            { name: 'context', label: 'Context/Background', type: 'textarea', placeholder: 'Relevant background information...', required: true },
        ],
        tags: ['SWOT', 'analysis', 'strategy', 'planning'],
    },
    {
        id: 'productivity-email-reply',
        name: 'Email Reply',
        description: 'Craft thoughtful email responses',
        category: 'productivity',
        template: `Write a reply to this email:

{originalEmail}

**My response should:**
{responseGoal}

**Tone:** {tone}

Provide a professional reply that addresses all points raised.`,
        variables: [
            { name: 'originalEmail', label: 'Original Email', type: 'textarea', placeholder: 'Paste the email you need to respond to...', required: true },
            { name: 'responseGoal', label: 'Response Goal', type: 'text', placeholder: 'What do you want to achieve?', required: true },
            { name: 'tone', label: 'Tone', type: 'select', options: ['Professional', 'Friendly', 'Firm but polite', 'Apologetic'], required: true },
        ],
        tags: ['email', 'reply', 'response', 'professional'],
    },

    // =============================================================================
    // CREATIVE TEMPLATES (5)
    // =============================================================================
    {
        id: 'creative-story-prompt',
        name: 'Story Prompt',
        description: 'Generate creative story starters and ideas',
        category: 'creative',
        template: `Generate a creative story prompt in the {genre} genre.

**Setting:** {setting}
**Main character type:** {character}
**Mood/tone:** {mood}

Include:
1. Opening hook (first paragraph)
2. Main conflict/challenge
3. Key characters to introduce
4. Central mystery or question
5. 3 possible plot directions`,
        variables: [
            { name: 'genre', label: 'Genre', type: 'select', options: ['Fantasy', 'Sci-Fi', 'Mystery', 'Romance', 'Horror', 'Thriller', 'Literary Fiction'], required: true },
            { name: 'setting', label: 'Setting', type: 'text', placeholder: 'Where/when does it take place?', required: true },
            { name: 'character', label: 'Main Character Type', type: 'text', placeholder: 'e.g., reluctant hero, detective...', required: true },
            { name: 'mood', label: 'Mood/Tone', type: 'select', options: ['Dark', 'Lighthearted', 'Mysterious', 'Epic', 'Intimate'], required: true },
        ],
        tags: ['story', 'creative writing', 'prompt', 'fiction'],
    },
    {
        id: 'creative-character-builder',
        name: 'Character Builder',
        description: 'Create detailed character profiles',
        category: 'creative',
        template: `Create a detailed character profile:

**Name:** {name}
**Role in story:** {role}
**Age range:** {age}
**Genre/Setting:** {genre}

Include:
1. Physical description
2. Personality traits (5-7)
3. Background/backstory
4. Motivations and goals
5. Fears and weaknesses
6. Key relationships
7. Signature habits or quirks
8. Character arc potential`,
        variables: [
            { name: 'name', label: 'Character Name', type: 'text', required: true },
            { name: 'role', label: 'Role in Story', type: 'select', options: ['Protagonist', 'Antagonist', 'Sidekick', 'Mentor', 'Love interest', 'Supporting'], required: true },
            { name: 'age', label: 'Age Range', type: 'select', options: ['Child', 'Teen', 'Young adult', 'Adult', 'Middle-aged', 'Elderly'], required: true },
            { name: 'genre', label: 'Genre/Setting', type: 'text', placeholder: 'e.g., Medieval fantasy, Modern NYC...', required: true },
        ],
        tags: ['character', 'profile', 'writing', 'creative'],
    },
    {
        id: 'creative-dialogue',
        name: 'Dialogue Generator',
        description: 'Create natural dialogue between characters',
        category: 'creative',
        template: `Write a dialogue scene between:

**Character 1:** {character1}
**Character 2:** {character2}
**Setting:** {setting}
**Conflict/Topic:** {topic}
**Emotional undertone:** {emotion}

Requirements:
- Natural, revealing dialogue
- Show don't tell
- Include subtext
- Distinct voices for each character
- Advance the relationship/plot`,
        variables: [
            { name: 'character1', label: 'Character 1', type: 'text', placeholder: 'Name and brief description...', required: true },
            { name: 'character2', label: 'Character 2', type: 'text', placeholder: 'Name and brief description...', required: true },
            { name: 'setting', label: 'Scene Setting', type: 'text', required: true },
            { name: 'topic', label: 'Conflict/Topic', type: 'text', required: true },
            { name: 'emotion', label: 'Emotional Undertone', type: 'select', options: ['Tense', 'Romantic', 'Confrontational', 'Humorous', 'Melancholy', 'Hopeful'], required: true },
        ],
        tags: ['dialogue', 'scene', 'characters', 'writing'],
    },
    {
        id: 'creative-world-building',
        name: 'World Building',
        description: 'Develop rich fictional worlds and settings',
        category: 'creative',
        template: `Help me build a fictional world:

**World type:** {worldType}
**Era/Tech level:** {techLevel}
**Core concept:** {concept}
**Mood:** {mood}

Develop:
1. Geography and environment
2. Civilizations/societies
3. Magic/technology systems
4. History (key events)
5. Economy and resources
6. Religions or belief systems
7. Conflicts and tensions
8. Unique cultural elements`,
        variables: [
            { name: 'worldType', label: 'World Type', type: 'select', options: ['Fantasy realm', 'Sci-fi planet', 'Post-apocalyptic', 'Alternate history', 'Urban fantasy', 'Steampunk'], required: true },
            { name: 'techLevel', label: 'Technology Level', type: 'select', options: ['Stone age', 'Medieval', 'Renaissance', 'Industrial', 'Modern', 'Far future'], required: true },
            { name: 'concept', label: 'Core Concept', type: 'textarea', placeholder: 'What makes this world unique?', required: true },
            { name: 'mood', label: 'World Mood', type: 'select', options: ['Hopeful', 'Grim', 'Mysterious', 'Whimsical', 'Epic'], required: true },
        ],
        tags: ['world building', 'setting', 'fantasy', 'creative'],
    },
    {
        id: 'creative-plot-twist',
        name: 'Plot Twist Generator',
        description: 'Generate unexpected but logical plot twists',
        category: 'creative',
        template: `Generate plot twist ideas for this story:

**Current plot summary:**
{plotSummary}

**Main characters:**
{characters}

**Genre:** {genre}
**Twist intensity:** {intensity}

Provide:
1. 3 possible plot twists
2. Foreshadowing hints for each
3. How it changes character dynamics
4. Impact on the story's theme`,
        variables: [
            { name: 'plotSummary', label: 'Current Plot Summary', type: 'textarea', required: true },
            { name: 'characters', label: 'Main Characters', type: 'textarea', placeholder: 'List main characters...', required: true },
            { name: 'genre', label: 'Genre', type: 'select', options: ['Mystery', 'Thriller', 'Fantasy', 'Romance', 'Sci-Fi', 'Drama'], required: true },
            { name: 'intensity', label: 'Twist Intensity', type: 'select', options: ['Subtle', 'Medium', 'Mind-blowing', 'Dark'], required: true },
        ],
        tags: ['plot twist', 'story', 'surprise', 'writing'],
    },
];
