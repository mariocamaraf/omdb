'use client'

import { useState, FormEvent, useEffect } from 'react'
import { useQuery, gql } from '@apollo/client'
import { Loader2 } from 'lucide-react'
import SearchForm from './SearchForm'
import MovieCard from './MovieCard'

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

const SEARCH_MOVIES = gql`
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
  const [filters, setFilters] = useState<FilterState>({ title: 'inception', year: '' })
  const [showSuggestions, setShowSuggestions] = useState(false)

  const { data, loading, error } = useQuery<{ searchMovies: SearchResult }>(SEARCH_MOVIES, {
    variables: { title: filters.title, year: filters.year },
    skip: !filters.title
  })

  const { data: suggestionData, loading: suggestionsLoading } = useQuery<{ suggestions: string[] }>(GET_SUGGESTIONS, {
    variables: { value: filters.title },
    skip: filters.title.length < 2
  })

  const handleFilterChange = (field: keyof FilterState, value: string) => {
    setFilters(prev => ({ ...prev, [field]: value }))
    if (field === 'title') {
      setShowSuggestions(true)
    }
  }

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    setShowSuggestions(false)
  }

  const handleSuggestionSelect = (title: string) => {
    setFilters(prev => ({ ...prev, title }))
    setShowSuggestions(false)
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
      <SearchForm
        filters={filters}
        showSuggestions={showSuggestions}
        suggestionData={suggestionData}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onSuggestionSelect={handleSuggestionSelect}
      />

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-4 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">An error occurred while fetching movies.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {movies.map((movie) => (
            <MovieCard key={movie.imdbID} movie={movie} />
          ))}
        </div>
      )}
      {movies.length === 0 && filters.title && (
        <div className="text-center text-gray-500 mt-8">No movies found matching your criteria.</div>
      )}
    </div>
  )
}