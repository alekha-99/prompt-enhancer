/**
 * Health Check API Route
 * GET /api/health
 */

import { NextResponse } from 'next/server';
import { APP_VERSION } from '@/infrastructure/config';
import type { HealthCheckResponse } from '@/shared/types';

export async function GET(): Promise<NextResponse<HealthCheckResponse>> {
    return NextResponse.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        version: APP_VERSION,
    });
}
