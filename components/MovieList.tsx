'use client'

import { gql, useQuery } from '@apollo/client'
import { Loader2, Moon, Sun, Info, X } from 'lucide-react'
import dynamic from 'next/dynamic'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { useInView } from 'react-intersection-observer'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { toast } from 'react-hot-toast'

const MovieCard = dynamic(() => import('./MovieCard').then((mod) => mod.MovieCard), {
  loading: () => <div className="h-64 bg-background animate-pulse rounded-lg"></div>,
})

const SearchForm = dynamic(() => import('./SearchForm').then((mod) => mod.default), {
  loading: () => <div className="h-16 bg-background animate-pulse rounded-lg mb-8"></div>,
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

export const GET_TRENDING_MOVIES = gql`
  query GetTrendingMovies($page: Int) {
    trendingMovies(page: $page) {
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
    title: '',
    year: '',
  })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [debouncedTitle, setDebouncedTitle] = useState('')
  const [page, setPage] = useState(1)
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(true)
  const { ref, inView } = useInView()

  const isSearching = filters.title !== '' || filters.year !== ''

  const {
    data: searchData,
    loading: searchLoading,
    error: searchError,
    fetchMore: searchFetchMore,
  } = useQuery<{
    searchMovies: SearchResult
  }>(SEARCH_MOVIES, {
    variables: { title: filters.title, year: filters.year, page },
    skip: !isSearching,
    notifyOnNetworkStatusChange: true,
  })

  const {
    data: trendingData,
    loading: trendingLoading,
    error: trendingError,
    fetchMore: trendingFetchMore,
  } = useQuery<{
    trendingMovies: SearchResult
  }>(GET_TRENDING_MOVIES, {
    variables: { page },
    skip: isSearching,
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
    toast.success('Search started!', {
      icon: '🔍',
      position: 'bottom-right',
    })
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
    const currentData = isSearching ? searchData?.searchMovies : trendingData?.trendingMovies
    if (currentData && currentData.totalResults && page * 10 < parseInt(currentData.totalResults)) {
      const nextPage = page + 1
      if (isSearching) {
        searchFetchMore({
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
      } else {
        trendingFetchMore({
          variables: { page: nextPage },
          updateQuery: (prev, { fetchMoreResult }) => {
            if (!fetchMoreResult) return prev
            return {
              trendingMovies: {
                ...fetchMoreResult.trendingMovies,
                Search: [...prev.trendingMovies.Search, ...fetchMoreResult.trendingMovies.Search],
              },
            }
          },
        })
      }
      setPage(nextPage)
    }
  }, [isSearching, searchData, trendingData, searchFetchMore, trendingFetchMore, page])

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
    toast.success(`Switched to ${theme === 'light' ? 'dark' : 'light'} mode`, {
      icon: theme === 'light' ? '🌙' : '☀️',
      position: 'bottom-right',
    })
  }, [theme])

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  const movies = useMemo(() => {
    if (isSearching) {
      return searchData?.searchMovies.Search || []
    } else {
      return trendingData?.trendingMovies.Search || initialMovies
    }
  }, [isSearching, searchData, trendingData, initialMovies])

  const loading = isSearching ? searchLoading : trendingLoading
  const error = isSearching ? searchError : trendingError

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 max-w-4xl transition-colors duration-200 ease-in-out">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Movie Database</h1>
          <Button
            onClick={toggleTheme}
            variant="ghost"
            size="icon"
            className="rounded-full hover:bg-primary hover:bg-opacity-10 transition-colors duration-200 ease-in-out"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'dark' ? <Sun className="h-6 w-6 text-accent" /> : <Moon className="h-6 w-6 text-primary" />}
          </Button>
        </div>

        <AnimatePresence>
          {showWelcomeMessage && (
            <motion.div
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              className="bg-primary text-white p-4 rounded-lg mb-6 relative"
            >
              <Button
                onClick={() => setShowWelcomeMessage(false)}
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 text-white hover:bg-primary-dark"
                aria-label="Close welcome message"
              >
                <X className="h-4 w-4" />
              </Button>
              <h2 className="text-xl font-semibold mb-2">Welcome to the Movie Database!</h2>
              <p>Search for your favorite movies using the form below. You can filter by title and year.</p>
            </motion.div>
          )}
        </AnimatePresence>

        <SearchForm
          filters={filters}
          showSuggestions={showSuggestions}
          suggestionData={suggestionData}
          onFilterChange={handleFilterChange}
          onSearch={handleSearch}
          onSuggestionSelect={handleSuggestionSelect}
          onDebouncedSearchChange={handleDebouncedSearchChange}
        />

        <h2 className="text-2xl font-semibold mb-4">{isSearching ? 'Search Results' : 'Trending Movies'}</h2>

        {loading && page === 1 ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-red-500 dark:text-red-400">An error occurred while fetching movies.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {movies.map((movie) => (
                <motion.div
                  key={movie.imdbID}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <MovieCard movie={movie} />
                </motion.div>
              ))}
            </div>
            {loading && page > 1 && (
              <div className="flex justify-center items-center h-24">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            )}
            <div ref={ref} className="h-10" />
          </>
        )}
        {movies.length === 0 && isSearching && (
          <div className="text-center mt-8">No movies found matching your criteria.</div>
        )}
      </div>
      <footer className="bg-primary text-white py-4 mt-8">
        <div className="container mx-auto text-center">
          <p>© 2024 Movie Database. All rights reserved.</p>
          <p className="mt-2">
            <Info className="inline-block mr-1" size={16} />
            This project is for demonstration purposes only.
          </p>
        </div>
      </footer>
    </div>
  )
}
