import { React } from 'react';
import { Alert } from '../components/Alert';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Alert', () => {
  it('renders with the correct error message', () => {
    render(<Alert msg={'Test message'} />);
    expect(screen.getByText(/test message/i)).toBeInTheDocument();
  });

  it('renders as an error alert', () => {
    render(<Alert />);
    expect(screen.getByText(/error alert/i)).toBeInTheDocument();
  });

  it('triggers close button when clicked', () => {
    const onClick = jest.fn();
    render(<Alert toggleModal={onClick} />);
    userEvent.click(screen.getByRole('button', { name: /close/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
