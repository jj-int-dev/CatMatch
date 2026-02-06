import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import svgr from 'vite-plugin-svgr';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    svgr({
      include: '**/*.svg?react'
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.d.ts',
        '**/*.config.*',
        '**/dist/**',
        'src/main.tsx',
        'src/index.css',
        'src/app/App.css',
        'src/vite-env.d.ts',
        // Type-only files
        'src/types/**',
        'src/**/types/**',
        // Assets
        'src/assets/**',
        // Configuration files
        'eslint.config.js',
        'tailwind.config.ts',
        'vite.config.ts',
        'vitest.config.ts'
      ],
      include: ['src/**/*.{ts,tsx}'],
      thresholds: {
        lines: 70,
        functions: 70,
        branches: 70,
        statements: 70
      }
    },
    css: true,
    clearMocks: true,
    restoreMocks: true,
    mockReset: true
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
});
