/**
 * VariableForm Component
 * Dynamic form for filling template variables
 */

'use client';

import React, { useState, useEffect } from 'react';
import {
    Box,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Typography,
    Chip,
    Autocomplete,
    Button,
} from '@mui/material';
import { VariableDefinition } from '@/core/templates/template.types';
import { getSuggestions } from '@/core/templates/variable.engine';

interface VariableFormProps {
    variables: VariableDefinition[];
    values: Record<string, string>;
    onChange: (name: string, value: string) => void;
    onSubmit?: () => void;
}

export function VariableForm({
    variables,
    values,
    onChange,
    onSubmit,
}: VariableFormProps) {
    const [suggestions, setSuggestions] = useState<Record<string, string[]>>({});

    // Load suggestions on mount
    useEffect(() => {
        const loadSuggestions = () => {
            const newSuggestions: Record<string, string[]> = {};
            variables.forEach((variable) => {
                if (variable.type === 'text' || variable.type === 'textarea') {
                    newSuggestions[variable.name] = [
                        ...(variable.suggestions || []),
                        ...getSuggestions(variable.name),
                    ];
                }
            });
            setSuggestions(newSuggestions);
        };
        loadSuggestions();
    }, [variables]);

    const renderField = (variable: VariableDefinition) => {
        const value = values[variable.name] ?? variable.defaultValue ?? '';
        const fieldSuggestions = suggestions[variable.name] || [];

        const commonSx = {
            '& .MuiOutlinedInput-root': {
                backgroundColor: 'rgba(255,255,255,0.03)',
                '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                '&.Mui-focused fieldset': { borderColor: '#a855f7' },
            },
            '& .MuiInputLabel-root': { color: 'rgba(255,255,255,0.5)' },
            '& .MuiInputBase-input': { color: 'white' },
        };

        switch (variable.type) {
            case 'select':
                return (
                    <FormControl fullWidth size="small" sx={commonSx}>
                        <InputLabel>{variable.label}</InputLabel>
                        <Select
                            value={value}
                            label={variable.label}
                            onChange={(e) => onChange(variable.name, e.target.value)}
                            sx={{ color: 'white' }}
                        >
                            {variable.options?.map((option) => (
                                <MenuItem key={option} value={option}>
                                    {option}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                );

            case 'textarea':
                return (
                    <Autocomplete
                        freeSolo
                        options={fieldSuggestions}
                        value={value}
                        onChange={(_, newValue) => onChange(variable.name, newValue || '')}
                        onInputChange={(_, newValue) => onChange(variable.name, newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={variable.label}
                                placeholder={variable.placeholder}
                                multiline
                                rows={4}
                                required={variable.required}
                                size="small"
                                sx={commonSx}
                            />
                        )}
                    />
                );

            case 'number':
                return (
                    <TextField
                        fullWidth
                        type="number"
                        label={variable.label}
                        placeholder={variable.placeholder}
                        value={value}
                        onChange={(e) => onChange(variable.name, e.target.value)}
                        required={variable.required}
                        size="small"
                        sx={commonSx}
                    />
                );

            default: // text
                return (
                    <Autocomplete
                        freeSolo
                        options={fieldSuggestions}
                        value={value}
                        onChange={(_, newValue) => onChange(variable.name, newValue || '')}
                        onInputChange={(_, newValue) => onChange(variable.name, newValue)}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={variable.label}
                                placeholder={variable.placeholder}
                                required={variable.required}
                                size="small"
                                sx={commonSx}
                            />
                        )}
                    />
                );
        }
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Typography
                variant="subtitle2"
                sx={{ color: 'rgba(255,255,255,0.7)', fontWeight: 500, mb: -1 }}
            >
                Fill in the variables
            </Typography>

            {variables.map((variable) => (
                <Box key={variable.name}>
                    {renderField(variable)}
                    {variable.required && (
                        <Chip
                            label="Required"
                            size="small"
                            sx={{
                                mt: 0.5,
                                height: 18,
                                fontSize: '0.65rem',
                                backgroundColor: 'rgba(239,68,68,0.1)',
                                color: '#ef4444',
                            }}
                        />
                    )}
                </Box>
            ))}

            {onSubmit && (
                <Button
                    variant="contained"
                    onClick={onSubmit}
                    sx={{
                        mt: 1,
                        backgroundColor: '#a855f7',
                        '&:hover': { backgroundColor: '#9333ea' },
                    }}
                >
                    Apply Template
                </Button>
            )}
        </Box>
    );
}
