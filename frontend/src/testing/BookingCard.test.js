import { React } from 'react';
import { BookingCard } from '../components/BookingCard';
import { render, screen } from '@testing-library/react';

describe('Booking Card', () => {
  it('renders with the correct status', () => {
    render(<BookingCard status='accepted' />);
    expect(screen.getByText(/accepted/i)).toBeInTheDocument();
  });

  it('renders with the correct date range', () => {
    render(<BookingCard dateFrom={'11/10/2022'} dateTo={'15/10/2022'} />);
    expect(screen.getByText('From: 11/10/2022')).toBeInTheDocument();
    expect(screen.getByText('To: 15/10/2022')).toBeInTheDocument();
  });

  it('renders with the correct price', () => {
    render(<BookingCard price={3000} />);
    expect(screen.getByText(/price/i)).toBeInTheDocument();
    expect(screen.getByText(/3000/i)).toBeInTheDocument();
  });
});
