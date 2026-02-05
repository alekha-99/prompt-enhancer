/**
 * ContextPanel Component
 * AI Model selector, output format, and token optimization controls
 */

'use client';

import React from 'react';
import {
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Switch,
    FormControlLabel,
    Typography,
    Chip,
    Divider,
} from '@mui/material';
import { AIModel, OutputFormat } from '@/core/templates/template.types';
import { estimateTokens } from '@/core/templates/context.adapter';

interface ContextPanelProps {
    selectedModel: AIModel;
    selectedFormat: OutputFormat;
    tokenOptimization: boolean;
    promptText: string;
    onModelChange: (model: AIModel) => void;
    onFormatChange: (format: OutputFormat) => void;
    onOptimizationChange: (enabled: boolean) => void;
}

const AI_MODELS: { value: AIModel; label: string; description: string }[] = [
    { value: 'gpt-4', label: 'GPT-4', description: 'Most capable OpenAI model' },
    { value: 'gpt-4o-mini', label: 'GPT-4o Mini', description: 'Fast and affordable' },
    { value: 'claude', label: 'Claude', description: 'Anthropic AI assistant' },
    { value: 'gemini', label: 'Gemini', description: 'Google AI model' },
    { value: 'llama', label: 'Llama', description: 'Meta open-source model' },
];

const OUTPUT_FORMATS: { value: OutputFormat; label: string }[] = [
    { value: 'text', label: 'Plain Text' },
    { value: 'markdown', label: 'Markdown' },
    { value: 'json', label: 'JSON' },
    { value: 'code', label: 'Code Only' },
];

export function ContextPanel({
    selectedModel,
    selectedFormat,
    tokenOptimization,
    promptText,
    onModelChange,
    onFormatChange,
    onOptimizationChange,
}: ContextPanelProps) {
    const tokenCount = estimateTokens(promptText);

    const commonSx = {
        '& .MuiOutlinedInput-root': {
            backgroundColor: 'rgba(255,255,255,0.03)',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
            '&.Mui-focused fieldset': { borderColor: '#a855f7' },
        },
        '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
        '& .MuiSelect-select': { color: 'white' },
    };

    return (
        <Box
            sx={{
                p: 2,
                backgroundColor: 'rgba(255,255,255,0.02)',
                borderRadius: 2,
                border: '1px solid rgba(255,255,255,0.08)',
            }}
        >
            <Typography
                variant="subtitle2"
                sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 600, mb: 2 }}
            >
                Context Settings
            </Typography>

            {/* AI Model Selector */}
            <FormControl fullWidth size="small" sx={{ ...commonSx, mb: 2 }}>
                <InputLabel>Target AI Model</InputLabel>
                <Select
                    value={selectedModel}
                    label="Target AI Model"
                    onChange={(e) => onModelChange(e.target.value as AIModel)}
                >
                    {AI_MODELS.map((model) => (
                        <MenuItem key={model.value} value={model.value}>
                            <Box>
                                <Typography variant="body2">{model.label}</Typography>
                                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                    {model.description}
                                </Typography>
                            </Box>
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            {/* Output Format */}
            <FormControl fullWidth size="small" sx={{ ...commonSx, mb: 2 }}>
                <InputLabel>Output Format</InputLabel>
                <Select
                    value={selectedFormat}
                    label="Output Format"
                    onChange={(e) => onFormatChange(e.target.value as OutputFormat)}
                >
                    {OUTPUT_FORMATS.map((format) => (
                        <MenuItem key={format.value} value={format.value}>
                            {format.label}
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>

            <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.08)' }} />

            {/* Token Optimization Toggle */}
            <FormControlLabel
                control={
                    <Switch
                        checked={tokenOptimization}
                        onChange={(e) => onOptimizationChange(e.target.checked)}
                        sx={{
                            '& .MuiSwitch-switchBase.Mui-checked': {
                                color: '#a855f7',
                            },
                            '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                                backgroundColor: '#a855f7',
                            },
                        }}
                    />
                }
                label={
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.7)' }}>
                        Token Optimization
                    </Typography>
                }
            />

            {/* Token Count Display */}
            <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                    Estimated tokens:
                </Typography>
                <Chip
                    label={`~${tokenCount}`}
                    size="small"
                    sx={{
                        backgroundColor: tokenCount > 1000 ? 'rgba(239,68,68,0.1)' : 'rgba(34,197,94,0.1)',
                        color: tokenCount > 1000 ? '#ef4444' : '#22c55e',
                        fontSize: '0.7rem',
                        height: 20,
                    }}
                />
            </Box>
        </Box>
    );
}
