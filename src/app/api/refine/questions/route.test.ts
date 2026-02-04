/**
 * @jest-environment node
 */

import { POST } from './route';
import { NextRequest } from 'next/server';
import { generateRefineQuestions } from '@/core/services/enhance';
import { AppError } from '@/shared/utils';

// Mock the enhance service
jest.mock('@/core/services/enhance', () => ({
    generateRefineQuestions: jest.fn(),
}));

describe('POST /api/refine/questions', () => {
    const mockGenerateQuestions = generateRefineQuestions as jest.Mock;

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should return 400 if prompt is missing', async () => {
        const request = new NextRequest('http://localhost/api/refine/questions', {
            method: 'POST',
            body: JSON.stringify({}),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(400);
        expect(data.success).toBe(false);
        expect(data.error).toBe('Prompt is required');
    });

    it('should return questions on success', async () => {
        const questions = ['Q1', 'Q2'];
        mockGenerateQuestions.mockResolvedValue({
            questions,
            provider: 'openai',
        });

        const request = new NextRequest('http://localhost/api/refine/questions', {
            method: 'POST',
            body: JSON.stringify({ prompt: 'test' }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(200);
        expect(data.success).toBe(true);
        expect(data.questions).toEqual(questions);
        expect(mockGenerateQuestions).toHaveBeenCalledWith('test', undefined);
    });

    it('should handle service errors', async () => {
        mockGenerateQuestions.mockRejectedValue(new Error('Unknown error'));

        const request = new NextRequest('http://localhost/api/refine/questions', {
            method: 'POST',
            body: JSON.stringify({ prompt: 'test' }),
        });

        const response = await POST(request);
        const data = await response.json();

        expect(response.status).toBe(500);
        expect(data.error).toBe('Unknown error');
    });
});
