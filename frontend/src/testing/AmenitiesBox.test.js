import { render, screen } from '@testing-library/react'
import { React } from 'react'
import { AmenitiesBox } from '../components/AmenitiesBox'

describe('Amenities Box', () => {
  it('normal state', () => {
    render(
            <AmenitiesBox setAmenities={() => {}}/>
    );
    expect(screen.getByText(/no pictures uploaded!/i)).toBeInTheDocument();
  })
})
