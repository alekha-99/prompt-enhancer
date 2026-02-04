/**
 * @jest-environment node
 */

import { POST } from './route';
import { NextRequest } from 'next/server';
import { enhancePrompt } from '@/core/services/enhance';
import { AppError } from '@/shared/utils';

// Mock the enhance service
jest.mock('@/core/services/enhance', () => ({
    enhancePrompt: jest.fn(),
}));

describe('POST /api/enhance', () => {
    const mockEnhancePrompt = enhancePrompt as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if prompt is missing', async () => {
        const request = new NextRequest('http://localhost/api/enhance', {
            method: 'POST',
            body: JSON.stringify({}),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toBe('Prompt is required');
    });

    it('should return enhanced prompt on success', async () => {
        mockEnhancePrompt.mockResolvedValue({
            enhancedPrompt: 'Enhanced version',
            provider: 'openai',
        });

        const request = new NextRequest('http://localhost/api/enhance', {
            method: 'POST',
            body: JSON.stringify({ prompt: 'test' }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.enhancedPrompt).toBe('Enhanced version');
        expect(mockEnhancePrompt).toHaveBeenCalledWith('test', undefined);
    });

    it('should handle service errors', async () => {
        mockEnhancePrompt.mockRejectedValue(new AppError('Service failed', 'TEST_ERROR', 500));

        const request = new NextRequest('http://localhost/api/enhance', {
            method: 'POST',
            body: JSON.stringify({ prompt: 'test' }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.success).toBe(false);
        expect(data.error).toBe('Service failed');
    });

    it('should pass provider param to service', async () => {
        mockEnhancePrompt.mockResolvedValue({ enhancedPrompt: 'ok' });

        const request = new NextRequest('http://localhost/api/enhance', {
            method: 'POST',
            body: JSON.stringify({ prompt: 'test', provider: 'anthropic' }),
        });

        await POST(request);

        expect(mockEnhancePrompt).toHaveBeenCalledWith('test', 'anthropic');
    });
});
