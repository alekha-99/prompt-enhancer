import { renderHook, act } from '@testing-library/react';
import { useClipboard } from './useClipboard';

// Mock clipboard API
const mockWriteText = jest.fn();
const mockExecCommand = jest.fn();

Object.assign(navigator, {
    clipboard: {
        writeText: mockWriteText,
    },
});

Object.defineProperty(document, 'execCommand', {
    value: mockExecCommand,
});

Object.defineProperty(window, 'isSecureContext', {
    value: true,
    writable: true,
});

describe('useClipboard', () => {
    beforeEach(() => {
        mockWriteText.mockReset();
        mockExecCommand.mockReset();
        jest.useFakeTimers();
        // Default to secure context
        Object.defineProperty(window, 'isSecureContext', { value: true });
        // Default to having clipboard
        Object.defineProperty(navigator, 'clipboard', {
            value: { writeText: mockWriteText },
            writable: true
        });
    });

    afterEach(() => {
        jest.useRealTimers();
    });

    it('should initialize with copied=false', () => {
        const { result } = renderHook(() => useClipboard());
        expect(result.current.copied).toBe(false);
    });

    it('should copy text using navigator.clipboard', async () => {
        mockWriteText.mockResolvedValue(undefined);
        const { result } = renderHook(() => useClipboard());

        await act(async () => {
            const success = await result.current.copy('test text');
            expect(success).toBe(true);
        });

        expect(mockWriteText).toHaveBeenCalledWith('test text');
        expect(result.current.copied).toBe(true);
    });

    it('should fallback to execCommand when clipboard API undefined', async () => {
        // Remove clipboard API
        Object.defineProperty(navigator, 'clipboard', { value: undefined });
        mockExecCommand.mockReturnValue(true);

        const { result } = renderHook(() => useClipboard());

        await act(async () => {
            const success = await result.current.copy('fallback text');
            expect(success).toBe(true);
        });

        expect(mockExecCommand).toHaveBeenCalledWith('copy');
        expect(result.current.copied).toBe(true);
    });

    it('should reset copied state after delay', async () => {
        mockWriteText.mockResolvedValue(undefined);
        const { result } = renderHook(() => useClipboard(1000));

        await act(async () => {
            await result.current.copy('test text');
        });

        expect(result.current.copied).toBe(true);

        act(() => {
            jest.advanceTimersByTime(1000);
        });

        expect(result.current.copied).toBe(false);
    });

    it('should handle clipboard error', async () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
        mockWriteText.mockRejectedValue(new Error('Clipboard error'));

        const { result } = renderHook(() => useClipboard());

        await act(async () => {
            const success = await result.current.copy('test');
            expect(success).toBe(false);
        });

        expect(result.current.copied).toBe(false);
        consoleSpy.mockRestore();
    });
});
