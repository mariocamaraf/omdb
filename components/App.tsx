'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Search } from 'lucide-react'
import { useState, FormEvent, useEffect } from 'react'
import { ApolloProvider, useQuery, useLazyQuery, gql } from '@apollo/client'
import client from '@/lib/apollo-client'

type Movie = {
  imdbID: string
  Title: string
  Year: string
  Type: string
  Poster: string
}

type SearchResult = {
  Search: Movie[]
  totalResults: string
  Response: string
}

type FilterState = {
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

function MovieList() {
  const [filters, setFilters] = useState<FilterState>({ title: '', year: '' })
  const [showSuggestions, setShowSuggestions] = useState(false)

  const [searchMovies, { data, loading, error }] = useLazyQuery<{ searchMovies: SearchResult }>(SEARCH_MOVIES)

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
    if (filters.title) {
      searchMovies({ variables: { title: filters.title, year: filters.year } })
    }
    setShowSuggestions(false)
  }

  const handleSuggestionSelect = (title: string) => {
    setFilters(prev => ({ ...prev, title }))
    setShowSuggestions(false)
    searchMovies({ variables: { title, year: filters.year } })
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

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Movie Database</h1>
      <form onSubmit={handleSearch} className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative suggestions-container">
          <Input
            type="text"
            placeholder="Search by title"
            value={filters.title}
            onChange={(e) => handleFilterChange('title', e.target.value)}
            className="w-full text-black bg-white border border-gray-300 rounded-md p-2"
          />
          {showSuggestions && suggestionData?.suggestions && suggestionData.suggestions.length > 0 && (
            <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
              {suggestionData.suggestions.map((title) => (
                <div
                  key={title}
                  className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                  onClick={() => handleSuggestionSelect(title)}
                >
                  {title}
                </div>
              ))}
            </div>
          )}
        </div>

        <Input
          type="number"
          id="year"
          name="year"
          placeholder="Filter by year"
          value={filters.year}
          onChange={(e) => handleFilterChange('year', e.target.value)}
            className="w-full text-black bg-white border border-gray-300 rounded-md p-2"
        />

        <Button type="submit" className="w-full">
          <Search className="mr-2 h-4 w-4" />
          Search
        </Button>
      </form>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-4 animate-spin text-blue-500" />
        </div>
      ) : error ? (
        <div className="text-center text-red-500">An error occurred while fetching movies.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.searchMovies.Search?.map((movie) => (
            <div key={movie.imdbID} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              {movie.Poster && movie.Poster !== "N/A" && (
                <img src={movie.Poster} alt={movie.Title} className="w-full h-64 object-cover mb-4 rounded" />
              )}
              <h2 className="text-xl font-semibold mb-2 text-gray-800">{movie.Title}</h2>
              <p className="text-gray-600 mb-1">
                <span className="font-medium">Year:</span> {movie.Year}
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Type:</span> {movie.Type}
              </p>
            </div>
          ))}
        </div>
      )}
      {data?.searchMovies.Search?.length === 0 && filters.title && (
        <div className="text-center text-gray-500 mt-8">No movies found matching your criteria.</div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <ApolloProvider client={client}>
      <MovieList />
    </ApolloProvider>
  )
}