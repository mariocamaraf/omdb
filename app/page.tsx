// app/page.tsx
import { getClient } from '@/lib/apollo-server'
import { gql } from '@apollo/client'
import MovieList from '@/components/MovieList'

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
  return <MovieList initialMovies={data.searchMovies.Search} />
}