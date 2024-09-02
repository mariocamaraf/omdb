'use client'

import client from '@/lib/apollo-client'
import { ApolloProvider } from '@apollo/client'
import MovieList from './MovieList'

export default function App() {
  return (
    <ApolloProvider client={client}>
      <MovieList />
    </ApolloProvider>
  )
}