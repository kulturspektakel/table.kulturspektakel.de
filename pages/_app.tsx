import '../styles/globals.css';
import 'antd/dist/antd.css';
import React, {useMemo} from 'react';
import NextApp, {AppContext, AppInitialProps, AppProps} from 'next/app';
import {ViewerQuery} from '../types/graphql';
import {
  ApolloClient,
  ApolloProvider,
  gql,
  HttpLink,
  InMemoryCache,
  NormalizedCacheObject,
} from '@apollo/client';

const Viewer = gql`
  query Viewer {
    viewer {
      profilePicture
      displayName
    }
  }
`;

type Props = {
  initialApolloState: NormalizedCacheObject;
};

const App = ({Component, pageProps, initialApolloState}: AppProps & Props) => {
  const client = useApollo(initialApolloState);

  return (
    <ApolloProvider client={client}>
      <Component {...pageProps} />
    </ApolloProvider>
  );
};

App.getInitialProps = async (
  app: AppContext,
): Promise<AppInitialProps & Props> => {
  const apolloClient = initializeApollo(null, app.ctx.req?.headers.cookie);
  const appProps = await NextApp.getInitialProps(app);

  await apolloClient.query<ViewerQuery>({
    query: Viewer,
    errorPolicy: 'ignore',
  });

  return {
    ...appProps,
    initialApolloState: apolloClient.cache.extract(),
  };
};

export default App;

function createApolloClient(cookie?: string) {
  return new ApolloClient({
    ssrMode: typeof window === 'undefined', // set to true for SSR
    link: new HttpLink({
      uri: 'https://api.kulturspektakel.de/graphql',
      credentials: 'include',
      headers: {
        cookie,
      },
    }),
    cache: new InMemoryCache(),
  });
}
let apolloClient: ApolloClient<NormalizedCacheObject> | null = null;

function initializeApollo(
  initialState: NormalizedCacheObject | null = null,
  cookie?: string,
): ApolloClient<NormalizedCacheObject> {
  const _apolloClient = apolloClient ?? createApolloClient(cookie);

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

function useApollo(initialState: NormalizedCacheObject | null) {
  const store = useMemo(() => initializeApollo(initialState), [initialState]);
  return store;
}
