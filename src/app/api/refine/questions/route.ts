/**
 * Refine Questions API Route
 * POST /api/refine/questions
 */

import { NextRequest, NextResponse } from 'next/server';
import { generateRefineQuestions } from '@/core/services/enhance';
import { handleApiError } from '@/shared/utils';
import type { RefineQuestionsRequest, RefineQuestionsResponse } from '@/shared/types';

export async function POST(request: NextRequest): Promise<NextResponse<RefineQuestionsResponse>> {
    try {
        const body: RefineQuestionsRequest = await request.json();
        const { prompt, provider } = body;

        if (!prompt) {
            return NextResponse.json(
                { questions: [], success: false, error: 'Prompt is required' },
                { status: 400 }
            );
        }

        const result = await generateRefineQuestions(prompt, provider);

        return NextResponse.json({
            questions: result.questions,
            success: true,
        });
    } catch (error) {
        const { message, statusCode } = handleApiError(error);
        return NextResponse.json(
            { questions: [], success: false, error: message },
            { status: statusCode }
        );
    }
}
