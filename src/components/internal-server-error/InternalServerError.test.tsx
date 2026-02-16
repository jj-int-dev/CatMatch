import { renderWithProviders } from '../../test/test-utils';
import { screen } from '@testing-library/react';
import InternalServerError from './InternalServerError';

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

// Mock useNavigate
vi.mock('react-router', () => ({
  useNavigate: () => vi.fn()
}));

describe('InternalServerError', () => {
  it('should render error heading', () => {
    renderWithProviders(<InternalServerError />);

    expect(screen.getByText('internal_server_error')).toBeInTheDocument();
  });

  it('should render error message', () => {
    renderWithProviders(<InternalServerError />);

    expect(screen.getByText('error_notification_message')).toBeInTheDocument();
  });

  it('should have proper heading hierarchy', () => {
    renderWithProviders(<InternalServerError />);

    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent('internal_server_error');
  });

  it('should center content on screen', () => {
    const { container } = renderWithProviders(<InternalServerError />);

    const wrapper = container.firstChild;
    expect(wrapper).toHaveClass('flex', 'items-center', 'justify-center');
  });
});
