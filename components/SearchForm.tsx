'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Search } from 'lucide-react'
import { FormEvent } from 'react'
import { FilterState } from './MovieList'
import SuggestionsList from './SuggestionsList'
import { useDebounce } from '@/hooks/useDebounce'

interface SearchFormProps {
  filters: FilterState
  showSuggestions: boolean
  suggestionData: { suggestions: string[] } | undefined
  onFilterChange: (field: keyof FilterState, value: string) => void
  onSearch: (e: FormEvent) => void
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
  const debouncedSearchTerm = useDebounce(localTitle, 300)

  useEffect(() => {
    onDebouncedSearchChange(debouncedSearchTerm)
  }, [debouncedSearchTerm, onDebouncedSearchChange])

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value
    setLocalTitle(newValue)
    onFilterChange('title', newValue)
  }

  return (
    <form onSubmit={onSearch} className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="relative suggestions-container">
        <Input
          type="text"
          placeholder="Search movies..."
          value={localTitle}
          onChange={handleTitleChange}
          aria-label="Search for movies"
          className="w-full text-black bg-white border border-gray-300 rounded-md p-2"
        />
        <SuggestionsList
          showSuggestions={showSuggestions}
          suggestions={suggestionData?.suggestions}
          onSuggestionSelect={onSuggestionSelect}
        />
      </div>

      <Input
        type="number"
        id="year"
        name="year"
        placeholder="Filter by year"
        value={filters.year}
        onChange={(e) => onFilterChange('year', e.target.value)}
        className="w-full text-black bg-white border border-gray-300 rounded-md p-2"
        aria-label="Filter by year"
      />

      <Button type="submit" className="w-full">
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </form>
  )
}
