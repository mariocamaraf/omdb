import { getClient } from '@/lib/apollo-server'
import { gql } from '@apollo/client'
import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const MovieList = dynamic(() => import('@/components/MovieList'), {
  suspense: true,
})

const INITIAL_TRENDING_MOVIES = gql`
  query InitialTrendingMovies {
    trendingMovies(page: 1) {
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
  const { data } = await getClient().query({ query: INITIAL_TRENDING_MOVIES })

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <MovieList initialMovies={data.trendingMovies.Search} />
    </Suspense>
  )
}
