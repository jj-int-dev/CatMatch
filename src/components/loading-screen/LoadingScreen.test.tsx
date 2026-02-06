import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LoadingScreen from './LoadingScreen';

// Mock the navigation store before imports
const mockSetNavigationColor = vi.fn();

vi.mock('../../stores/navigation-store', () => ({
  useNavigationStore: vi.fn(() => mockSetNavigationColor)
}));

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => key,
    i18n: {
      language: 'en',
      changeLanguage: vi.fn()
    }
  })
}));

describe('LoadingScreen', () => {
  beforeEach(() => {
    mockSetNavigationColor.mockClear();
  });

  it('should render loading text', () => {
    render(<LoadingScreen />);

    expect(screen.getByText('loading')).toBeInTheDocument();
  });

  it('should render three bouncing dots', () => {
    const { container } = render(<LoadingScreen />);

    const dots = container.querySelectorAll('.animate-dot-hover');
    expect(dots).toHaveLength(3);
  });

  it('should render dot shadows', () => {
    const { container } = render(<LoadingScreen />);

    const shadows = container.querySelectorAll('.animate-dot-shadow');
    expect(shadows).toHaveLength(3);
  });

  it('should have gradient background', () => {
    const { container } = render(<LoadingScreen />);

    const background = container.querySelector('.bg-gradient-to-br');
    expect(background).toBeInTheDocument();
  });

  it('should apply animation delays to dots', () => {
    const { container } = render(<LoadingScreen />);

    const dots = container.querySelectorAll('.animate-dot-hover');

    // Check that animation delays are set
    expect(dots[0]).toHaveStyle({ animationDelay: '0ms' });
    expect(dots[1]).toHaveStyle({ animationDelay: '200ms' });
    expect(dots[2]).toHaveStyle({ animationDelay: '400ms' });
  });

  it('should set navigation color to transparent', () => {
    render(<LoadingScreen />);

    expect(mockSetNavigationColor).toHaveBeenCalledWith('transparent');
  });
});
