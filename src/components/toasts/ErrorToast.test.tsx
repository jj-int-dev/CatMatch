import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ErrorToast from './ErrorToast';

describe('ErrorToast', () => {
  it('should render single error message', () => {
    render(<ErrorToast messages={['Error occurred']} />);

    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });

  it('should render multiple error messages as a list', () => {
    const messages = ['Error 1', 'Error 2', 'Error 3'];
    render(<ErrorToast messages={messages} />);

    messages.forEach((message) => {
      expect(screen.getByText(message)).toBeInTheDocument();
    });

    // Should render as list items
    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });

  it('should render close button when onCloseToast is provided', () => {
    const onClose = vi.fn();
    render(<ErrorToast messages={['Error']} onCloseToast={onClose} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('should not render close button when onCloseToast is not provided', () => {
    render(<ErrorToast messages={['Error']} />);

    const closeButton = screen.queryByRole('button', { name: /close/i });
    expect(closeButton).not.toBeInTheDocument();
  });

  it('should call onCloseToast when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<ErrorToast messages={['Error']} onCloseToast={onClose} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should render error icon', () => {
    const { container } = render(<ErrorToast messages={['Error']} />);

    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
  });

  it('should have proper alert classes', () => {
    const { container } = render(<ErrorToast messages={['Error']} />);

    const alert = container.querySelector('.alert-error');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('alert', 'alert-error');
  });

  it('should handle empty messages array gracefully', () => {
    const { container } = render(<ErrorToast messages={[]} />);

    expect(container.querySelector('.alert-error')).toBeInTheDocument();
  });

  it('should render long messages without breaking layout', () => {
    const longMessage =
      'This is a very long error message that should still render properly without breaking the layout or causing any visual issues in the toast component.';
    render(<ErrorToast messages={[longMessage]} />);

    expect(screen.getByText(longMessage)).toBeInTheDocument();
  });
});
