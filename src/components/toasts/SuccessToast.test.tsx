import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SuccessToast from './SuccessToast';

describe('SuccessToast', () => {
  it('should render single success message', () => {
    render(<SuccessToast messages={['Operation successful']} />);

    expect(screen.getByText('Operation successful')).toBeInTheDocument();
  });

  it('should render multiple success messages as a list', () => {
    const messages = ['Success 1', 'Success 2', 'Success 3'];
    render(<SuccessToast messages={messages} />);

    messages.forEach((message) => {
      expect(screen.getByText(message)).toBeInTheDocument();
    });

    const listItems = screen.getAllByRole('listitem');
    expect(listItems).toHaveLength(3);
  });

  it('should render close button when onCloseToast is provided', () => {
    const onClose = vi.fn();
    render(<SuccessToast messages={['Success']} onCloseToast={onClose} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toBeInTheDocument();
  });

  it('should not render close button when onCloseToast is not provided', () => {
    render(<SuccessToast messages={['Success']} />);

    const closeButton = screen.queryByRole('button', { name: /close/i });
    expect(closeButton).not.toBeInTheDocument();
  });

  it('should call onCloseToast when close button is clicked', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    render(<SuccessToast messages={['Success']} onCloseToast={onClose} />);

    const closeButton = screen.getByRole('button', { name: /close/i });
    await user.click(closeButton);

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should have proper alert classes', () => {
    const { container } = render(<SuccessToast messages={['Success']} />);

    const alert = container.querySelector('.alert-success');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveClass('alert', 'alert-success');
  });
});
