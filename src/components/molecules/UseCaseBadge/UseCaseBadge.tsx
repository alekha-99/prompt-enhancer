/**
 * UseCaseBadge Component
 * Displays detected use case with icon and confidence
 */

'use client';

import React from 'react';
import { Box, Typography, Chip, Tooltip } from '@mui/material';
import { UseCaseDetection, getUseCaseLabel } from '@/core/analysis/use-case-detector';

interface UseCaseBadgeProps {
    detection: UseCaseDetection;
    showDetails?: boolean;
}

export function UseCaseBadge({ detection, showDetails = true }: UseCaseBadgeProps) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
            {/* Primary use case */}
            <Tooltip title={`Confidence: ${detection.confidence}%`}>
                <Chip
                    icon={<span style={{ fontSize: '1rem' }}>{detection.icon}</span>}
                    label={getUseCaseLabel(detection.primary)}
                    size="small"
                    sx={{
                        backgroundColor: `${detection.color}20`,
                        color: detection.color,
                        border: `1px solid ${detection.color}40`,
                        '& .MuiChip-icon': { marginLeft: '8px' },
                    }}
                />
            </Tooltip>

            {/* Confidence indicator */}
            {showDetails && (
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        px: 1,
                        py: 0.25,
                        borderRadius: 1,
                        backgroundColor: 'rgba(255,255,255,0.05)',
                    }}
                >
                    <Box
                        sx={{
                            width: 40,
                            height: 4,
                            borderRadius: 2,
                            backgroundColor: 'rgba(255,255,255,0.1)',
                            overflow: 'hidden',
                        }}
                    >
                        <Box
                            sx={{
                                width: `${detection.confidence}%`,
                                height: '100%',
                                backgroundColor: detection.color,
                                borderRadius: 2,
                            }}
                        />
                    </Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem' }}>
                        {detection.confidence}%
                    </Typography>
                </Box>
            )}

            {/* Secondary use case */}
            {detection.secondary && showDetails && (
                <Chip
                    label={detection.secondary}
                    size="small"
                    sx={{
                        backgroundColor: 'rgba(255,255,255,0.05)',
                        color: 'rgba(255,255,255,0.5)',
                        fontSize: '0.65rem',
                        height: 22,
                        textTransform: 'capitalize',
                    }}
                />
            )}

            {/* Suggested model */}
            {showDetails && (
                <Chip
                    label={`Best: ${detection.suggestedModel}`}
                    size="small"
                    sx={{
                        backgroundColor: 'rgba(168,85,247,0.1)',
                        color: '#a855f7',
                        fontSize: '0.65rem',
                        height: 22,
                    }}
                />
            )}
        </Box>
    );
}
