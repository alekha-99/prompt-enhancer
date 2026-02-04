'use client';

import { useState, useCallback } from 'react';

interface UseApiState<T> {
    data: T | null;
    loading: boolean;
    error: string | null;
}

interface UseApiReturn<T, P> extends UseApiState<T> {
    execute: (params: P) => Promise<T | null>;
    reset: () => void;
}

export function useApi<T, P>(
    apiCall: (params: P) => Promise<T>
): UseApiReturn<T, P> {
    const [state, setState] = useState<UseApiState<T>>({
        data: null,
        loading: false,
        error: null,
    });

    const execute = useCallback(async (params: P): Promise<T | null> => {
        setState(prev => ({ ...prev, loading: true, error: null }));

        try {
            const result = await apiCall(params);
            setState({ data: result, loading: false, error: null });
            return result;
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'An error occurred';
            setState(prev => ({ ...prev, loading: false, error: errorMessage }));
            return null;
        }
    }, [apiCall]);

    const reset = useCallback(() => {
        setState({ data: null, loading: false, error: null });
    }, []);

    return {
        ...state,
        execute,
        reset,
    };
}
