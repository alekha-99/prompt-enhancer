/**
 * LLMScoreCard Component
 * Displays LLM-analyzed prompt score with semantic insights
 */

'use client';

import React, { useState } from 'react';
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
    Button,
    CircularProgress,
    Alert,
} from '@mui/material';
import {
    ExpandMore,
    ExpandLess,
    CheckCircle,
    Cancel,
    Lightbulb,
    Psychology,
    AutoAwesome,
} from '@mui/icons-material';
import { LLMPromptAnalysis, getLLMScoreColor, getLLMScoreLabel, analyzePromptWithLLM } from '@/core/analysis/llm-analyzer';

interface LLMScoreCardProps {
    prompt: string;
    onAnalysisComplete?: (analysis: LLMPromptAnalysis) => void;
}

export function LLMScoreCard({ prompt, onAnalysisComplete }: LLMScoreCardProps) {
    const [analysis, setAnalysis] = useState<LLMPromptAnalysis | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [expanded, setExpanded] = useState(true);

    const handleAnalyze = async () => {
        if (!prompt.trim() || prompt.length < 10) {
            setError('Prompt too short for analysis');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const result = await analyzePromptWithLLM(prompt);
            setAnalysis(result);
            onAnalysisComplete?.(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Analysis failed');
        } finally {
            setLoading(false);
        }
    };

    if (!analysis) {
        return (
            <Box
                sx={{
                    p: 2,
                    backgroundColor: 'rgba(168,85,247,0.05)',
                    borderRadius: 2,
                    border: '1px solid rgba(168,85,247,0.2)',
                    textAlign: 'center',
                }}
            >
                <Psychology sx={{ fontSize: 32, color: '#a855f7', mb: 1 }} />
                <Typography variant="subtitle2" sx={{ color: 'white', mb: 1 }}>
                    AI-Powered Analysis
                </Typography>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mb: 2 }}>
                    Get accurate quality score using semantic understanding
                </Typography>

                {error && (
                    <Alert severity="error" sx={{ mb: 2, textAlign: 'left' }}>
                        {error}
                    </Alert>
                )}

                <Button
                    variant="contained"
                    onClick={handleAnalyze}
                    disabled={loading || prompt.length < 10}
                    startIcon={loading ? <CircularProgress size={16} color="inherit" /> : <AutoAwesome />}
                    sx={{
                        backgroundColor: '#a855f7',
                        '&:hover': { backgroundColor: '#9333ea' },
                    }}
                >
                    {loading ? 'Analyzing...' : 'Analyze with AI'}
                </Button>
            </Box>
        );
    }

    const color = getLLMScoreColor(analysis.overall);
    const label = getLLMScoreLabel(analysis.overall);

    const dimensions = [
        { key: 'clarity', label: 'Clarity', score: analysis.breakdown.clarity },
        { key: 'completeness', label: 'Completeness', score: analysis.breakdown.completeness },
        { key: 'specificity', label: 'Specificity', score: analysis.breakdown.specificity },
        { key: 'effectiveness', label: 'Effectiveness', score: analysis.breakdown.effectiveness },
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
                            background: `conic-gradient(${color} ${analysis.overall}%, rgba(255,255,255,0.1) ${analysis.overall}%)`,
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
                                {analysis.overall}
                            </Typography>
                        </Box>
                    </Box>
                    <Box>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Typography variant="subtitle1" sx={{ color: 'white', fontWeight: 600 }}>
                                AI Analysis
                            </Typography>
                            <Chip
                                icon={<Psychology fontSize="small" />}
                                label="LLM"
                                size="small"
                                sx={{
                                    height: 20,
                                    fontSize: '0.6rem',
                                    backgroundColor: 'rgba(168,85,247,0.2)',
                                    color: '#a855f7',
                                }}
                            />
                        </Box>
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

            {/* Predicted Outcome */}
            <Box
                sx={{
                    mt: 2,
                    p: 1.5,
                    backgroundColor: 'rgba(255,255,255,0.03)',
                    borderRadius: 1,
                    borderLeft: `3px solid ${color}`,
                }}
            >
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    Predicted AI Response:
                </Typography>
                <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.8)', fontStyle: 'italic' }}>
                    "{analysis.predictedOutcome}"
                </Typography>
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
                                <Typography variant="caption" sx={{ color: getLLMScoreColor(dim.score) }}>
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
                                        backgroundColor: getLLMScoreColor(dim.score),
                                        borderRadius: 2,
                                    },
                                }}
                            />
                        </Box>
                    ))}

                    <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

                    {/* Strengths */}
                    {analysis.strengths.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" sx={{ color: '#22c55e', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                <CheckCircle fontSize="small" /> Strengths
                            </Typography>
                            <List dense sx={{ py: 0 }}>
                                {analysis.strengths.map((strength, i) => (
                                    <ListItem key={i} sx={{ px: 0, py: 0.25 }}>
                                        <ListItemText
                                            primary={strength}
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

                    {/* Weaknesses */}
                    {analysis.weaknesses.length > 0 && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" sx={{ color: '#ef4444', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                <Cancel fontSize="small" /> Weaknesses
                            </Typography>
                            <List dense sx={{ py: 0 }}>
                                {analysis.weaknesses.map((weakness, i) => (
                                    <ListItem key={i} sx={{ px: 0, py: 0.25 }}>
                                        <ListItemText
                                            primary={weakness}
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

                    {/* Suggestions */}
                    {analysis.suggestions.length > 0 && (
                        <Box>
                            <Typography variant="caption" sx={{ color: '#eab308', display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
                                <Lightbulb fontSize="small" /> Suggestions
                            </Typography>
                            <List dense sx={{ py: 0 }}>
                                {analysis.suggestions.map((suggestion, i) => (
                                    <ListItem key={i} sx={{ px: 0, py: 0.25 }}>
                                        <ListItemIcon sx={{ minWidth: 20 }}>
                                            <Typography variant="caption" sx={{ color: '#eab308' }}>{i + 1}.</Typography>
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={suggestion}
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

                    {/* Re-analyze button */}
                    <Button
                        size="small"
                        onClick={handleAnalyze}
                        disabled={loading}
                        sx={{ mt: 2, color: '#a855f7' }}
                        startIcon={loading ? <CircularProgress size={14} /> : <AutoAwesome fontSize="small" />}
                    >
                        Re-analyze
                    </Button>
                </Box>
            </Collapse>
        </Box>
    );
}
