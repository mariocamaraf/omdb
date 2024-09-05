'use client'

import { Button } from '@/components/ui/Button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/Command'
import { Input } from '@/components/ui/Input'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

export default function MovieSearch() {
  const [title, setTitle] = useState('')
  const [year, setYear] = useState('')
  const [openTitle, setOpenTitle] = useState(false)
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    const params = new URLSearchParams()
    if (title) params.append('title', title)
    if (year) params.append('year', year)
    router.push(`/?${params.toString()}`)
  }

  return (
    <form onSubmit={handleSearch} className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
      <Popover open={openTitle} onOpenChange={setOpenTitle}>
        <PopoverTrigger asChild>
          <Button variant="outline" role="combobox" aria-expanded={openTitle} className="w-full justify-between">
            {title || 'Search by title'}
            <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search title..." onValueChange={setTitle} />
            <CommandEmpty>No title found.</CommandEmpty>
            <CommandGroup>
              <CommandItem onSelect={() => setOpenTitle(false)}>{title}</CommandItem>
            </CommandGroup>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="flex-1">
        <Input
          type="number"
          placeholder="Filter by year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="w-full"
        />
      </div>

      <Button type="submit" className="w-full">
        Search
      </Button>
    </form>
  )
}
