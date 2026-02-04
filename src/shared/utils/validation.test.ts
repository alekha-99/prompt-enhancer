/**
 * Unit Tests for Validation Utilities
 */

import {
    validatePrompt,
    sanitizePrompt,
    MIN_PROMPT_LENGTH,
    MAX_PROMPT_LENGTH,
} from '@/shared/utils/validation';

describe('validatePrompt', () => {
    it('should return invalid for empty string', () => {
        const result = validatePrompt('');
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Prompt is required');
    });

    it('should return invalid for null/undefined', () => {
        const result = validatePrompt(null as unknown as string);
        expect(result.isValid).toBe(false);
        expect(result.error).toBe('Prompt is required');
    });

    it('should return invalid for whitespace only', () => {
        const result = validatePrompt('   ');
        expect(result.isValid).toBe(false);
        expect(result.error).toContain(`at least ${MIN_PROMPT_LENGTH}`);
    });

    it('should return invalid for prompt shorter than minimum', () => {
        const result = validatePrompt('ab');
        expect(result.isValid).toBe(false);
        expect(result.error).toContain(`at least ${MIN_PROMPT_LENGTH}`);
    });

    it('should return invalid for prompt exceeding maximum length', () => {
        const longPrompt = 'a'.repeat(MAX_PROMPT_LENGTH + 1);
        const result = validatePrompt(longPrompt);
        expect(result.isValid).toBe(false);
        expect(result.error).toContain(`less than ${MAX_PROMPT_LENGTH}`);
    });

    it('should return valid for proper prompt', () => {
        const result = validatePrompt('explain react hooks');
        expect(result.isValid).toBe(true);
        expect(result.error).toBeUndefined();
    });

    it('should return valid for minimum length prompt', () => {
        const result = validatePrompt('abc');
        expect(result.isValid).toBe(true);
    });

    it('should return valid for maximum length prompt', () => {
        const maxPrompt = 'a'.repeat(MAX_PROMPT_LENGTH);
        const result = validatePrompt(maxPrompt);
        expect(result.isValid).toBe(true);
    });
});

describe('sanitizePrompt', () => {
    it('should trim whitespace from both ends', () => {
        expect(sanitizePrompt('  hello world  ')).toBe('hello world');
    });

    it('should preserve internal whitespace', () => {
        expect(sanitizePrompt('hello   world')).toBe('hello   world');
    });

    it('should handle empty string', () => {
        expect(sanitizePrompt('')).toBe('');
    });
});
