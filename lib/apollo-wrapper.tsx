'use client'

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client'
import { useMemo } from 'react'

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  const client = useMemo(
    () =>
      new ApolloClient({
        uri: '/api/graphql',
        cache: new InMemoryCache(),
      }),
    []
  )

  return <ApolloProvider client={client}>{children}</ApolloProvider>
}
