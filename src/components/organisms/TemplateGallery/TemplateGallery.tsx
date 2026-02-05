/**
 * TemplateGallery Component (Redux version)
 * Browse, search, and filter templates using Redux state
 */

'use client';

import React, { useEffect } from 'react';
import {
    Box,
    TextField,
    Tabs,
    Tab,
    InputAdornment,
    Typography,
    Grid,
    IconButton,
    Tooltip,
} from '@mui/material';
import {
    Search,
    Star,
    Code,
    Edit,
    Campaign,
    Assignment,
    Brush,
    Apps,
    Add,
} from '@mui/icons-material';
import { TemplateCard } from '@/components/molecules/TemplateCard';
import { PromptTemplate } from '@/core/templates/template.types';
import {
    useAppDispatch,
    useAppSelector,
    setSearchQuery,
    setActiveCategory,
    toggleFavorite,
    initializeFromStorage,
    selectSearchFilteredTemplates,
} from '@/store';

interface TemplateGalleryProps {
    onSelectTemplate: (template: PromptTemplate) => void;
    onPreviewTemplate?: (template: PromptTemplate) => void;
    onCreateNew?: () => void;
}

type TabValue = 'all' | 'coding' | 'writing' | 'marketing' | 'productivity' | 'creative' | 'favorites' | 'custom';

interface TabConfig {
    value: TabValue;
    label: string;
    icon: React.ReactElement;
}

const TABS: TabConfig[] = [
    { value: 'all', label: 'All', icon: <Apps fontSize="small" /> },
    { value: 'coding', label: 'Coding', icon: <Code fontSize="small" /> },
    { value: 'writing', label: 'Writing', icon: <Edit fontSize="small" /> },
    { value: 'marketing', label: 'Marketing', icon: <Campaign fontSize="small" /> },
    { value: 'productivity', label: 'Productivity', icon: <Assignment fontSize="small" /> },
    { value: 'creative', label: 'Creative', icon: <Brush fontSize="small" /> },
    { value: 'favorites', label: 'Favorites', icon: <Star fontSize="small" /> },
    { value: 'custom', label: 'My Templates', icon: <Add fontSize="small" /> },
];

export function TemplateGallery({
    onSelectTemplate,
    onPreviewTemplate,
    onCreateNew,
}: TemplateGalleryProps) {
    const dispatch = useAppDispatch();

    // Redux state
    const activeCategory = useAppSelector((state) => state.templates.activeCategory);
    const searchQuery = useAppSelector((state) => state.templates.searchQuery);
    const favorites = useAppSelector((state) => state.templates.favorites);
    const filteredTemplates = useAppSelector(selectSearchFilteredTemplates);

    // Initialize from localStorage on mount
    useEffect(() => {
        dispatch(initializeFromStorage());
    }, [dispatch]);

    const handleToggleFavorite = (templateId: string) => {
        dispatch(toggleFavorite(templateId));
    };

    return (
        <Box sx={{ width: '100%' }}>
            {/* Header */}
            <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography
                    variant="h5"
                    sx={{
                        fontWeight: 600,
                        background: 'linear-gradient(90deg, #fff 0%, rgba(255,255,255,0.7) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                    }}
                >
                    Template Library
                </Typography>
                {onCreateNew && (
                    <Tooltip title="Create custom template">
                        <IconButton
                            onClick={onCreateNew}
                            sx={{
                                backgroundColor: 'rgba(168,85,247,0.15)',
                                color: '#a855f7',
                                '&:hover': { backgroundColor: 'rgba(168,85,247,0.25)' },
                            }}
                        >
                            <Add />
                        </IconButton>
                    </Tooltip>
                )}
            </Box>

            {/* Search Bar */}
            <TextField
                fullWidth
                placeholder="Search templates by name, description, or tags..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                size="small"
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <Search sx={{ color: 'rgba(255,255,255,0.4)' }} />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    mb: 2,
                    '& .MuiOutlinedInput-root': {
                        backgroundColor: 'rgba(255,255,255,0.03)',
                        borderRadius: 2,
                        '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
                        '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
                        '&.Mui-focused fieldset': { borderColor: '#a855f7' },
                    },
                    '& .MuiInputBase-input': { color: 'white' },
                }}
            />

            {/* Category Tabs */}
            <Tabs
                value={activeCategory}
                onChange={(_, newValue) => dispatch(setActiveCategory(newValue))}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                    mb: 3,
                    '& .MuiTab-root': {
                        color: 'rgba(255,255,255,0.5)',
                        minHeight: 48,
                        textTransform: 'capitalize',
                        '&.Mui-selected': { color: 'white' },
                    },
                    '& .MuiTabs-indicator': { backgroundColor: '#a855f7' },
                }}
            >
                {TABS.map((tab) => (
                    <Tab
                        key={tab.value}
                        value={tab.value}
                        label={tab.label}
                        icon={tab.icon}
                        iconPosition="start"
                        sx={{ '& .MuiTab-iconWrapper': { marginRight: 1 } }}
                    />
                ))}
            </Tabs>

            {/* Results Count */}
            <Typography variant="body2" sx={{ mb: 2, color: 'rgba(255,255,255,0.5)' }}>
                {filteredTemplates.length} template{filteredTemplates.length !== 1 ? 's' : ''} found
            </Typography>

            {/* Template Grid */}
            {filteredTemplates.length > 0 ? (
                <Grid container spacing={2}>
                    {filteredTemplates.map((template) => (
                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={template.id}>
                            <TemplateCard
                                template={template}
                                isFavorite={favorites.includes(template.id)}
                                onToggleFavorite={handleToggleFavorite}
                                onUseTemplate={onSelectTemplate}
                                onPreview={onPreviewTemplate}
                            />
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Box
                    sx={{
                        textAlign: 'center',
                        py: 8,
                        px: 4,
                        backgroundColor: 'rgba(255,255,255,0.02)',
                        borderRadius: 2,
                        border: '1px dashed rgba(255,255,255,0.1)',
                    }}
                >
                    <Typography variant="h6" sx={{ color: 'rgba(255,255,255,0.5)', mb: 1 }}>
                        No templates found
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.3)' }}>
                        {searchQuery
                            ? 'Try a different search term'
                            : activeCategory === 'favorites'
                                ? 'Star some templates to see them here'
                                : activeCategory === 'custom'
                                    ? 'Create your first custom template'
                                    : 'No templates available'}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
