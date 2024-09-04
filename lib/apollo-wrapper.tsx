'use client';

import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';

export function ApolloWrapper({ children }: React.PropsWithChildren) {
  const client = new ApolloClient({
    uri: '/api/graphql',
    cache: new InMemoryCache(),
  });

  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}