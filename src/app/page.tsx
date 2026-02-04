/**
 * Home Page
 * Main landing page with PromptEnhancer component
 */

'use client';

import { Container, Box, Typography, Stack, Chip, alpha } from '@mui/material';
import { AutoAwesome as SparkleIcon } from '@mui/icons-material';
import { PromptEnhancer } from '@/components';

export default function HomePage() {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ textAlign: 'center', mb: 6 }}>
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
          Transform rough ideas into comprehensive, well-structured AI prompts with one click
        </Typography>

        <Stack
          direction="row"
          spacing={1}
          justifyContent="center"
          flexWrap="wrap"
          useFlexGap
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
            label="🎯 Refine Mode"
            size="small"
            sx={{
              bgcolor: (theme) => alpha(theme.palette.secondary.main, 0.1),
              color: 'secondary.light',
            }}
          />
          <Chip
            label="💰 Save API Credits"
            size="small"
            sx={{
              bgcolor: (theme) => alpha(theme.palette.warning.main, 0.1),
              color: 'warning.light',
            }}
          />
        </Stack>
      </Box>

      {/* Main Content */}
      <PromptEnhancer />

      {/* Footer */}
      <Box sx={{ textAlign: 'center', mt: 8, pt: 4, borderTop: 1, borderColor: 'divider' }}>
        <Typography variant="body2" color="text.secondary">
          Built with ❤️ using Next.js, Material UI & Meta-Prompting
        </Typography>
      </Box>
    </Container>
  );
}
