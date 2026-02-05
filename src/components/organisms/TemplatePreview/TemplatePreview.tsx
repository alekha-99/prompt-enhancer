/**
 * TemplatePreview Component
 * Modal for previewing template with filled variables
 */

'use client';

import React, { useState, useMemo } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Box,
    Typography,
    Button,
    IconButton,
    Tabs,
    Tab,
    Divider,
    Paper,
} from '@mui/material';
import { Close, ContentCopy, Check, Code, Visibility } from '@mui/icons-material';
import { PromptTemplate, AIModel, OutputFormat } from '@/core/templates/template.types';
import { VariableForm } from '@/components/molecules/VariableForm';
import { ContextPanel } from '@/components/molecules/ContextPanel';
import { renderTemplate } from '@/core/templates/variable.engine';
import { applyContextAdaptations } from '@/core/templates/context.adapter';

interface TemplatePreviewProps {
    open: boolean;
    template: PromptTemplate | null;
    onClose: () => void;
    onApply: (renderedPrompt: string) => void;
}

export function TemplatePreview({
    open,
    template,
    onClose,
    onApply,
}: TemplatePreviewProps) {
    const [activeTab, setActiveTab] = useState<'variables' | 'preview'>('variables');
    const [values, setValues] = useState<Record<string, string>>({});
    const [selectedModel, setSelectedModel] = useState<AIModel>('gpt-4');
    const [selectedFormat, setSelectedFormat] = useState<OutputFormat>('text');
    const [tokenOptimization, setTokenOptimization] = useState(false);
    const [copied, setCopied] = useState(false);

    // Reset values when template changes
    React.useEffect(() => {
        if (template) {
            const initialValues: Record<string, string> = {};
            template.variables.forEach((v) => {
                initialValues[v.name] = v.defaultValue || '';
            });
            setValues(initialValues);
            setActiveTab('variables');
        }
    }, [template?.id]);

    // Rendered prompt
    const renderedPrompt = useMemo(() => {
        if (!template) return '';

        let rendered = renderTemplate(template.template, values);

        if (tokenOptimization || selectedFormat !== 'text') {
            const adapted = applyContextAdaptations(rendered, {
                model: selectedModel,
                format: selectedFormat,
                optimizeTokens: tokenOptimization,
            });
            rendered = adapted.prompt;
        }

        return rendered;
    }, [template, values, selectedModel, selectedFormat, tokenOptimization]);

    const handleValueChange = (name: string, value: string) => {
        setValues((prev) => ({ ...prev, [name]: value }));
    };

    const handleApply = () => {
        onApply(renderedPrompt);
        onClose();
    };

    const handleCopy = async () => {
        await navigator.clipboard.writeText(renderedPrompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!template) return null;

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{
                sx: {
                    backgroundColor: '#1a1a1f',
                    backgroundImage: 'none',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: 3,
                },
            }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                }}
            >
                <Box>
                    <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>
                        {template.name}
                    </Typography>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                        {template.description}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
                <Box sx={{ display: 'flex', height: '500px' }}>
                    {/* Left Panel - Variables */}
                    <Box
                        sx={{
                            width: '50%',
                            p: 3,
                            borderRight: '1px solid rgba(255,255,255,0.08)',
                            overflowY: 'auto',
                        }}
                    >
                        <Tabs
                            value={activeTab}
                            onChange={(_, v) => setActiveTab(v)}
                            sx={{
                                mb: 2,
                                '& .MuiTab-root': { color: 'rgba(255,255,255,0.5)', minWidth: 100 },
                                '& .Mui-selected': { color: 'white' },
                                '& .MuiTabs-indicator': { backgroundColor: '#a855f7' },
                            }}
                        >
                            <Tab value="variables" label="Variables" icon={<Code fontSize="small" />} iconPosition="start" />
                            <Tab value="preview" label="Raw" icon={<Visibility fontSize="small" />} iconPosition="start" />
                        </Tabs>

                        {activeTab === 'variables' ? (
                            <>
                                <VariableForm
                                    variables={template.variables}
                                    values={values}
                                    onChange={handleValueChange}
                                />
                                <Divider sx={{ my: 3, borderColor: 'rgba(255,255,255,0.08)' }} />
                                <ContextPanel
                                    selectedModel={selectedModel}
                                    selectedFormat={selectedFormat}
                                    tokenOptimization={tokenOptimization}
                                    promptText={renderedPrompt}
                                    onModelChange={setSelectedModel}
                                    onFormatChange={setSelectedFormat}
                                    onOptimizationChange={setTokenOptimization}
                                />
                            </>
                        ) : (
                            <Paper
                                sx={{
                                    p: 2,
                                    backgroundColor: 'rgba(0,0,0,0.3)',
                                    border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: 1,
                                    fontFamily: 'monospace',
                                    fontSize: '0.8rem',
                                    color: 'rgba(255,255,255,0.7)',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                }}
                            >
                                {template.template}
                            </Paper>
                        )}
                    </Box>

                    {/* Right Panel - Preview */}
                    <Box
                        sx={{
                            width: '50%',
                            p: 3,
                            backgroundColor: 'rgba(0,0,0,0.2)',
                            overflowY: 'auto',
                        }}
                    >
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                                Preview
                            </Typography>
                            <Button
                                size="small"
                                startIcon={copied ? <Check /> : <ContentCopy />}
                                onClick={handleCopy}
                                sx={{
                                    color: copied ? '#22c55e' : 'rgba(255,255,255,0.5)',
                                    textTransform: 'none',
                                }}
                            >
                                {copied ? 'Copied!' : 'Copy'}
                            </Button>
                        </Box>
                        <Paper
                            sx={{
                                p: 2,
                                backgroundColor: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.08)',
                                borderRadius: 1,
                                minHeight: '400px',
                            }}
                        >
                            <Typography
                                variant="body2"
                                sx={{
                                    color: 'rgba(255,255,255,0.9)',
                                    whiteSpace: 'pre-wrap',
                                    wordBreak: 'break-word',
                                    lineHeight: 1.6,
                                }}
                            >
                                {renderedPrompt || (
                                    <span style={{ color: 'rgba(255,255,255,0.3)', fontStyle: 'italic' }}>
                                        Fill in the variables to see the preview...
                                    </span>
                                )}
                            </Typography>
                        </Paper>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions
                sx={{
                    p: 2,
                    borderTop: '1px solid rgba(255,255,255,0.08)',
                    gap: 1,
                }}
            >
                <Button
                    onClick={onClose}
                    sx={{ color: 'rgba(255,255,255,0.5)' }}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    onClick={handleApply}
                    sx={{
                        backgroundColor: '#a855f7',
                        '&:hover': { backgroundColor: '#9333ea' },
                    }}
                >
                    Apply to Editor
                </Button>
            </DialogActions>
        </Dialog>
    );
}
