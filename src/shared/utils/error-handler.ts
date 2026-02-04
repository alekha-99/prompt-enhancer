/**
 * Error Handling Utilities
 */

export class AppError extends Error {
    public readonly code: string;
    public readonly statusCode: number;
    public readonly details?: unknown;

    constructor(message: string, code: string, statusCode = 500, details?: unknown) {
        super(message);
        this.name = 'AppError';
        this.code = code;
        this.statusCode = statusCode;
        this.details = details;

        // Maintains proper stack trace for where our error was thrown
        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, AppError);
        }
    }
}

export class ValidationError extends AppError {
    constructor(message: string, details?: unknown) {
        super(message, 'VALIDATION_ERROR', 400, details);
        this.name = 'ValidationError';
    }
}

export class LLMError extends AppError {
    constructor(message: string, details?: unknown) {
        super(message, 'LLM_ERROR', 502, details);
        this.name = 'LLMError';
    }
}

export class ConfigurationError extends AppError {
    constructor(message: string, details?: unknown) {
        super(message, 'CONFIG_ERROR', 500, details);
        this.name = 'ConfigurationError';
    }
}

export function handleApiError(error: unknown): { message: string; code: string; statusCode: number } {
    if (error instanceof AppError) {
        return {
            message: error.message,
            code: error.code,
            statusCode: error.statusCode,
        };
    }

    if (error instanceof Error) {
        return {
            message: error.message,
            code: 'UNKNOWN_ERROR',
            statusCode: 500,
        };
    }

    return {
        message: 'An unexpected error occurred',
        code: 'UNKNOWN_ERROR',
        statusCode: 500,
    };
}
