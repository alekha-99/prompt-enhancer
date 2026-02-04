/**
 * @jest-environment jsdom
 */

import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import PromptEnhancer from './PromptEnhancer';
import { ThemeProvider } from '@/theme';

// Mock clipboard hook
const mockCopy = jest.fn();
jest.mock('@/shared/hooks', () => ({
    useClipboard: () => ({
        copied: false,
        copy: mockCopy,
        reset: jest.fn(),
    }),
}));

global.fetch = jest.fn();

const renderWithTheme = (component: React.ReactNode) => {
    return render(
        <ThemeProvider>
            {component}
        </ThemeProvider>
    );
};

describe('PromptEnhancer', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render initial state', () => {
        renderWithTheme(<PromptEnhancer />);
        expect(screen.getByPlaceholderText(/Enter your rough prompt/i)).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /improve/i })).toBeDisabled();
        expect(screen.getByRole('button', { name: /refine/i })).toBeDisabled();
    });

    it('should enable buttons when input is provided', async () => {
        const user = userEvent.setup();
        renderWithTheme(<PromptEnhancer />);
        const input = screen.getByPlaceholderText(/Enter your rough prompt/i);

        await user.type(input, 'test prompt');

        expect(screen.getByRole('button', { name: /improve/i })).toBeEnabled();
        expect(screen.getByRole('button', { name: /refine/i })).toBeEnabled();
    });

    it('should handle Improve flow', async () => {
        const user = userEvent.setup();
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({ success: true, enhancedPrompt: 'Enhanced Result' }),
        });

        renderWithTheme(<PromptEnhancer />);
        const input = screen.getByPlaceholderText(/Enter your rough prompt/i);
        await user.type(input, 'test prompt');

        const improveBtn = screen.getByRole('button', { name: /improve/i });
        await user.click(improveBtn);

        await waitFor(() => {
            expect(screen.getByText('Enhanced Result')).toBeInTheDocument();
        });
    });

    it('should handle Refine flow', async () => {
        const user = userEvent.setup();
        // Mock questions response
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({ success: true, questions: ['Q1'] }),
        });

        renderWithTheme(<PromptEnhancer />);
        const input = screen.getByPlaceholderText(/Enter your rough prompt/i);
        await user.type(input, 'test prompt');

        const refineBtn = screen.getByRole('button', { name: /refine/i });
        await user.click(refineBtn);

        // Wait for questions
        await waitFor(() => {
            expect(screen.getByText('1. Q1')).toBeInTheDocument();
        });

        // Mock enhance response
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({ success: true, enhancedPrompt: 'Refined Result' }),
        });

        // Answer question
        const answerInput = screen.getByPlaceholderText('Your answer...');
        await user.type(answerInput, 'Answer 1');

        // Submit
        const generateBtn = screen.getByRole('button', { name: /generate enhanced prompt/i });
        await user.click(generateBtn);

        await waitFor(() => {
            expect(screen.getByText('Refined Result')).toBeInTheDocument();
        });
    });

    it('should handle API errors', async () => {
        const user = userEvent.setup();
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            json: async () => ({ success: false, error: 'API Error' }),
        });

        renderWithTheme(<PromptEnhancer />);
        const input = screen.getByPlaceholderText(/Enter your rough prompt/i);
        await user.type(input, 'test prompt');

        const improveBtn = screen.getByRole('button', { name: /improve/i });
        await user.click(improveBtn);

        await waitFor(() => {
            expect(screen.getByText('API Error')).toBeInTheDocument();
        });
    });
});
