/**
 * PromptScoreCard Component
 * Displays prompt quality score with breakdown and suggestions
 */

'use client';

import React from 'react';
import {
    Box,
    Typography,
    LinearProgress,
    Chip,
    Collapse,
    IconButton,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Divider,
} from '@mui/material';
import {
    ExpandMore,
    ExpandLess,
    CheckCircle,
    Warning,
    Error as ErrorIcon,
    Lightbulb,
    TrendingUp,
} from '@mui/icons-material';
import { PromptScore, getScoreColor, getScoreLabel } from '@/core/analysis/prompt-scorer';

interface PromptScoreCardProps {
    score: PromptScore;
    compact?: boolean;
}

export function PromptScoreCard({ score, compact = false }: PromptScoreCardProps) {
    const [expanded, setExpanded] = React.useState(!compact);
    const color = getScoreColor(score.overall);
    const label = getScoreLabel(score.overall);

    const dimensions = [
        { key: 'clarity', label: 'Clarity', score: score.breakdown.clarity },
        { key: 'specificity', label: 'Specificity', score: score.breakdown.specificity },
        { key: 'context', label: 'Context', score: score.breakdown.context },
        { key: 'structure', label: 'Structure', score: score.breakdown.structure },
        { key: 'actionability', label: 'Actionability', score: score.breakdown.actionability },
    ];

    return (
        <Box
            sx={{
                p: 2,
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.08)',
            }}
        >
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Box
                        sx={{
                            width: 60,
                            height: 60,
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            background: `conic-gradient(${color} ${score.overall}%, rgba(255,255,255,0.1) ${score.overall}%)`,
                        }}
                    >
                        <Box
                            sx={{
                                width: 50,
                                height: 50,
                                borderRadius: '50%',
                                backgroundColor: '#1a1a1f',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <Typography variant="h6" sx={{ color, fontWeight: 700 }}>
                                {score.overall}
                            </Typography>
                        </Box>
                    </Box>
                    <Box>
                        <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                            Prompt Quality
                        </Typography>
                        <Chip
                            label={label}
                            size="small"
                            sx={{
                                backgroundColor: `${color}20`,
                                color,
                                fontSize: '0.7rem',
                            }}
                        />
                    </Box>
                </Box>
                <IconButton onClick={() => setExpanded(!expanded)} sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    {expanded ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
            </Box>

            {/* Breakdown */}
            <Collapse in={expanded}>
                <Box sx={{ mt: 2 }}>
                    {/* Dimension scores */}
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 1 }}>
                        Score Breakdown
                    </Typography>
                    {dimensions.map((dim) => (
                        <Box key={dim.key} sx={{ mb: 1 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                    {dim.label}
                                </Typography>
                                <Typography variant="caption" sx={{ color: getScoreColor(dim.score) }}>
                                    {dim.score}/100
                                </Typography>
                            </Box>
                            <LinearProgress
                                variant="determinate"
                                value={dim.score}
                                sx={{
                                    height: 4,
                                    borderRadius: 2,
                                    backgroundColor: 'rgba(255,255,255,0.1)',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: getScoreColor(dim.score),
                                        borderRadius: 2,
                                    },
                                }}
                            />
                        </Box>
                    ))}

                    <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

                    {/* Strengths */}
                    {score.strengths.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" sx={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                <CheckCircle fontSize="small" /> Strengths
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                {score.strengths.slice(0, 4).map((strength, i) => (
                                    <Chip
                                        key={i}
                                        label={strength}
                                        size="small"
                                        sx={{
                                            backgroundColor: 'rgba(34,197,94,0.1)',
                                            color: '#22c55e',
                                            fontSize: '0.65rem',
                                            height: 22,
                                        }}
                                    />
                                ))}
                            </Box>
                        </Box>
                    )}

                    {/* Suggestions */}
                    {score.suggestions.length > 0 && (
                        <Box>
                            <Typography variant="caption" sx={{ color: '#eab308', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                <Lightbulb fontSize="small" /> Suggestions
                            </Typography>
                            <List dense sx={{ py: 0 }}>
                                {score.suggestions.slice(0, 3).map((suggestion, i) => (
                                    <ListItem key={i} sx={{ px: 0, py: 0.5 }}>
                                        <ListItemIcon sx={{ minWidth: 28 }}>
                                            {suggestion.priority === 'high' ? (
                                                <ErrorIcon fontSize="small" sx={{ color: '#ef4444' }} />
                                            ) : suggestion.priority === 'medium' ? (
                                                <Warning fontSize="small" sx={{ color: '#eab308' }} />
                                            ) : (
                                                <TrendingUp fontSize="small" sx={{ color: '#3b82f6' }} />
                                            )}
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={suggestion.message}
                                            primaryTypographyProps={{
                                                variant: 'caption',
                                                sx: { color: 'rgba(255,255,255,0.7)' },
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    )}
                </Box>
            </Collapse>
        </Box>
    );
}
