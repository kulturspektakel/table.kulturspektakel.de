import '../styles/globals.css';
import React, {useMemo} from 'react';
import {AppProps} from 'next/app';
import {ChakraProvider, extendTheme} from '@chakra-ui/react';
import {
  ApolloProvider,
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  ApolloLink,
  HttpLink,
} from '@apollo/client';
import {withScalars} from 'apollo-link-scalars';
import introspectionResult from '../types/graphql.schema.json';
import {buildClientSchema, IntrospectionQuery} from 'graphql';
import {GraphQLDateTime, GraphQLDate} from 'graphql-scalars';

const App = ({Component, pageProps}: AppProps): React.ReactElement => {
  const client = useMemo(() => initializeApollo(), []);

  const theme = extendTheme({
    styles: {
      global: {
        body: {
          backgroundColor: 'gray.50',
        },
      },
    },
  });

  return (
    <ChakraProvider theme={theme}>
      <ApolloProvider client={client}>
        <Component {...pageProps} />
      </ApolloProvider>
    </ChakraProvider>
  );
};

let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;
function initializeApollo() {
  if (apolloClient) {
    return apolloClient;
  }
  const scalarLink: ApolloLink = withScalars({
    schema: buildClientSchema(
      (introspectionResult as unknown) as IntrospectionQuery,
    ),
    typesMap: {
      DateTime: GraphQLDateTime,
      Date: GraphQLDate,
    },
  }) as any; // eslint-disable-line @typescript-eslint/no-explicit-any

  apolloClient = new ApolloClient({
    ssrMode: typeof window === 'undefined', // set to true for SSR
    cache: new InMemoryCache(),
    link: ApolloLink.from([
      scalarLink,
      new HttpLink({uri: 'https://api.kulturspektakel.de/graphql'}),
    ]),
  });

  return apolloClient;
}

export default App;
