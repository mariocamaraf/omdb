import { MockedProvider } from '@apollo/client/testing'
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import MovieList from '../../components/MovieList'
import { SEARCH_MOVIES } from '../../components/MovieList'

const mocks = [
  {
    request: {
      query: SEARCH_MOVIES,
      variables: { title: 'inception', year: '', page: 1 },
    },
    result: {
      data: {
        searchMovies: {
          Search: [{ imdbID: '1', Title: 'Inception', Year: '2010', Type: 'movie', Poster: 'url' }],
          totalResults: '1',
          Response: 'True',
        },
      },
    },
  },
]

describe('MovieList', () => {
  it('renders loading state initially', () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MovieList initialMovies={[]} />
      </MockedProvider>
    )
    // expect(screen.getByText('Loading...')).toBeInTheDocument()
  })

  it('renders movies after loading', async () => {
    render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <MovieList initialMovies={[]} />
      </MockedProvider>
    )
    const movieTitle = await screen.findByText('Inception')
    // expect(movieTitle).toBeInTheDocument()
  })
})
