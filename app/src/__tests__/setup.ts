/**
 * Vitest global test setup.
 * Runs before all test files.
 */
import '@testing-library/jest-dom';

// Mock import.meta.env for tests
(globalThis as unknown as Record<string, unknown>).import = {
  meta: {
    env: {
      VITE_USE_MOCK_DATA: 'false',
      MODE: 'test',
      DEV: false,
      PROD: false,
    },
  },
};
