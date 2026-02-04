/**
 * MUI Theme Configuration
 * Premium dark theme with glassmorphism effects
 */

'use client';

import { createTheme, alpha } from '@mui/material/styles';

// Color Palette
const palette = {
    primary: {
        main: '#6366f1', // Indigo
        light: '#818cf8',
        dark: '#4f46e5',
        contrastText: '#ffffff',
    },
    secondary: {
        main: '#10b981', // Emerald
        light: '#34d399',
        dark: '#059669',
        contrastText: '#ffffff',
    },
    background: {
        default: '#0f0f23',
        paper: '#1a1a2e',
    },
    text: {
        primary: '#f1f5f9',
        secondary: '#94a3b8',
    },
    error: {
        main: '#ef4444',
        light: '#f87171',
        dark: '#dc2626',
    },
    success: {
        main: '#10b981',
        light: '#34d399',
        dark: '#059669',
    },
    warning: {
        main: '#f59e0b',
        light: '#fbbf24',
        dark: '#d97706',
    },
    divider: alpha('#ffffff', 0.1),
};

// Custom theme
export const theme = createTheme({
    palette: {
        mode: 'dark',
        ...palette,
    },
    typography: {
        fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
        h1: {
            fontSize: '2.5rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 600,
            letterSpacing: '-0.01em',
        },
        h3: {
            fontSize: '1.5rem',
            fontWeight: 600,
        },
        h4: {
            fontSize: '1.25rem',
            fontWeight: 600,
        },
        body1: {
            fontSize: '1rem',
            lineHeight: 1.6,
        },
        body2: {
            fontSize: '0.875rem',
            lineHeight: 1.5,
        },
        button: {
            textTransform: 'none',
            fontWeight: 600,
        },
    },
    shape: {
        borderRadius: 12,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                body: {
                    background: `linear-gradient(135deg, ${palette.background.default} 0%, #16162a 50%, #1a1a2e 100%)`,
                    minHeight: '100vh',
                },
            },
        },
        MuiButton: {
            defaultProps: {
                disableElevation: true,
            },
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    padding: '10px 24px',
                    fontSize: '0.9375rem',
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'translateY(-1px)',
                    },
                },
                contained: {
                    boxShadow: `0 4px 14px 0 ${alpha(palette.primary.main, 0.39)}`,
                    '&:hover': {
                        boxShadow: `0 6px 20px 0 ${alpha(palette.primary.main, 0.5)}`,
                    },
                },
                outlined: {
                    borderWidth: 2,
                    '&:hover': {
                        borderWidth: 2,
                        backgroundColor: alpha(palette.primary.main, 0.1),
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    background: alpha(palette.background.paper, 0.6),
                    backdropFilter: 'blur(20px)',
                    border: `1px solid ${alpha('#ffffff', 0.1)}`,
                    boxShadow: `0 8px 32px 0 ${alpha('#000000', 0.37)}`,
                },
            },
        },
        MuiPaper: {
            styleOverrides: {
                root: {
                    backgroundImage: 'none',
                },
            },
        },
        MuiTextField: {
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        background: alpha(palette.background.paper, 0.4),
                        backdropFilter: 'blur(10px)',
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                            background: alpha(palette.background.paper, 0.6),
                        },
                        '&.Mui-focused': {
                            background: alpha(palette.background.paper, 0.8),
                            boxShadow: `0 0 0 2px ${alpha(palette.primary.main, 0.3)}`,
                        },
                    },
                },
            },
        },
        MuiIconButton: {
            styleOverrides: {
                root: {
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                        transform: 'scale(1.1)',
                        backgroundColor: alpha(palette.primary.main, 0.1),
                    },
                },
            },
        },
        MuiTooltip: {
            styleOverrides: {
                tooltip: {
                    background: alpha(palette.background.paper, 0.9),
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha('#ffffff', 0.1)}`,
                    fontSize: '0.875rem',
                },
            },
        },
        MuiCircularProgress: {
            styleOverrides: {
                root: {
                    color: palette.primary.main,
                },
            },
        },
    },
});

export default theme;
