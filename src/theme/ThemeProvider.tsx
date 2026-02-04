/**
 * MUI Theme Provider Wrapper
 * Provides theme context to the application
 */

'use client';

import { ReactNode } from 'react';
import { ThemeProvider as MUIThemeProvider, CssBaseline } from '@mui/material';
import { theme } from './theme';

interface ThemeProviderProps {
    children: ReactNode;
}

import { AppRouterCacheProvider } from '@mui/material-nextjs/v16-appRouter';

export function ThemeProvider({ children }: ThemeProviderProps) {
    return (
        <AppRouterCacheProvider>
            <MUIThemeProvider theme={theme}>
                <CssBaseline />
                {children}
            </MUIThemeProvider>
        </AppRouterCacheProvider>
    );
}

export default ThemeProvider;
