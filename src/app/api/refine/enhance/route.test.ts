/**
 * @jest-environment node
 */

import { POST } from './route';
import { NextRequest } from 'next/server';
import { enhanceWithContext } from '@/core/services/enhance';
import { AppError } from '@/shared/utils';

// Mock the enhance service
jest.mock('@/core/services/enhance', () => ({
    enhanceWithContext: jest.fn(),
}));

describe('POST /api/refine/enhance', () => {
    const mockEnhanceWithContext = enhanceWithContext as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if prompt is missing', async () => {
        const request = new NextRequest('http://localhost/api/refine/enhance', {
            method: 'POST',
            body: JSON.stringify({ answers: { q: 'a' } }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Prompt is required');
    });

    it('should return 400 if answers are missing', async () => {
        const request = new NextRequest('http://localhost/api/refine/enhance', {
            method: 'POST',
            body: JSON.stringify({ prompt: 'test', answers: {} }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.error).toBe('Answers are required');
    });

    it('should return enhanced prompt on success', async () => {
        mockEnhanceWithContext.mockResolvedValue({
            enhancedPrompt: 'Enhanced',
            provider: 'openai',
        });

        const answers = { 'Q1': 'A1' };
        const request = new NextRequest('http://localhost/api/refine/enhance', {
            method: 'POST',
            body: JSON.stringify({ prompt: 'test', answers }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.enhancedPrompt).toBe('Enhanced');
        expect(mockEnhanceWithContext).toHaveBeenCalledWith('test', answers, undefined);
    });
});
