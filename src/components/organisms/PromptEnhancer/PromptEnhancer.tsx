/**
 * PromptEnhancer - Main UI Component 
 * Handles the complete prompt enhancement workflow
 */

'use client';

import { useState, useCallback } from 'react';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    CircularProgress,
    IconButton,
    Tooltip,
    Alert,
    Chip,
    Stack,
    Fade,
    alpha,
} from '@mui/material';
import {
    AutoFixHigh as ImproveIcon,
    QuestionAnswer as RefineIcon,
    ContentCopy as CopyIcon,
    Check as CheckIcon,
    Clear as ClearIcon,
} from '@mui/icons-material';
import { useClipboard } from '@/shared/hooks';
import { API_ENDPOINTS } from '@/infrastructure/config';

type Mode = 'idle' | 'improve' | 'refine' | 'questions';

interface RefineState {
    questions: string[];
    answers: Record<string, string>;
}

export function PromptEnhancer() {
    const [inputPrompt, setInputPrompt] = useState('');
    const [enhancedPrompt, setEnhancedPrompt] = useState('');
    const [mode, setMode] = useState<Mode>('idle');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refineState, setRefineState] = useState<RefineState>({
        questions: [],
        answers: {},
    });

    const { copied, copy } = useClipboard();

    // Handle Improve mode - one-click enhancement
    const handleImprove = useCallback(async () => {
        if (!inputPrompt.trim()) return;

        setLoading(true);
        setError(null);
        setMode('improve');

        try {
            const response = await fetch(API_ENDPOINTS.enhance, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: inputPrompt }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to enhance prompt');
            }

            setEnhancedPrompt(data.enhancedPrompt);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [inputPrompt]);

    // Handle Refine mode - get questions first
    const handleRefine = useCallback(async () => {
        if (!inputPrompt.trim()) return;

        setLoading(true);
        setError(null);
        setMode('questions');

        try {
            const response = await fetch(API_ENDPOINTS.refineQuestions, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: inputPrompt }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to get questions');
            }

            setRefineState({
                questions: data.questions,
                answers: {},
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setMode('idle');
        } finally {
            setLoading(false);
        }
    }, [inputPrompt]);

    // Handle submitting answers and getting enhanced prompt
    const handleSubmitAnswers = useCallback(async () => {
        setLoading(true);
        setError(null);
        setMode('refine');

        try {
            const response = await fetch(API_ENDPOINTS.refineEnhance, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    prompt: inputPrompt,
                    answers: refineState.answers,
                }),
            });

            const data = await response.json();

            if (!data.success) {
                throw new Error(data.error || 'Failed to enhance prompt');
            }

            setEnhancedPrompt(data.enhancedPrompt);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [inputPrompt, refineState.answers]);

    // Handle answer input
    const handleAnswerChange = (question: string, answer: string) => {
        setRefineState(prev => ({
            ...prev,
            answers: { ...prev.answers, [question]: answer },
        }));
    };

    // Clear all
    const handleClear = () => {
        setInputPrompt('');
        setEnhancedPrompt('');
        setMode('idle');
        setError(null);
        setRefineState({ questions: [], answers: {} });
    };

    // Copy enhanced prompt
    const handleCopy = () => {
        if (enhancedPrompt) {
            copy(enhancedPrompt);
        }
    };

    const allQuestionsAnswered =
        refineState.questions.length > 0 &&
        refineState.questions.every(q => refineState.answers[q]?.trim());

    return (
        <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', md: 'row' } }}>
            {/* Input Section */}
            <Card sx={{ flex: 1 }}>
                <CardContent sx={{ p: 3 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                        <Typography variant="h6" fontWeight={600}>
                            Your Prompt
                        </Typography>
                        {inputPrompt && (
                            <Tooltip title="Clear">
                                <IconButton size="small" onClick={handleClear}>
                                    <ClearIcon fontSize="small" />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Stack>

                    <TextField
                        fullWidth
                        multiline
                        rows={8}
                        placeholder="Enter your rough prompt here... e.g., 'explain react hooks'"
                        value={inputPrompt}
                        onChange={(e) => setInputPrompt(e.target.value)}
                        disabled={loading}
                        sx={{ mb: 2 }}
                    />

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <Stack direction="row" spacing={2}>
                        <Button
                            variant="contained"
                            startIcon={loading && mode === 'improve' ? <CircularProgress size={20} color="inherit" /> : <ImproveIcon />}
                            onClick={handleImprove}
                            disabled={!inputPrompt.trim() || loading}
                            fullWidth
                        >
                            Improve
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={loading && mode === 'questions' ? <CircularProgress size={20} /> : <RefineIcon />}
                            onClick={handleRefine}
                            disabled={!inputPrompt.trim() || loading}
                            fullWidth
                        >
                            Refine
                        </Button>
                    </Stack>
                </CardContent>
            </Card>

            {/* Questions Section (Refine Mode) */}
            {mode === 'questions' && refineState.questions.length > 0 && (
                <Fade in>
                    <Card sx={{ flex: 1 }}>
                        <CardContent sx={{ p: 3 }}>
                            <Typography variant="h6" fontWeight={600} mb={2}>
                                Clarifying Questions
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={3}>
                                Answer these questions to get a better enhanced prompt
                            </Typography>

                            <Stack spacing={2}>
                                {refineState.questions.map((question, index) => (
                                    <Box key={index}>
                                        <Typography variant="body2" fontWeight={500} mb={0.5}>
                                            {index + 1}. {question}
                                        </Typography>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            placeholder="Your answer..."
                                            value={refineState.answers[question] || ''}
                                            onChange={(e) => handleAnswerChange(question, e.target.value)}
                                        />
                                    </Box>
                                ))}
                            </Stack>

                            <Button
                                variant="contained"
                                sx={{ mt: 3 }}
                                fullWidth
                                disabled={!allQuestionsAnswered || loading}
                                onClick={handleSubmitAnswers}
                                startIcon={loading ? <CircularProgress size={20} color="inherit" /> : <ImproveIcon />}
                            >
                                Generate Enhanced Prompt
                            </Button>
                        </CardContent>
                    </Card>
                </Fade>
            )}

            {/* Output Section */}
            {(mode === 'improve' || mode === 'refine') && enhancedPrompt && (
                <Fade in>
                    <Card
                        sx={{
                            flex: 1,
                            border: (theme) => `1px solid ${alpha(theme.palette.success.main, 0.3)}`,
                        }}
                    >
                        <CardContent sx={{ p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <Typography variant="h6" fontWeight={600}>
                                        Enhanced Prompt
                                    </Typography>
                                    <Chip
                                        label={mode === 'improve' ? 'Improved' : 'Refined'}
                                        size="small"
                                        color="success"
                                    />
                                </Stack>
                                <Tooltip title={copied ? 'Copied!' : 'Copy to clipboard'}>
                                    <IconButton onClick={handleCopy} color={copied ? 'success' : 'default'}>
                                        {copied ? <CheckIcon /> : <CopyIcon />}
                                    </IconButton>
                                </Tooltip>
                            </Stack>

                            <Box
                                sx={{
                                    p: 2,
                                    borderRadius: 2,
                                    bgcolor: (theme) => alpha(theme.palette.background.paper, 0.5),
                                    border: (theme) => `1px solid ${theme.palette.divider}`,
                                    maxHeight: 400,
                                    overflow: 'auto',
                                }}
                            >
                                <Typography
                                    variant="body2"
                                    sx={{
                                        whiteSpace: 'pre-wrap',
                                        fontFamily: 'monospace',
                                        lineHeight: 1.8,
                                    }}
                                >
                                    {enhancedPrompt}
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Fade>
            )}
        </Box>
    );
}

export default PromptEnhancer;
