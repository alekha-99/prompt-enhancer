/**
 * SmartSuggestions Component
 * Real-time suggestions panel with quick-fix buttons
 */

'use client';

import React, { useMemo } from 'react';
import {
    Box,
    Typography,
    Chip,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Collapse,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Lightbulb,
    Add,
    Warning,
    TrendingUp,
    AutoFixHigh,
    ExpandMore,
    ExpandLess,
} from '@mui/icons-material';
import { generateSuggestions, Suggestion, getCategoryIcon, applyQuickFix } from '@/core/suggestions/suggestion-engine';

interface SmartSuggestionsProps {
    prompt: string;
    onApplyFix: (newPrompt: string) => void;
    compact?: boolean;
}

export function SmartSuggestions({ prompt, onApplyFix, compact = false }: SmartSuggestionsProps) {
    const [expanded, setExpanded] = React.useState(!compact);

    const suggestions = useMemo(() => {
        if (!prompt || prompt.length < 5) return [];
        return generateSuggestions(prompt);
    }, [prompt]);

    if (suggestions.length === 0) {
        return null;
    }

    const highPriority = suggestions.filter(s => s.priority === 'high');
    const otherPriority = suggestions.filter(s => s.priority !== 'high');

    const handleApplyFix = (suggestion: Suggestion) => {
        if (suggestion.quickFix) {
            const newPrompt = applyQuickFix(prompt, suggestion.quickFix);
            onApplyFix(newPrompt);
        }
    };

    const getTypeIcon = (type: Suggestion['type']) => {
        switch (type) {
            case 'add': return <Add fontSize="small" sx={{ color: '#22c55e' }} />;
            case 'warning': return <Warning fontSize="small" sx={{ color: '#eab308' }} />;
            case 'improve': return <TrendingUp fontSize="small" sx={{ color: '#3b82f6' }} />;
        }
    };

    const getTypeColor = (type: Suggestion['type']) => {
        switch (type) {
            case 'add': return '#22c55e';
            case 'warning': return '#eab308';
            case 'improve': return '#3b82f6';
        }
    };

    return (
        <Box
            sx={{
                p: 2,
                backgroundColor: 'rgba(234,179,8,0.05)',
                borderRadius: 2,
                border: '1px solid rgba(234,179,8,0.2)',
            }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Lightbulb sx={{ color: '#eab308', fontSize: 20 }} />
                    <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                        Smart Suggestions
                    </Typography>
                    <Chip
                        label={suggestions.length}
                        size="small"
                        sx={{
                            height: 18,
                            fontSize: '0.65rem',
                            backgroundColor: 'rgba(234,179,8,0.2)',
                            color: '#eab308',
                        }}
                    />
                </Box>
                <IconButton
                    size="small"
                    onClick={() => setExpanded(!expanded)}
                    sx={{ color: 'rgba(255,255,255,0.5)' }}
                >
                    {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
                </IconButton>
            </Box>

            <Collapse in={expanded}>
                {/* High Priority Suggestions */}
                {highPriority.length > 0 && (
                    <Box sx={{ mb: 2 }}>
                        <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600, display: 'block', mb: 1 }}>
                            ⚡ High Priority
                        </Typography>
                        <List dense sx={{ py: 0 }}>
                            {highPriority.map((suggestion) => (
                                <ListItem
                                    key={suggestion.id}
                                    sx={{
                                        px: 1.5,
                                        py: 1,
                                        mb: 0.5,
                                        borderRadius: 1,
                                        backgroundColor: 'rgba(255,255,255,0.03)',
                                        flexDirection: 'column',
                                        alignItems: 'flex-start',
                                    }}
                                >
                                    <Box sx={{ display: 'flex', alignItems: 'center', width: '100%', mb: 0.5 }}>
                                        <ListItemIcon sx={{ minWidth: 28 }}>
                                            <span style={{ fontSize: '1rem' }}>{getCategoryIcon(suggestion.category)}</span>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={suggestion.title}
                                            primaryTypographyProps={{
                                                variant: 'body2',
                                                sx: { color: 'white', fontWeight: 500 },
                                            }}
                                        />
                                        {getTypeIcon(suggestion.type)}
                                    </Box>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', ml: 3.5, display: 'block' }}>
                                        {suggestion.description}
                                    </Typography>
                                    {suggestion.quickFix && (
                                        <Button
                                            size="small"
                                            startIcon={<AutoFixHigh fontSize="small" />}
                                            onClick={() => handleApplyFix(suggestion)}
                                            sx={{
                                                mt: 1,
                                                ml: 3,
                                                fontSize: '0.7rem',
                                                color: getTypeColor(suggestion.type),
                                                borderColor: getTypeColor(suggestion.type),
                                                '&:hover': {
                                                    backgroundColor: `${getTypeColor(suggestion.type)}20`,
                                                    borderColor: getTypeColor(suggestion.type),
                                                },
                                            }}
                                            variant="outlined"
                                        >
                                            {suggestion.quickFix.label}
                                        </Button>
                                    )}
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                {/* Other Suggestions */}
                {otherPriority.length > 0 && (
                    <Box>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 1 }}>
                            💡 Other Suggestions
                        </Typography>
                        <List dense sx={{ py: 0 }}>
                            {otherPriority.slice(0, 3).map((suggestion) => (
                                <ListItem
                                    key={suggestion.id}
                                    sx={{
                                        px: 1.5,
                                        py: 0.75,
                                        mb: 0.5,
                                        borderRadius: 1,
                                        backgroundColor: 'rgba(255,255,255,0.02)',
                                    }}
                                >
                                    <ListItemIcon sx={{ minWidth: 24 }}>
                                        <span style={{ fontSize: '0.9rem' }}>{getCategoryIcon(suggestion.category)}</span>
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={suggestion.title}
                                        primaryTypographyProps={{
                                            variant: 'caption',
                                            sx: { color: 'rgba(255,255,255,0.8)' },
                                        }}
                                    />
                                    {suggestion.quickFix && (
                                        <Tooltip title={suggestion.quickFix.label}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleApplyFix(suggestion)}
                                                sx={{ color: getTypeColor(suggestion.type) }}
                                            >
                                                <AutoFixHigh fontSize="small" />
                                            </IconButton>
                                        </Tooltip>
                                    )}
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}
            </Collapse>
        </Box>
    );
}
