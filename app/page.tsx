import { getClient } from '@/lib/apollo-server'
import { gql } from '@apollo/client'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const MovieList = dynamic(() => import('@/components/MovieList'), {
  loading: () => <p>Loading...</p>,
})

const INITIAL_MOVIES = gql`
  query InitialMovies {
    searchMovies(title: "inception", page: 1) {
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

export default async function Home() {
  const { data } = await getClient().query({ query: INITIAL_MOVIES })
  
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MovieList initialMovies={data.searchMovies.Search} />
    </Suspense>
  )
}