/**
 * API Route: Analyze Prompt with LLM
 * Uses OpenAI to evaluate prompt quality semantically
 */

import { NextResponse } from 'next/server';
import OpenAI from 'openai';
import { getAnalyzerSystemPrompt, parseAnalysisResponse } from '@/core/analysis/llm-analyzer';

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        if (!prompt || typeof prompt !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Prompt is required' },
                { status: 400 }
            );
        }

        if (prompt.trim().length < 3) {
            return NextResponse.json(
                { success: false, error: 'Prompt is too short' },
                { status: 400 }
            );
        }

        const completion = await openai.chat.completions.create({
            model: 'gpt-4o-mini',  // Cost-effective for analysis
            messages: [
                { role: 'system', content: getAnalyzerSystemPrompt() },
                { role: 'user', content: `Analyze this prompt:\n\n"${prompt}"` },
            ],
            temperature: 0.3,  // More consistent scoring
            max_tokens: 500,
        });

        const responseContent = completion.choices[0]?.message?.content;

        if (!responseContent) {
            throw new Error('No response from LLM');
        }

        const analysis = parseAnalysisResponse(responseContent);

        return NextResponse.json({
            success: true,
            analysis,
        });
    } catch (error) {
        console.error('Prompt analysis error:', error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : 'Failed to analyze prompt',
            },
            { status: 500 }
        );
    }
}
