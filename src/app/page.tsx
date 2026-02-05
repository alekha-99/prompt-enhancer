/**
 * Home Page (Redux version)
 * Main landing page with PromptEnhancer and Template Gallery
 */

'use client';

import { useEffect } from 'react';
import { Container, Box, Typography, Stack, Chip, alpha, Tabs, Tab } from '@mui/material';
import { AutoAwesome as SparkleIcon, LibraryBooks, Edit, Psychology } from '@mui/icons-material';
import { PromptEnhancer } from '@/components';
import { TemplateGallery } from '@/components/organisms/TemplateGallery';
import { TemplatePreview } from '@/components/organisms/TemplatePreview';
import { PatternLibrary } from '@/components/organisms/PatternLibrary';
import {
  useAppDispatch,
  useAppSelector,
  setActiveTab,
  openTemplatePreview,
  initializeFromStorage,
  setInputPrompt,
} from '@/store';
import { PromptTemplate } from '@/core/templates/template.types';

export default function HomePage() {
  const dispatch = useAppDispatch();
  const activeTab = useAppSelector((state) => state.ui.activeTab);
  const inputPrompt = useAppSelector((state) => state.ui.inputPrompt);

  // Initialize templates from localStorage on mount
  useEffect(() => {
    dispatch(initializeFromStorage());
  }, [dispatch]);

  const handleSelectTemplate = (template: PromptTemplate) => {
    dispatch(openTemplatePreview(template));
  };

  const handleApplyPattern = (template: string) => {
    dispatch(setInputPrompt(template));
    dispatch(setActiveTab('enhancer'));
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mb={2}>
          <SparkleIcon sx={{ fontSize: 40, color: 'primary.main' }} />
          <Typography
            variant="h1"
            sx={{
              fontSize: { xs: '2rem', md: '2.5rem' },
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Prompt Enhancer
          </Typography>
        </Stack>

        <Typography
          variant="h2"
          color="text.secondary"
          sx={{
            fontSize: { xs: '1rem', md: '1.25rem' },
            fontWeight: 400,
            maxWidth: 600,
            mx: 'auto',
            mb: 3,
          }}
        >
          Transform rough ideas into comprehensive, well-structured AI prompts
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          flexWrap="wrap"
          useFlexGap
          sx={{ mb: 3 }}
        >
          <Chip
            label="⚡ One-Click Enhancement"
            size="small"
            sx={{
              bgcolor: (theme) => alpha(theme.palette.primary.main, 0.1),
              color: 'primary.light',
            }}
          />
          <Chip
            label="📚 25+ Templates"
            size="small"
            sx={{
              bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1),
              color: 'secondary.light',
            }}
          />
          <Chip
            label="🎯 Redux Powered"
            size="small"
            sx={{
              bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
              color: 'warning.light',
            }}
          />
        </Stack>

        <Chip
          label="🧠 15+ Prompt Patterns"
          size="small"
          sx={{
            bgcolor: (theme) => alpha(theme.palette.success.main, 0.1),
            color: 'success.light',
          }}
        />
      </Box>

      {/* Main Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(_, value) => dispatch(setActiveTab(value))}
          centered
          sx={{
            '& .MuiTab-root': {
              color: 'rgba(255,255,255,0.5)',
              fontSize: '1rem',
              textTransform: 'none',
              '&.Mui-selected': { color: 'white' },
            },
            '& .MuiTabs-indicator': { backgroundColor: '#a855f7' },
          }}
        >
          <Tab
            value="enhancer"
            label="Write & Enhance"
            icon={<Edit />}
            iconPosition="start"
          />
          <Tab
            value="templates"
            label="Templates"
            icon={<LibraryBooks />}
            iconPosition="start"
          />
          <Tab
            value="patterns"
            label="Patterns"
            icon={<Psychology />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Content */}
      {activeTab === 'enhancer' && (
        <PromptEnhancer key={inputPrompt} initialPrompt={inputPrompt} />
      )}
      {activeTab === 'templates' && (
        <TemplateGallery
          onSelectTemplate={handleSelectTemplate}
          onPreviewTemplate={handleSelectTemplate}
        />
      )}
      {activeTab === 'patterns' && (
        <Box sx={{ maxWidth: 800, mx: 'auto' }}>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            🧠 Prompt Patterns
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Pre-built patterns for effective prompting. Click to apply a pattern to your prompt.
          </Typography>
          <PatternLibrary onApplyPattern={handleApplyPattern} />
        </Box>
      )}

      {/* Template Preview Modal (controlled by Redux) */}
      <TemplatePreview />

      {/* Footer */}
      <Box sx={{ textAlign: 'center', mt: 8, pt: 4, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary">
          Built with ❤️ using Next.js, Material UI, Redux Toolkit & Smart Templates
        </Typography>
      </Box>
    </Container>
  );
}
