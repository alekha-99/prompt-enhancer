/**
 * Redux Store Provider
 * Wraps app with Redux Provider
 */

'use client';

import { ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';
import { store } from '@/store/store';

interface StoreProviderProps {
    children: ReactNode;
}

export function StoreProvider({ children }: StoreProviderProps) {
    // Ensure store is only created once
    const storeRef = useRef(store);

    return <Provider store={storeRef.current}>{children}</Provider>;
}
