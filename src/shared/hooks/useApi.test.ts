import { renderHook, act } from '@testing-library/react';
import { useApi } from './useApi';

describe('useApi', () => {
    it('should initialize with correct state', () => {
        const apiCall = jest.fn();
        const { result } = renderHook(() => useApi(apiCall));

        expect(result.current.data).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('should handle successful API call', async () => {
        const mockData = { id: 1 };
        const apiCall = jest.fn().mockResolvedValue(mockData);

        const { result } = renderHook(() => useApi(apiCall));

        await act(async () => {
            const response = await result.current.execute({ param: 'test' });
            expect(response).toBe(mockData);
        });

        expect(result.current.data).toBe(mockData);
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBeNull();
    });

    it('should handle API error', async () => {
        const errorMsg = 'API failed';
        const apiCall = jest.fn().mockRejectedValue(new Error(errorMsg));

        const { result } = renderHook(() => useApi(apiCall));

        await act(async () => {
            const response = await result.current.execute({});
            expect(response).toBeNull();
        });

        expect(result.current.data).toBeNull();
        expect(result.current.loading).toBe(false);
        expect(result.current.error).toBe(errorMsg);
    });

    it('should handle non-Error objects', async () => {
        const apiCall = jest.fn().mockRejectedValue('String error');

        const { result } = renderHook(() => useApi(apiCall));

        await act(async () => {
            await result.current.execute({});
        });

        expect(result.current.error).toBe('An error occurred');
    });

    it('should reset state', async () => {
        const apiCall = jest.fn().mockResolvedValue('data');
        const { result } = renderHook(() => useApi(apiCall));

        await act(async () => {
            await result.current.execute({});
        });

        expect(result.current.data).toBe('data');

        act(() => {
            result.current.reset();
        });

        expect(result.current.data).toBeNull();
        expect(result.current.error).toBeNull();
    });
});
