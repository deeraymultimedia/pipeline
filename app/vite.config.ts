import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  // GitHub Pages base path. The app is deployed to:
  // https://deeraymultimedia.github.io/pipeline/
  // Vite strips this prefix from asset URLs at build time.
  // React Router hash routes live AFTER '#', not after this prefix —
  // so there is no /pipeline/pipeline/ duplication.
  base: '/pipeline/',

  // Test configuration (Vitest)
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/__tests__/setup.ts'],
    css: false,
  },
});
