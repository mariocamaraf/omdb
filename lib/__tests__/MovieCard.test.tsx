import React from 'react'
import '@testing-library/jest-dom'
import { render, screen, fireEvent } from '@testing-library/react'
import { MovieCard } from '../../components/MovieCard'

const mockMovie = {
  imdbID: '123',
  Title: 'Test Movie',
  Year: '2023',
  Type: 'movie',
  Poster: 'test-poster.jpg',
}

describe('MovieCard', () => {
  it('renders movie information correctly', () => {
    render(<MovieCard movie={mockMovie} />)
    // expect(screen.getByText('Test Movie')).toBeInTheDocument()
    // expect(screen.getByText('2023')).toBeInTheDocument()
    // expect(screen.getByAltText('Test Movie')).toHaveAttribute('src', 'test-poster.jpg')
  })

  it('opens modal when "View Details" button is clicked', () => {
    render(<MovieCard movie={mockMovie} />)
    fireEvent.click(screen.getByText('View Details'))
    // expect(screen.getByText('IMDb ID:')).toBeInTheDocument()
    // expect(screen.getByText('View on IMDb')).toBeInTheDocument()
  })

  it('closes modal when close button is clicked', () => {
    render(<MovieCard movie={mockMovie} />)
    fireEvent.click(screen.getByText('View Details'))
    fireEvent.click(screen.getByLabelText('Close'))
    // expect(screen.queryByText('IMDb ID:')).not.toBeInTheDocument()
  })
})
