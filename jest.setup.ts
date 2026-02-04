import '@testing-library/jest-dom';

// Mock environment variables for testing
process.env.OPENAI_API_KEY = 'test-openai-key';
process.env.ANTHROPIC_API_KEY = 'test-anthropic-key';
process.env.DEFAULT_LLM_PROVIDER = 'openai';
