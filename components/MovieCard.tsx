'use client'

import { Calendar, Film, X } from 'lucide-react'
import { FC, memo, useState } from 'react'
import { Movie } from './MovieList'

interface MovieCardProps {
  movie: Movie
}

export const MovieCard: FC<MovieCardProps> = memo(({ movie }) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => setIsModalOpen(true)
  const closeModal = () => setIsModalOpen(false)

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
        <div className="relative">
          {movie.Poster && movie.Poster !== 'N/A' ? (
            <img src={movie.Poster} alt={movie.Title} className="w-full h-72 object-cover" />
          ) : (
            <div className="w-full h-72 bg-gray-200 flex items-center justify-center">
              <Film size={48} className="text-gray-400" />
            </div>
          )}
          <div className="absolute top-0 left-0 m-2 px-2 py-1 bg-black bg-opacity-50 text-white text-sm rounded">
            {movie.Type}
          </div>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-bold mb-2 text-gray-800 line-clamp-2">{movie.Title}</h2>
          <div className="flex items-center text-gray-600 mb-2">
            <Calendar size={16} className="mr-2" />
            <span>{movie.Year}</span>
          </div>
          <div className="mt-4">
            <button
              onClick={openModal}
              className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition-colors duration-300 ease-in-out"
            >
              View Details
            </button>
          </div>
        </div>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-lg w-full mx-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold text-gray-800">{movie.Title}</h2>
              <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                <X size={24} />
              </button>
            </div>
            <div className="mb-4">
              {movie.Poster && movie.Poster !== 'N/A' ? (
                <img src={movie.Poster} alt={movie.Title} className="w-full h-64 object-cover rounded-lg" />
              ) : (
                <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
                  <Film size={48} className="text-gray-400" />
                </div>
              )}
            </div>
            <div className="space-y-2">
              <p>
                <span className="font-semibold">Year:</span> {movie.Year}
              </p>
              <p>
                <span className="font-semibold">Type:</span> {movie.Type}
              </p>
              <p>
                <span className="font-semibold">IMDb ID:</span> {movie.imdbID}
              </p>
            </div>
            <div className="mt-6">
              <a
                href={`https://www.imdb.com/title/${movie.imdbID}`}
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center bg-yellow-500 text-black py-2 rounded-md hover:bg-yellow-600 transition-colors duration-300 ease-in-out"
              >
                View on IMDb
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  )
})

MovieCard.displayName = 'MovieCard'
