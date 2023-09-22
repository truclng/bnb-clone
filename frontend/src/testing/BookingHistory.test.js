import { React } from 'react';
import { BookingHistory } from '../components/BookingHistory';
import { render, screen } from '@testing-library/react';
import moment from 'moment/moment';

describe('Booking History', () => {
  const bookingTest1 = [
    {
      dateRange: {
        start: '11/11/2022',
        end: '19/11/2022'
      },
      status: 'accepted',
      totalPrice: 1600
    }
  ];

  const bookingTest2 = [
    {
      dateRange: {
        start: '11/11/2022',
        end: '19/11/2022'
      },
      status: 'declined',
      totalPrice: 1600
    },
    {
      dateRange: {
        start: '11/11/2022',
        end: '19/11/2022'
      },
      status: 'accepted',
      totalPrice: 1600
    }
  ];

  const bookingTest3 = [
    {
      dateRange: {
        start: '29/12/2022',
        end: '02/01/2023'
      },
      status: 'accepted',
      totalPrice: 1600
    }
  ];

  it('renders with correct basic skeleton text', () => {
    render(<BookingHistory bookings={[]} />);
    expect(screen.getByText(/Listing Online Duration/i)).toBeInTheDocument();
    expect(screen.getByText(/Number of Days Booked This Year/i)).toBeInTheDocument();
    expect(screen.getByText(/Profit This Year/i)).toBeInTheDocument();
  });

  it('renders with correct history and profit', () => {
    render(<BookingHistory bookings={bookingTest1} />);
    expect(screen.getByText(/1600/i)).toBeInTheDocument();
    expect(screen.getByText(/8/i)).toBeInTheDocument();
  });

  it('renders without income from declined bookings', () => {
    render(<BookingHistory bookings={bookingTest2} />);
    expect(screen.getByText(/1600/i)).toBeInTheDocument();
    expect(screen.getByText(/8/i)).toBeInTheDocument();
  });

  it('renders history for bookings this year only', () => {
    render(<BookingHistory bookings={bookingTest3} />);
    expect(screen.getByText(/2/i)).toBeInTheDocument();
  });

  it('renders with days in singular form for listings uploaded 1 day ago', () => {
    render(<BookingHistory postedDate={moment().subtract(1, 'day').toISOString().toString()} bookings={[]} />);
    expect(screen.getByText('1 day')).toBeInTheDocument();
  });

  it('renders with correct history for a listing posted now', () => {
    render(<BookingHistory postedDate={moment().toISOString().toString()} bookings={[]} />);
    expect(screen.getByText('0 days')).toBeInTheDocument();
  });
});
