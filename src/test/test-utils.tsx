import type { ReactElement } from 'react';
import { render, type RenderOptions } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router';

// Create a custom render function that includes providers
const createTestQueryClient = () =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
        gcTime: 0,
        staleTime: 0
      },
      mutations: {
        retry: false
      }
    }
  });

interface ExtendedRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  withRouter?: boolean;
  queryClient?: QueryClient;
}

export function renderWithProviders(
  ui: ReactElement,
  {
    withRouter = false,
    queryClient = createTestQueryClient(),
    ...renderOptions
  }: ExtendedRenderOptions = {}
) {
  function Wrapper({ children }: { children: React.ReactNode }) {
    const content = (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    if (withRouter) {
      return <BrowserRouter>{content}</BrowserRouter>;
    }

    return content;
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    queryClient
  };
}

// Re-export everything from testing library
export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
