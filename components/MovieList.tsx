'use client'

import { gql, useQuery } from '@apollo/client'
import { Loader2, Moon, Sun } from 'lucide-react'
import dynamic from 'next/dynamic'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'

const MovieCard = dynamic(() => import('./MovieCard').then((mod) => mod.MovieCard), {
  loading: () => <div className="h-64 bg-background-light dark:bg-background-dark animate-pulse rounded-lg"></div>,
})

const SearchForm = dynamic(() => import('./SearchForm').then((mod) => mod.default), {
  loading: () => <div className="h-16 bg-background-light dark:bg-background-dark animate-pulse rounded-lg mb-8"></div>,
})

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
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const { ref, inView } = useInView()

  const { data, loading, error, fetchMore } = useQuery<{
    searchMovies: SearchResult
  }>(SEARCH_MOVIES, {
    variables: { title: filters.title, year: filters.year, page },
    skip: !filters.title,
    notifyOnNetworkStatusChange: true,
  })

  const { data: suggestionData, loading: suggestionsLoading } = useQuery<{
    suggestions: string[]
  }>(GET_SUGGESTIONS, {
    variables: { value: debouncedTitle },
    skip: debouncedTitle.length < 2,
  })

  const handleFilterChange = useCallback((field: keyof FilterState, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }))
    if (field === 'title') {
      setShowSuggestions(true)
    }
    setPage(1)
  }, [])

  const handleSearch = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    setShowSuggestions(false)
    setPage(1)
  }, [])

  const handleSuggestionSelect = useCallback((title: string) => {
    setFilters((prev) => ({ ...prev, title }))
    setShowSuggestions(false)
    setPage(1)
  }, [])

  const handleDebouncedSearchChange = useCallback((value: string) => {
    setDebouncedTitle(value)
  }, [])

  const loadMore = useCallback(() => {
    if (data && data.searchMovies.totalResults && page * 10 < parseInt(data.searchMovies.totalResults)) {
      const nextPage = page + 1
      fetchMore({
        variables: { page: nextPage },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult || !fetchMoreResult.searchMovies) return prev

          const prevSearchMovies = prev.searchMovies || { Search: [] }
          const fetchMoreSearchMovies = fetchMoreResult.searchMovies || { Search: [] }

          return {
            searchMovies: {
              ...fetchMoreSearchMovies,
              Search: [...prevSearchMovies.Search, ...fetchMoreSearchMovies.Search],
            },
          }
        },
      })
      setPage(nextPage)
    }
  }, [data, fetchMore, page])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (!(e.target as Element).closest('.suggestions-container')) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [])

  useEffect(() => {
    if (inView) {
      loadMore()
    }
  }, [inView, loadMore])

  const toggleTheme = useCallback(() => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'))
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const movies = useMemo(() => data?.searchMovies.Search || initialMovies, [data, initialMovies])

  return (
    <div
      className={`min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark ${theme === 'dark' ? 'dark' : ''}`}
    >
      <div className="container mx-auto p-4 max-w-4xl transition-colors duration-200 ease-in-out">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Movie Database</h1>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-primary hover:bg-opacity-10 dark:hover:bg-primary-dark dark:hover:bg-opacity-10 transition-colors duration-200 ease-in-out"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-6 w-6 text-accent" /> : <Moon className="h-6 w-6 text-primary" />}
          </button>
        </div>
        <SearchForm
          filters={filters}
          showSuggestions={showSuggestions}
          suggestionData={suggestionData}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onSuggestionSelect={handleSuggestionSelect}
          onDebouncedSearchChange={handleDebouncedSearchChange}
        />

        {loading && page === 1 ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-primary-dark" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 dark:text-red-400">An error occurred while fetching movies.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movies.map((movie) => (
                <MovieCard key={movie.imdbID} movie={movie} />
              ))}
            </div>
            {loading && page > 1 && (
              <div className="flex justify-center items-center h-24">
                <Loader2 className="h-8 w-8 animate-spin text-primary dark:text-primary-dark" />
              </div>
            )}
            <div ref={ref} className="h-10" />
          </>
        )}
        {movies.length === 0 && filters.title && (
          <div className="text-center mt-8">No movies found matching your criteria.</div>
        )}
      </div>
    </div>
  )
}
