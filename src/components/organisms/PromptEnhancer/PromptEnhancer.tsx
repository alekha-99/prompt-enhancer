/**
 * PromptEnhancer - Main UI Component 
 * Handles the complete prompt enhancement workflow with analysis features
 */

'use client';

import { useState, useCallback, useMemo, useEffect } from 'react';
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
    Tabs,
    Tab,
    Collapse,
    Divider,
} from '@mui/material';
import {
    AutoFixHigh as ImproveIcon,
    QuestionAnswer as RefineIcon,
    ContentCopy as CopyIcon,
    Check as CheckIcon,
    Clear as ClearIcon,
    CompareArrows as DiffIcon,
    Assessment as ScoreIcon,
} from '@mui/icons-material';
import { useClipboard } from '@/shared/hooks';
import { API_ENDPOINTS } from '@/infrastructure/config';
import { detectUseCase } from '@/core/analysis/use-case-detector';
import { estimateTokensAndCost } from '@/core/analysis/token-estimator';
import { UseCaseBadge } from '@/components/molecules/UseCaseBadge';
import { TokenCostPanel } from '@/components/molecules/TokenCostPanel';
import { PromptDiffView } from '@/components/molecules/PromptDiffView';
import { LLMScoreCard } from '@/components/molecules/LLMScoreCard';
import { SmartSuggestions } from '@/components/molecules/SmartSuggestions';

type Mode = 'idle' | 'improve' | 'refine' | 'questions';
type OutputView = 'enhanced' | 'diff' | 'analysis';

interface RefineState {
    questions: string[];
    answers: Record<string, string>;
}

interface PromptEnhancerProps {
    initialPrompt?: string;
}

export function PromptEnhancer({ initialPrompt = '' }: PromptEnhancerProps) {
    const [inputPrompt, setInputPrompt] = useState(initialPrompt);
    const [enhancedPrompt, setEnhancedPrompt] = useState('');
    const [mode, setMode] = useState<Mode>('idle');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [refineState, setRefineState] = useState<RefineState>({
        questions: [],
        answers: {},
    });
    const [outputView, setOutputView] = useState<OutputView>('enhanced');

    const { copied, copy } = useClipboard();

    // Real-time analysis of input prompt (use case + tokens only, no heuristic score)
    const inputAnalysis = useMemo(() => {
        if (!inputPrompt.trim()) return null;
        return {
            useCase: detectUseCase(inputPrompt),
            tokens: estimateTokensAndCost(inputPrompt),
        };
    }, [inputPrompt]);

    // Analysis of enhanced prompt
    const enhancedAnalysis = useMemo(() => {
        if (!enhancedPrompt.trim()) return null;
        return {
            useCase: detectUseCase(enhancedPrompt),
            tokens: estimateTokensAndCost(enhancedPrompt),
        };
    }, [enhancedPrompt]);

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
            setOutputView('enhanced');
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
            setOutputView('enhanced');
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
        <Box sx={{ display: 'flex', gap: 3, flexDirection: 'column' }}>
            {/* Main Row */}
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

                        {/* Use Case Badge - Real-time detection */}
                        {inputAnalysis && (
                            <Box sx={{ mb: 2 }}>
                                <UseCaseBadge detection={inputAnalysis.useCase} />
                            </Box>
                        )}

                        <TextField
                            fullWidth
                            multiline
                            rows={6}
                            placeholder="Enter your rough prompt here... e.g., 'explain react hooks'"
                            value={inputPrompt}
                            onChange={(e) => setInputPrompt(e.target.value)}
                            disabled={loading}
                            sx={{ mb: 2 }}
                        />

                        {/* LLM-Based Score Analysis */}
                        {inputPrompt.length > 20 && (
                            <Collapse in>
                                <Box sx={{ mb: 2 }}>
                                    <LLMScoreCard prompt={inputPrompt} />
                                </Box>
                            </Collapse>
                        )}

                        {/* Smart Suggestions */}
                        {inputPrompt.length > 10 && (
                            <Box sx={{ mb: 2 }}>
                                <SmartSuggestions
                                    prompt={inputPrompt}
                                    onApplyFix={setInputPrompt}
                                    compact
                                />
                            </Box>
                        )}

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

                                {/* Output View Tabs */}
                                <Tabs
                                    value={outputView}
                                    onChange={(_, v) => setOutputView(v)}
                                    sx={{
                                        mb: 2,
                                        '& .MuiTab-root': { minWidth: 80, fontSize: '0.8rem' },
                                        '& .MuiTabs-indicator': { backgroundColor: '#a855f7' },
                                    }}
                                >
                                    <Tab value="enhanced" label="Result" />
                                    <Tab value="diff" label="Compare" icon={<DiffIcon fontSize="small" />} iconPosition="start" />
                                    <Tab value="analysis" label="Analysis" icon={<ScoreIcon fontSize="small" />} iconPosition="start" />
                                </Tabs>

                                {outputView === 'enhanced' && (
                                    <Box
                                        sx={{
                                            p: 2,
                                            borderRadius: 2,
                                            bgcolor: (theme) => alpha(theme.palette.background.paper, 0.5),
                                            border: (theme) => `1px solid ${theme.palette.divider}`,
                                            maxHeight: 350,
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
                                )}

                                {outputView === 'diff' && (
                                    <PromptDiffView original={inputPrompt} enhanced={enhancedPrompt} />
                                )}

                                {outputView === 'analysis' && (
                                    <Stack spacing={2}>
                                        <LLMScoreCard prompt={enhancedPrompt} />
                                        {enhancedAnalysis && (
                                            <TokenCostPanel estimate={enhancedAnalysis.tokens} />
                                        )}
                                    </Stack>
                                )}
                            </CardContent>
                        </Card>
                    </Fade>
                )}
            </Box>

            {/* Token Cost Panel - Always visible when input has content */}
            {inputAnalysis && inputPrompt.length > 50 && !enhancedPrompt && (
                <Fade in>
                    <Box>
                        <TokenCostPanel estimate={inputAnalysis.tokens} compact />
                    </Box>
                </Fade>
            )}
        </Box>
    );
}

export default PromptEnhancer;
