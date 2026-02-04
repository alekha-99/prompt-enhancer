/**
 * Enhance API Route - Improve Mode
 * POST /api/enhance
 */

import { NextRequest, NextResponse } from 'next/server';
import { enhancePrompt } from '@/core/services/enhance';
import { handleApiError } from '@/shared/utils';
import type { EnhanceRequest, EnhanceResponse } from '@/shared/types';

export async function POST(request: NextRequest): Promise<NextResponse<EnhanceResponse>> {
    try {
        const body: EnhanceRequest = await request.json();
        const { prompt, provider } = body;

        if (!prompt) {
            return NextResponse.json(
                { enhancedPrompt: '', success: false, error: 'Prompt is required' },
                { status: 400 }
            );
        }

        const result = await enhancePrompt(prompt, provider);

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
