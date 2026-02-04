/**
 * Unit Tests for Error Handler Utilities
 */

import {
    AppError,
    ValidationError,
    LLMError,
    ConfigurationError,
    handleApiError,
} from '@/shared/utils/error-handler';

describe('AppError', () => {
    it('should create error with correct properties', () => {
        const error = new AppError('Test error', 'TEST_CODE', 400, { detail: 'info' });

        expect(error.message).toBe('Test error');
        expect(error.code).toBe('TEST_CODE');
        expect(error.statusCode).toBe(400);
        expect(error.details).toEqual({ detail: 'info' });
        expect(error.name).toBe('AppError');
    });

    it('should default statusCode to 500', () => {
        const error = new AppError('Test', 'CODE');
        expect(error.statusCode).toBe(500);
    });

    it('should be instance of Error', () => {
        const error = new AppError('Test', 'CODE');
        expect(error).toBeInstanceOf(Error);
    });
});

describe('ValidationError', () => {
    it('should create with correct code and status', () => {
        const error = new ValidationError('Invalid input');

        expect(error.message).toBe('Invalid input');
        expect(error.code).toBe('VALIDATION_ERROR');
        expect(error.statusCode).toBe(400);
        expect(error.name).toBe('ValidationError');
    });

    it('should accept details', () => {
        const error = new ValidationError('Invalid', { field: 'email' });
        expect(error.details).toEqual({ field: 'email' });
    });
});

describe('LLMError', () => {
    it('should create with correct code and status', () => {
        const error = new LLMError('API failed');

        expect(error.message).toBe('API failed');
        expect(error.code).toBe('LLM_ERROR');
        expect(error.statusCode).toBe(502);
        expect(error.name).toBe('LLMError');
    });
});

describe('ConfigurationError', () => {
    it('should create with correct code and status', () => {
        const error = new ConfigurationError('Missing key');

        expect(error.message).toBe('Missing key');
        expect(error.code).toBe('CONFIG_ERROR');
        expect(error.statusCode).toBe(500);
        expect(error.name).toBe('ConfigurationError');
    });
});

describe('handleApiError', () => {
    it('should handle AppError', () => {
        const error = new AppError('App error', 'APP_CODE', 422);
        const result = handleApiError(error);

        expect(result.message).toBe('App error');
        expect(result.code).toBe('APP_CODE');
        expect(result.statusCode).toBe(422);
    });

    it('should handle ValidationError', () => {
        const error = new ValidationError('Validation failed');
        const result = handleApiError(error);

        expect(result.message).toBe('Validation failed');
        expect(result.code).toBe('VALIDATION_ERROR');
        expect(result.statusCode).toBe(400);
    });

    it('should handle generic Error', () => {
        const error = new Error('Generic error');
        const result = handleApiError(error);

        expect(result.message).toBe('Generic error');
        expect(result.code).toBe('UNKNOWN_ERROR');
        expect(result.statusCode).toBe(500);
    });

    it('should handle unknown error types', () => {
        const result = handleApiError('string error');

        expect(result.message).toBe('An unexpected error occurred');
        expect(result.code).toBe('UNKNOWN_ERROR');
        expect(result.statusCode).toBe(500);
    });

    it('should handle null/undefined', () => {
        const result = handleApiError(null);

        expect(result.message).toBe('An unexpected error occurred');
        expect(result.code).toBe('UNKNOWN_ERROR');
    });
});
