/**
 * TemplateCard Component
 * Displays a single template in the gallery
 */

'use client';

import React from 'react';
import {
    Card,
    CardContent,
    CardActions,
    Typography,
    Chip,
    IconButton,
    Box,
    Tooltip,
} from '@mui/material';
import {
    Star,
    StarBorder,
    PlayArrow,
    Code,
    Edit,
    Campaign,
    Lightbulb,
    Brush,
    Assignment,
} from '@mui/icons-material';
import { PromptTemplate, TemplateCategory } from '@/core/templates/template.types';

interface TemplateCardProps {
    template: PromptTemplate;
    isFavorite: boolean;
    onToggleFavorite: (templateId: string) => void;
    onUseTemplate: (template: PromptTemplate) => void;
    onPreview?: (template: PromptTemplate) => void;
}

/**
 * Category color and icons mapping
 */
const CATEGORY_CONFIG: Record<TemplateCategory, { color: string; icon: React.ReactNode }> = {
    coding: { color: '#22c55e', icon: <Code fontSize="small" /> },
    writing: { color: '#eab308', icon: <Edit fontSize="small" /> },
    marketing: { color: '#f97316', icon: <Campaign fontSize="small" /> },
    productivity: { color: '#3b82f6', icon: <Assignment fontSize="small" /> },
    creative: { color: '#a855f7', icon: <Brush fontSize="small" /> },
};

export function TemplateCard({
    template,
    isFavorite,
    onToggleFavorite,
    onUseTemplate,
    onPreview,
}: TemplateCardProps) {
    const categoryConfig = CATEGORY_CONFIG[template.category];
    const variableCount = template.variables.length;

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                background: 'linear-gradient(145deg, rgba(30,30,35,1) 0%, rgba(25,25,30,1) 100%)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: 2,
                transition: 'all 0.2s ease',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    borderColor: categoryConfig.color,
                    boxShadow: `0 8px 24px rgba(0,0,0,0.3)`,
                },
            }}
        >
            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                {/* Category Badge */}
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                    <Chip
                        icon={categoryConfig.icon as React.ReactElement}
                        label={template.category}
                        size="small"
                        sx={{
                            backgroundColor: `${categoryConfig.color}20`,
                            color: categoryConfig.color,
                            border: `1px solid ${categoryConfig.color}40`,
                            textTransform: 'capitalize',
                            fontSize: '0.7rem',
                        }}
                    />
                    <IconButton
                        size="small"
                        onClick={() => onToggleFavorite(template.id)}
                        sx={{
                            color: isFavorite ? '#fbbf24' : 'rgba(255,255,255,0.4)',
                            '&:hover': { color: '#fbbf24' },
                        }}
                    >
                        {isFavorite ? <Star /> : <StarBorder />}
                    </IconButton>
                </Box>

                {/* Title */}
                <Typography
                    variant="h6"
                    sx={{
                        fontSize: '1rem',
                        fontWeight: 600,
                        color: 'white',
                        mb: 0.5,
                    }}
                >
                    {template.name}
                </Typography>

                {/* Description */}
                <Typography
                    variant="body2"
                    sx={{
                        color: 'rgba(255,255,255,0.6)',
                        fontSize: '0.8rem',
                        lineHeight: 1.4,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                    }}
                >
                    {template.description}
                </Typography>

                {/* Variable Count */}
                <Box sx={{ mt: 1.5, display: 'flex', gap: 1 }}>
                    <Chip
                        label={`${variableCount} variable${variableCount !== 1 ? 's' : ''}`}
                        size="small"
                        sx={{
                            backgroundColor: 'rgba(255,255,255,0.05)',
                            color: 'rgba(255,255,255,0.5)',
                            fontSize: '0.7rem',
                            height: '22px',
                        }}
                    />
                    {template.isCustom && (
                        <Chip
                            label="Custom"
                            size="small"
                            sx={{
                                backgroundColor: 'rgba(168,85,247,0.15)',
                                color: '#a855f7',
                                fontSize: '0.7rem',
                                height: '22px',
                            }}
                        />
                    )}
                </Box>
            </CardContent>

            <CardActions sx={{ px: 2, pb: 2, pt: 0, justifyContent: 'flex-end' }}>
                {onPreview && (
                    <Tooltip title="Preview template">
                        <IconButton
                            size="small"
                            onClick={() => onPreview(template)}
                            sx={{
                                color: 'rgba(255,255,255,0.5)',
                                '&:hover': { color: 'white' },
                            }}
                        >
                            <Lightbulb fontSize="small" />
                        </IconButton>
                    </Tooltip>
                )}
                <Tooltip title="Use this template">
                    <IconButton
                        size="small"
                        onClick={() => onUseTemplate(template)}
                        sx={{
                            backgroundColor: categoryConfig.color,
                            color: 'white',
                            '&:hover': {
                                backgroundColor: categoryConfig.color,
                                opacity: 0.9,
                            },
                        }}
                    >
                        <PlayArrow fontSize="small" />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
}
