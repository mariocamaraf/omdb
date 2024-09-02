'use client'

interface SuggestionsListProps {
  showSuggestions: boolean
  suggestions: string[] | undefined
  onSuggestionSelect: (title: string) => void
}

export default function SuggestionsList({
  showSuggestions,
  suggestions,
  onSuggestionSelect
}: SuggestionsListProps) {
  if (!showSuggestions || !suggestions || suggestions.length === 0) {
    return null
  }

  return (
    <div className="absolute z-10 w-full bg-white border border-gray-300 mt-1 rounded-md shadow-lg">
      {suggestions.map((title) => (
        <div
          key={title}
          className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
          onClick={() => onSuggestionSelect(title)}
        >
          {title}
        </div>
      ))}
    </div>
  )
}