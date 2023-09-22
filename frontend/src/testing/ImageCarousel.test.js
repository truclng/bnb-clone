import { render, screen } from '@testing-library/react'
import { React } from 'react';
import { ImageCarousel } from '../components/ImageCarousel'

describe('Image Carousel', () => {
  it('normal state', () => {
    render(<ImageCarousel pictures={undefined} />);
    expect(screen.getByText(/no pictures uploaded!/i)).toBeInTheDocument();
  })

  it('1 picture by accessibility', () => {
    render(<ImageCarousel pictures={[{ img: 'foo', label: 'bar' }]} />)
    expect(screen.getByAltText('bar')).toBeInTheDocument();
  })

  it('2 picture by accessibility moving from one to the second', () => {
    render(<ImageCarousel pictures={[{ img: 'foo', label: 'bar' }, { img: 'fizz', label: 'buzz' }]} />)
    expect(screen.getByAltText('bar')).toBeInTheDocument();
  })
})
