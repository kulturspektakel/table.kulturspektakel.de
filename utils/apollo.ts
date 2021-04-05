import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';
import {withScalars} from 'apollo-link-scalars';
import {ApolloLink, HttpLink} from '@apollo/client/core';
import introspectionResult from '../types/graphql.schema.json';
import {buildClientSchema, IntrospectionQuery} from 'graphql';

function createApolloClient() {
  const DateTime = {
    serialize: (parsed: Date) => parsed.toString(),
    parseValue: (raw: string | number | null): Date | null => {
      return raw ? new Date(raw) : null;
    },
  };

  const scalarLink: ApolloLink = withScalars({
    schema: buildClientSchema(
      (introspectionResult as unknown) as IntrospectionQuery,
    ),
    typesMap: {
      DateTime,
      Date: DateTime,
    },
  }) as any;

  return new ApolloClient({
    ssrMode: typeof window === 'undefined', // set to true for SSR
    cache: new InMemoryCache(),
    link: ApolloLink.from([
      scalarLink,
      new HttpLink({uri: 'https://api.kulturspektakel.de/graphql'}),
    ]),
  });
}
let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

export function initializeApollo(
  initialState: NormalizedCacheObject | null = null,
): ApolloClient<NormalizedCacheObject> {
  const _apolloClient = apolloClient ?? createApolloClient();

  // If your page has Next.js data fetching methods that use Apollo Client,
  // the initial state gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Restore the cache using the data passed from
    // getStaticProps/getServerSideProps combined with the existing cached data
    _apolloClient.cache.restore({...existingCache, ...initialState});
  }

  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') return _apolloClient;

  // Create the Apollo Client once in the client
  if (!apolloClient) apolloClient = _apolloClient;
  return _apolloClient;
}
