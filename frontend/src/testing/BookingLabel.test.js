import { render } from '@testing-library/react'
import { React } from 'react'
import { BookingLabel } from '../components/BookingLabel'

describe('Booking Label', () => {
  const booking = {
    booking: {
      owner: 'test@gmail.com',
      dateRange: {
        start: '25/12/2022',
        end: '28/12/2022'
      },
      totalPrice: 3000,
      listingId: '736266314',
      status: 'pending'
    }
  };

  it('normal state', () => {
    render(<BookingLabel booking={booking}/>);
  })
})
