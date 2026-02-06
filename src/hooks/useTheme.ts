import { useState, useEffect } from 'react';
import type { Theme } from '../types/Theme';

const THEME_STORAGE_KEY = 'catmatch-theme';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first
    const storedTheme = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    if (storedTheme && (storedTheme === 'light' || storedTheme === 'dark')) {
      return storedTheme;
    }

    // Check system preference
    if (
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches
    ) {
      return 'dark';
    }

    // Default to light
    return 'light';
  });

  useEffect(() => {
    const html = document.documentElement;

    // Remove any existing theme classes
    html.classList.remove('light', 'dark');

    // Add the current theme class
    html.classList.add(theme);

    // Set data-theme attribute for daisyUI
    html.setAttribute('data-theme', theme);

    // Store in localStorage
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const setThemeDirectly = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  return {
    theme,
    toggleTheme,
    setTheme: setThemeDirectly,
    isDark: theme === 'dark',
    isLight: theme === 'light'
  };
}
