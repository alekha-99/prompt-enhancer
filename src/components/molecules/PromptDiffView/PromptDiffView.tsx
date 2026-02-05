/**
 * PromptDiffView Component
 * Side-by-side comparison of original and enhanced prompts
 */

'use client';

import React from 'react';
import { Box, Typography, Paper, Chip, Divider } from '@mui/material';
import { ArrowForward, Add, Remove, SwapHoriz } from '@mui/icons-material';

interface PromptDiffViewProps {
    original: string;
    enhanced: string;
}

interface DiffSegment {
    type: 'same' | 'added' | 'removed';
    text: string;
}

/**
 * Simple word-level diff algorithm
 */
function computeDiff(original: string, enhanced: string): { originalSegments: DiffSegment[]; enhancedSegments: DiffSegment[] } {
    const originalWords = original.split(/(\s+)/);
    const enhancedWords = enhanced.split(/(\s+)/);

    const originalSet = new Set(originalWords.map(w => w.toLowerCase().trim()));
    const enhancedSet = new Set(enhancedWords.map(w => w.toLowerCase().trim()));

    const originalSegments: DiffSegment[] = originalWords.map(word => {
        const cleanWord = word.toLowerCase().trim();
        if (!cleanWord) return { type: 'same', text: word };
        if (!enhancedSet.has(cleanWord)) {
            return { type: 'removed', text: word };
        }
        return { type: 'same', text: word };
    });

    const enhancedSegments: DiffSegment[] = enhancedWords.map(word => {
        const cleanWord = word.toLowerCase().trim();
        if (!cleanWord) return { type: 'same', text: word };
        if (!originalSet.has(cleanWord)) {
            return { type: 'added', text: word };
        }
        return { type: 'same', text: word };
    });

    return { originalSegments, enhancedSegments };
}

/**
 * Calculate diff statistics
 */
function calculateStats(original: string, enhanced: string) {
    const originalWords = original.split(/\s+/).filter(Boolean).length;
    const enhancedWords = enhanced.split(/\s+/).filter(Boolean).length;
    const wordDiff = enhancedWords - originalWords;
    const percentChange = originalWords > 0
        ? Math.round(((enhancedWords - originalWords) / originalWords) * 100)
        : 100;

    const originalChars = original.length;
    const enhancedChars = enhanced.length;

    return {
        originalWords,
        enhancedWords,
        wordDiff,
        percentChange,
        originalChars,
        enhancedChars,
    };
}

export function PromptDiffView({ original, enhanced }: PromptDiffViewProps) {
    const { originalSegments, enhancedSegments } = computeDiff(original, enhanced);
    const stats = calculateStats(original, enhanced);

    const getSegmentStyle = (type: DiffSegment['type']) => {
        switch (type) {
            case 'added':
                return { backgroundColor: 'rgba(34,197,94,0.2)', color: '#22c55e' };
            case 'removed':
                return { backgroundColor: 'rgba(239,68,68,0.2)', color: '#ef4444', textDecoration: 'line-through' };
            default:
                return {};
        }
    };

    return (
        <Box>
            {/* Stats bar */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                <Chip
                    icon={<SwapHoriz fontSize="small" />}
                    label={`${stats.originalWords} → ${stats.enhancedWords} words`}
                    size="small"
                    sx={{
                        backgroundColor: 'rgba(99,102,241,0.1)',
                        color: '#6366f1',
                    }}
                />
                <Chip
                    icon={stats.wordDiff >= 0 ? <Add fontSize="small" /> : <Remove fontSize="small" />}
                    label={`${stats.percentChange >= 0 ? '+' : ''}${stats.percentChange}%`}
                    size="small"
                    sx={{
                        backgroundColor: stats.wordDiff >= 0 ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)',
                        color: stats.wordDiff >= 0 ? '#22c55e' : '#ef4444',
                    }}
                />
                <Chip
                    label={`${stats.originalChars} → ${stats.enhancedChars} chars`}
                    size="small"
                    sx={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.5)',
                    }}
                />
            </Box>

            {/* Side by side view */}
            <Box sx={{ display: 'flex', gap: 2 }}>
                {/* Original */}
                <Paper
                    sx={{
                        flex: 1,
                        p: 2,
                        backgroundColor: 'rgba(239,68,68,0.05)',
                        border: '1px solid rgba(239,68,68,0.2)',
                        borderRadius: 2,
                        maxHeight: 300,
                        overflowY: 'auto',
                    }}
                >
                    <Typography variant="caption" sx={{ color: '#ef4444', fontWeight: 600, display: 'block', mb: 1 }}>
                        Original
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
                    >
                        {originalSegments.map((seg, i) => (
                            <span key={i} style={getSegmentStyle(seg.type)}>
                                {seg.text}
                            </span>
                        ))}
                    </Typography>
                </Paper>

                {/* Arrow */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <ArrowForward sx={{ color: 'rgba(255,255,255,0.3)' }} />
                </Box>

                {/* Enhanced */}
                <Paper
                    sx={{
                        flex: 1,
                        p: 2,
                        backgroundColor: 'rgba(34,197,94,0.05)',
                        border: '1px solid rgba(34,197,94,0.2)',
                        borderRadius: 2,
                        maxHeight: 300,
                        overflowY: 'auto',
                    }}
                >
                    <Typography variant="caption" sx={{ color: '#22c55e', fontWeight: 600, display: 'block', mb: 1 }}>
                        Enhanced
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ color: 'rgba(255,255,255,0.8)', whiteSpace: 'pre-wrap', lineHeight: 1.6 }}
                    >
                        {enhancedSegments.map((seg, i) => (
                            <span key={i} style={getSegmentStyle(seg.type)}>
                                {seg.text}
                            </span>
                        ))}
                    </Typography>
                </Paper>
            </Box>
        </Box>
    );
}
