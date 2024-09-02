'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search } from 'lucide-react'
import { FormEvent } from 'react'
import { FilterState } from './MovieList'
import SuggestionsList from './SuggestionsList'

interface SearchFormProps {
  filters: FilterState
  showSuggestions: boolean
  suggestionData: { suggestions: string[] } | undefined
  onFilterChange: (field: keyof FilterState, value: string) => void
  onSearch: (e: FormEvent) => void
  onSuggestionSelect: (title: string) => void
}

export default function SearchForm({
  filters,
  showSuggestions,
  suggestionData,
  onFilterChange,
  onSearch,
  onSuggestionSelect
}: SearchFormProps) {
  return (
    <form onSubmit={onSearch} className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="relative suggestions-container">
        <Input
          type="text"
          placeholder="Search by title"
          value={filters.title}
          onChange={(e) => onFilterChange('title', e.target.value)}
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
      />

      <Button type="submit" className="w-full">
        <Search className="mr-2 h-4 w-4" />
        Search
      </Button>
    </form>
  )
}