/**
 * Home Page
 * Main landing page with PromptEnhancer and Template Gallery
 */

'use client';

import { useState } from 'react';
import { Container, Box, Typography, Stack, Chip, alpha, Tabs, Tab } from '@mui/material';
import { AutoAwesome as SparkleIcon, LibraryBooks, Edit } from '@mui/icons-material';
import { PromptEnhancer } from '@/components';
import { TemplateGallery } from '@/components/organisms/TemplateGallery';
import { TemplatePreview } from '@/components/organisms/TemplatePreview';
import { PromptTemplate } from '@/core/templates/template.types';

type TabValue = 'enhancer' | 'templates';

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<TabValue>('enhancer');
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [initialPrompt, setInitialPrompt] = useState('');

  const handleSelectTemplate = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  const handlePreviewTemplate = (template: PromptTemplate) => {
    setSelectedTemplate(template);
    setPreviewOpen(true);
  };

  const handleApplyTemplate = (renderedPrompt: string) => {
    setInitialPrompt(renderedPrompt);
    setActiveTab('enhancer');
    setPreviewOpen(false);
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
            label="🎯 Variable Injection"
            size="small"
            sx={{
              bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
              color: 'warning.light',
            }}
          />
        </Stack>
      </Box>

      {/* Main Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
        <Tabs
          value={activeTab}
          onChange={(_, value) => setActiveTab(value)}
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
            label="Template Library"
            icon={<LibraryBooks />}
            iconPosition="start"
          />
        </Tabs>
      </Box>

      {/* Content */}
      {activeTab === 'enhancer' ? (
        <PromptEnhancer key={initialPrompt} initialPrompt={initialPrompt} />
      ) : (
        <TemplateGallery
          onSelectTemplate={handleSelectTemplate}
          onPreviewTemplate={handlePreviewTemplate}
        />
      )}

      {/* Template Preview Modal */}
      <TemplatePreview
        open={previewOpen}
        template={selectedTemplate}
        onClose={() => setPreviewOpen(false)}
        onApply={handleApplyTemplate}
      />

      {/* Footer */}
      <Box sx={{ textAlign: 'center', mt: 8, pt: 4, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary">
          Built with ❤️ using Next.js, Material UI & Smart Templates
        </Typography>
      </Box>
    </Container>
  );
}
