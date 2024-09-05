'use client'

import React, { FC, memo, useMemo } from 'react'
import { Movie } from './MovieList'

interface MovieCardProps {
  movie: Movie
}
export const MovieCard: FC<MovieCardProps> = memo(({ movie }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
      {movie.Poster && movie.Poster !== 'N/A' && (
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
  )
})
