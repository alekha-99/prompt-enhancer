/** @type {import('jest').Config} */
const config = {
    // Test environment
    testEnvironment: 'jest-environment-jsdom',

    // Setup files
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],

    // Module name mapping (same as tsconfig paths)
    moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
    },

    // Test patterns
    testMatch: [
        '<rootDir>/src/**/*.test.ts',
        '<rootDir>/src/**/*.test.tsx',
        '<rootDir>/tests/**/*.test.ts',
        '<rootDir>/tests/**/*.test.tsx',
    ],

    // Coverage configuration
    collectCoverageFrom: [
        'src/**/*.{ts,tsx}',
        '!src/**/*.d.ts',
        '!src/**/index.ts',
        '!src/app/layout.tsx',
        '!src/app/page.tsx',
        '!src/theme/**',
    ],

    coverageThreshold: {
        global: {
            branches: 75,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },

    // Transform
    transform: {
        '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
    },

    // Ignore patterns
    transformIgnorePatterns: [
        'node_modules/(?!(.*\\.mjs$|openai|@anthropic-ai))',
    ],
};

module.exports = config;
