/**
 * Refine Enhance API Route
 * POST /api/refine/enhance
 */

import { NextRequest, NextResponse } from 'next/server';
import { enhanceWithContext } from '@/core/services/enhance';
import { handleApiError } from '@/shared/utils';
import type { RefineEnhanceRequest, RefineEnhanceResponse } from '@/shared/types';

export async function POST(request: NextRequest): Promise<NextResponse<RefineEnhanceResponse>> {
    try {
        const body: RefineEnhanceRequest = await request.json();
        const { prompt, answers, provider } = body;

        if (!prompt) {
            return NextResponse.json(
                { enhancedPrompt: '', success: false, error: 'Prompt is required' },
                { status: 400 }
            );
        }

        if (!answers || Object.keys(answers).length === 0) {
            return NextResponse.json(
                { enhancedPrompt: '', success: false, error: 'Answers are required' },
                { status: 400 }
            );
        }

        const result = await enhanceWithContext(prompt, answers, provider);

        return NextResponse.json({
            enhancedPrompt: result.enhancedPrompt,
            success: true,
        });
    } catch (error) {
        const { message, statusCode } = handleApiError(error);
        return NextResponse.json(
            { enhancedPrompt: '', success: false, error: message },
            { status: statusCode }
        );
    }
}
