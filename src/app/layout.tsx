/**
 * Root Layout
 * Wraps the application with MUI Theme Provider and Redux Store
 */

import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { ThemeProvider } from '@/theme';
import { StoreProvider } from '@/store/StoreProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Prompt Enhancer | Transform Your AI Prompts',
  description: 'Enhance your AI prompts with one click. Transform rough ideas into comprehensive, well-structured prompts for ChatGPT, Claude, and more.',
  keywords: ['prompt engineering', 'AI prompts', 'ChatGPT', 'Claude', 'prompt optimization'],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <StoreProvider>
          <ThemeProvider>
            {children}
          </ThemeProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
