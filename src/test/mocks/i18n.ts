import { vi } from 'vitest';

export const mockTranslation = {
  t: vi.fn((key: string) => key),
  i18n: {
    language: 'en',
    changeLanguage: vi.fn()
  }
};

vi.mock('react-i18next', () => ({
  useTranslation: () => mockTranslation,
  Trans: ({ children }: any) => children,
  I18nextProvider: ({ children }: any) => children
}));
