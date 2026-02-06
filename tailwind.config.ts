// @ts-nocheck
import type { Config } from 'tailwindcss';
import daisyui from 'daisyui';

const config = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          'Inter',
          'system-ui',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'Roboto',
          'Helvetica Neue',
          'Arial',
          'sans-serif'
        ],
        serif: [
          'Playfair Display',
          'Georgia',
          'Cambria',
          'Times New Roman',
          'serif'
        ]
      }
    }
  },
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        light: {
          primary: '#F97316', // Warm orange
          'primary-content': '#FFFFFF',
          secondary: '#0D9488', // Soft teal
          'secondary-content': '#FFFFFF',
          accent: '#FB7185', // Gentle coral
          'accent-content': '#FFFFFF',
          neutral: '#6B7280', // Warm gray
          'neutral-content': '#FFFFFF',
          'base-100': '#FAFAF9', // Off-white
          'base-200': '#F5F5F4', // Light warm gray
          'base-300': '#D6D3D1', // Medium warm gray
          'base-content': '#1C1917', // Dark text
          info: '#0EA5E9', // Sky blue
          'info-content': '#FFFFFF',
          success: '#10B981', // Emerald green
          'success-content': '#FFFFFF',
          warning: '#F59E0B', // Amber
          'warning-content': '#FFFFFF',
          error: '#EF4444', // Rose red
          'error-content': '#FFFFFF'
        },
        dark: {
          primary: '#D97706', // Muted amber
          'primary-content': '#FFFFFF',
          secondary: '#115E59', // Deep teal
          'secondary-content': '#FFFFFF',
          accent: '#E11D48', // Soft rose
          'accent-content': '#FFFFFF',
          neutral: '#9CA3AF', // Cool gray
          'neutral-content': '#FFFFFF',
          'base-100': '#1C1917', // Dark charcoal
          'base-200': '#292524', // Darker charcoal
          'base-300': '#44403C', // Medium charcoal
          'base-content': '#F5F5F4', // Light text
          info: '#0EA5E9', // Sky blue
          'info-content': '#FFFFFF',
          success: '#10B981', // Emerald green
          'success-content': '#FFFFFF',
          warning: '#F59E0B', // Amber
          'warning-content': '#FFFFFF',
          error: '#EF4444', // Rose red
          'error-content': '#FFFFFF'
        }
      }
    ],
    darkTheme: 'dark',
    base: true,
    styled: true,
    utils: true,
    prefix: '',
    logs: false,
    themeRoot: ':root'
  }
};

export default config;
