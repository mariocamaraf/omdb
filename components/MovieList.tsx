'use client'

import { gql, useQuery } from '@apollo/client'
import { Loader2 } from 'lucide-react'
import { FormEvent, useEffect, useState, Suspense } from 'react'
import dynamic from 'next/dynamic'

// Update the dynamic imports with proper typing
const MovieCard = dynamic(() => import('./MovieCard').then((mod) => mod.MovieCard), {
  loading: () => <div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>,
})

const SearchForm = dynamic(() => import('./SearchForm').then((mod) => mod.default), {
  loading: () => <div className="h-16 bg-gray-200 animate-pulse rounded-lg mb-8"></div>,
})

const numbers = [1, 2, 3]
const numbers2 = [1, 2, 3, 4]

export type Movie = {
  imdbID: string
  Title: string
  Year: string
  Type: string
  Poster: string
}

export type SearchResult = {
  Search: Movie[]
  totalResults: string
  Response: string
}

export type FilterState = {
  title: string
  year: string
}

export const SEARCH_MOVIES = gql`
  query SearchMovies($title: String!, $year: String, $page: Int) {
    searchMovies(title: $title, year: $year, page: $page) {
      Search {
        imdbID
        Title
        Year
        Type
        Poster
      }
      totalResults
      Response
    }
  }
`

const GET_SUGGESTIONS = gql`
  query GetSuggestions($value: String!) {
    suggestions(value: $value)
  }
`

export default function MovieList({ initialMovies }: { initialMovies: Movie[] }) {
  const [filters, setFilters] = useState<FilterState>({
    title: 'inception',
    year: '',
  })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [debouncedTitle, setDebouncedTitle] = useState('')
  const [page, setPage] = useState(1)

  const { data, loading, error, fetchMore } = useQuery<{
    searchMovies: SearchResult
  }>(SEARCH_MOVIES, {
    variables: { title: filters.title, year: filters.year, page },
    skip: !filters.title,
  })

  const { data: suggestionData, loading: suggestionsLoading } = useQuery<{
    suggestions: string[]
  }>(GET_SUGGESTIONS, {
    variables: { value: debouncedTitle },
    skip: debouncedTitle.length < 2,
  })

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
    if (field === 'title') {
      setShowSuggestions(true)
    }
    setPage(1) // Reset page when filters change
  }

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    setShowSuggestions(false)
    setPage(1) // Reset page on new search
  }

  const handleSuggestionSelect = (title: string) => {
    setFilters((prev) => ({ ...prev, title }))
    setShowSuggestions(false)
    setPage(1) // Reset page when selecting a suggestion
  }

  const handleDebouncedSearchChange = (value: string) => {
    setDebouncedTitle(value)
  }

  const loadMore = () => {
    if (data && data.searchMovies.totalResults && page * 10 < parseInt(data.searchMovies.totalResults)) {
      const nextPage = page + 1
      fetchMore({
        variables: { page: nextPage },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev
          return {
            searchMovies: {
              ...fetchMoreResult.searchMovies,
              Search: [...prev.searchMovies.Search, ...fetchMoreResult.searchMovies.Search],
            },
          }
        },
      })
      setPage(nextPage)
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.suggestions-container')) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  const movies = data?.searchMovies.Search || initialMovies

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Movie Database</h1>
      <Suspense fallback={<div className="h-16 bg-gray-200 animate-pulse rounded-lg mb-8"></div>}>
        <SearchForm
          filters={filters}
          showSuggestions={showSuggestions}
          suggestionData={suggestionData}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onSuggestionSelect={handleSuggestionSelect}
          onDebouncedSearchChange={handleDebouncedSearchChange}
        />
      </Suspense>

      {loading && page === 1 ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-4 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">An error occurred while fetching movies.</div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {movies.map((movie) => (
              <Suspense key={movie.imdbID} fallback={<div className="h-64 bg-gray-200 animate-pulse rounded-lg"></div>}>
                <MovieCard movie={movie} />
              </Suspense>
            ))}
          </div>
          {data && data.searchMovies.totalResults && page * 10 < parseInt(data.searchMovies.totalResults) && (
            <div className="mt-8 text-center">
              <button
                onClick={loadMore}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                disabled={loading}
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </>
      )}
      {movies.length === 0 && filters.title && (
        <div className="text-center text-gray-500 mt-8">No movies found matching your criteria.</div>
      )}
    </div>
  )
}
