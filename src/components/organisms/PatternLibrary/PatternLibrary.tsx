/**
 * PatternLibrary Component
 * Browse and apply prompt patterns
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
    Box,
    Typography,
    Chip,
    Button,
    TextField,
    InputAdornment,
    Tabs,
    Tab,
    Card,
    CardContent,
    CardActions,
    Collapse,
    IconButton,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
} from '@mui/material';
import {
    Search,
    ExpandMore,
    ExpandLess,
    ContentCopy,
    PlayArrow,
    Star,
    Info,
    Close,
} from '@mui/icons-material';
import {
    PROMPT_PATTERNS,
    PATTERN_CATEGORIES,
    PromptPattern,
    PatternCategory,
    searchPatterns,
    getPatternsByCategory,
} from '@/data/prompt-patterns';

interface PatternLibraryProps {
    onApplyPattern: (template: string) => void;
    compact?: boolean;
}

export function PatternLibrary({ onApplyPattern, compact = false }: PatternLibraryProps) {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState<PatternCategory | 'all'>('all');
    const [expandedPattern, setExpandedPattern] = useState<string | null>(null);
    const [previewPattern, setPreviewPattern] = useState<PromptPattern | null>(null);

    const filteredPatterns = useMemo(() => {
        let patterns = PROMPT_PATTERNS;

        if (searchQuery) {
            patterns = searchPatterns(searchQuery);
        } else if (selectedCategory !== 'all') {
            patterns = getPatternsByCategory(selectedCategory);
        }

        return patterns;
    }, [searchQuery, selectedCategory]);

    const handleApply = (pattern: PromptPattern) => {
        onApplyPattern(pattern.template);
    };

    const getEffectivenessColor = (effectiveness: PromptPattern['effectiveness']) => {
        switch (effectiveness) {
            case 'high': return '#22c55e';
            case 'medium': return '#eab308';
            case 'standard': return '#64748b';
        }
    };

    const getDifficultyColor = (difficulty: PromptPattern['difficulty']) => {
        switch (difficulty) {
            case 'beginner': return '#22c55e';
            case 'intermediate': return '#eab308';
            case 'advanced': return '#a855f7';
        }
    };

    return (
        <Box>
            {/* Search */}
            <TextField
                fullWidth
                size="small"
                placeholder="Search patterns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search sx={{ color: 'rgba(255,255,255,0.3)' }} />
                        </InputAdornment>
                    ),
                }}
                sx={{ mb: 2 }}
            />

            {/* Category Tabs */}
            <Tabs
                value={selectedCategory}
                onChange={(_, v) => {
                    setSelectedCategory(v);
                    setSearchQuery('');
                }}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                    mb: 2,
                    '& .MuiTab-root': {
                        minWidth: 'auto',
                        px: 2,
                        fontSize: '0.75rem',
                    },
                }}
            >
                <Tab value="all" label="All" />
                {Object.entries(PATTERN_CATEGORIES).map(([key, { label, icon }]) => (
                    <Tab key={key} value={key} label={`${icon} ${label}`} />
                ))}
            </Tabs>

            {/* Pattern Cards */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                {filteredPatterns.map((pattern) => (
                    <Card
                        key={pattern.id}
                        sx={{
                            backgroundColor: 'rgba(255,255,255,0.02)',
                            border: '1px solid rgba(255,255,255,0.08)',
                            '&:hover': {
                                borderColor: PATTERN_CATEGORIES[pattern.category].color,
                            },
                        }}
                    >
                        <CardContent sx={{ pb: 1 }}>
                            {/* Header */}
                            <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                                <Box sx={{ flex: 1 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        <Typography variant="subtitle2" sx={{ color: 'white', fontWeight: 600 }}>
                                            {pattern.name}
                                        </Typography>
                                        <Chip
                                            label={PATTERN_CATEGORIES[pattern.category].icon}
                                            size="small"
                                            sx={{
                                                height: 20,
                                                minWidth: 20,
                                                '& .MuiChip-label': { px: 0.5 },
                                            }}
                                        />
                                        {pattern.effectiveness === 'high' && (
                                            <Star sx={{ fontSize: 14, color: '#eab308' }} />
                                        )}
                                    </Box>
                                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)' }}>
                                        {pattern.description}
                                    </Typography>
                                </Box>
                                <IconButton
                                    size="small"
                                    onClick={() => setExpandedPattern(
                                        expandedPattern === pattern.id ? null : pattern.id
                                    )}
                                    sx={{ color: 'rgba(255,255,255,0.5)' }}
                                >
                                    {expandedPattern === pattern.id ? <ExpandLess /> : <ExpandMore />}
                                </IconButton>
                            </Box>

                            {/* Tags */}
                            <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
                                <Chip
                                    label={pattern.difficulty}
                                    size="small"
                                    sx={{
                                        height: 18,
                                        fontSize: '0.6rem',
                                        backgroundColor: `${getDifficultyColor(pattern.difficulty)}20`,
                                        color: getDifficultyColor(pattern.difficulty),
                                    }}
                                />
                                <Chip
                                    label={pattern.effectiveness}
                                    size="small"
                                    sx={{
                                        height: 18,
                                        fontSize: '0.6rem',
                                        backgroundColor: `${getEffectivenessColor(pattern.effectiveness)}20`,
                                        color: getEffectivenessColor(pattern.effectiveness),
                                    }}
                                />
                            </Box>

                            {/* Expanded Content */}
                            <Collapse in={expandedPattern === pattern.id}>
                                <Box sx={{ mt: 2 }}>
                                    <Typography variant="caption" sx={{ color: '#a855f7', fontWeight: 600, display: 'block', mb: 0.5 }}>
                                        Template:
                                    </Typography>
                                    <Box
                                        sx={{
                                            p: 1.5,
                                            borderRadius: 1,
                                            backgroundColor: 'rgba(0,0,0,0.3)',
                                            maxHeight: 150,
                                            overflow: 'auto',
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: 'rgba(255,255,255,0.8)',
                                                fontFamily: 'monospace',
                                                whiteSpace: 'pre-wrap',
                                            }}
                                        >
                                            {pattern.template}
                                        </Typography>
                                    </Box>

                                    {/* Tags list */}
                                    <Box sx={{ display: 'flex', gap: 0.5, mt: 1.5, flexWrap: 'wrap' }}>
                                        {pattern.tags.slice(0, 5).map((tag) => (
                                            <Chip
                                                key={tag}
                                                label={tag}
                                                size="small"
                                                sx={{
                                                    height: 18,
                                                    fontSize: '0.6rem',
                                                    backgroundColor: 'rgba(255,255,255,0.05)',
                                                    color: 'rgba(255,255,255,0.5)',
                                                }}
                                            />
                                        ))}
                                    </Box>
                                </Box>
                            </Collapse>
                        </CardContent>

                        <CardActions sx={{ px: 2, py: 1, pt: 0 }}>
                            <Button
                                size="small"
                                startIcon={<PlayArrow fontSize="small" />}
                                onClick={() => handleApply(pattern)}
                                sx={{ fontSize: '0.7rem' }}
                            >
                                Use Pattern
                            </Button>
                            <Tooltip title="View Example">
                                <IconButton
                                    size="small"
                                    onClick={() => setPreviewPattern(pattern)}
                                    sx={{ color: 'rgba(255,255,255,0.5)' }}
                                >
                                    <Info fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        </CardActions>
                    </Card>
                ))}
            </Box>

            {/* Preview Dialog */}
            <Dialog
                open={!!previewPattern}
                onClose={() => setPreviewPattern(null)}
                maxWidth="md"
                fullWidth
                PaperProps={{
                    sx: {
                        backgroundColor: '#1a1a1f',
                        backgroundImage: 'none',
                    },
                }}
            >
                {previewPattern && (
                    <>
                        <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <span>{PATTERN_CATEGORIES[previewPattern.category].icon}</span>
                                <Typography variant="h6">{previewPattern.name}</Typography>
                            </Box>
                            <IconButton onClick={() => setPreviewPattern(null)}>
                                <Close />
                            </IconButton>
                        </DialogTitle>
                        <DialogContent>
                            <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)', mb: 3 }}>
                                {previewPattern.description}
                            </Typography>

                            <Typography variant="subtitle2" sx={{ color: '#a855f7', mb: 1 }}>
                                📋 Template
                            </Typography>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 1,
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    mb: 3,
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'rgba(255,255,255,0.8)',
                                        fontFamily: 'monospace',
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    {previewPattern.template}
                                </Typography>
                            </Box>

                            <Typography variant="subtitle2" sx={{ color: '#22c55e', mb: 1 }}>
                                ✨ Example
                            </Typography>
                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 1,
                                    backgroundColor: 'rgba(34,197,94,0.1)',
                                    border: '1px solid rgba(34,197,94,0.2)',
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: 'rgba(255,255,255,0.8)',
                                        whiteSpace: 'pre-wrap',
                                    }}
                                >
                                    {previewPattern.example}
                                </Typography>
                            </Box>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={() => setPreviewPattern(null)}>Close</Button>
                            <Button
                                variant="contained"
                                startIcon={<PlayArrow />}
                                onClick={() => {
                                    handleApply(previewPattern);
                                    setPreviewPattern(null);
                                }}
                            >
                                Use This Pattern
                            </Button>
                        </DialogActions>
                    </>
                )}
            </Dialog>
        </Box>
    );
}
