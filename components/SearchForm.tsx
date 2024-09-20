import React, { useState, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { motion, AnimatePresence } from 'framer-motion'
import { FilterState } from './MovieList'

type SearchFormProps = {
  filters: FilterState
  showSuggestions: boolean
  suggestionData?: { suggestions: string[] }
  onFilterChange: (field: keyof FilterState, value: string) => void
  onSearch: (e: React.FormEvent) => void
  onSuggestionSelect: (title: string) => void
  onDebouncedSearchChange: (value: string) => void
}

export default function SearchForm({
  filters,
  showSuggestions,
  suggestionData,
  onFilterChange,
  onSearch,
  onSuggestionSelect,
  onDebouncedSearchChange,
}: SearchFormProps) {
  const [localTitle, setLocalTitle] = useState(filters.title)

  useEffect(() => {
    const timer = setTimeout(() => {
      onDebouncedSearchChange(localTitle)
    }, 300)

    return () => clearTimeout(timer)
  }, [localTitle, onDebouncedSearchChange])

  const handleTitleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newTitle = e.target.value
      setLocalTitle(newTitle)
      onFilterChange('title', newTitle)
    },
    [onFilterChange]
  )

  const handleYearChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      onFilterChange('year', e.target.value)
    },
    [onFilterChange]
  )

  const handleClearSearch = useCallback(() => {
    setLocalTitle('')
    onFilterChange('title', '')
  }, [onFilterChange])

  return (
    <form onSubmit={onSearch} className="mb-8 relative">
      <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1 relative">
          <Input
            type="text"
            placeholder="Search by title"
            value={localTitle}
            onChange={handleTitleChange}
            className="w-full pl-10 pr-10"
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" />
          {localTitle && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 transform -translate-y-1/2"
              onClick={handleClearSearch}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
        <Input
          type="number"
          placeholder="Filter by year"
          value={filters.year}
          onChange={handleYearChange}
          className="md:w-32"
        />
        <Button type="submit">Search</Button>
      </div>
      <AnimatePresence>
        {showSuggestions && suggestionData?.suggestions && suggestionData.suggestions.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg max-h-60 overflow-y-auto"
          >
            {suggestionData.suggestions.map((suggestion, index) => (
              <button
                key={index}
                className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:bg-gray-100 dark:focus:bg-gray-700 text-gray-800 dark:text-gray-200"
                onClick={() => onSuggestionSelect(suggestion)}
              >
                {suggestion}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </form>
  )
}
