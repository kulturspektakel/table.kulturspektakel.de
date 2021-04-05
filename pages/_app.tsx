import '../styles/globals.css';
import React, {useMemo} from 'react';
import NextApp, {AppContext, AppInitialProps, AppProps} from 'next/app';
import {ApolloProvider, NormalizedCacheObject} from '@apollo/client';
import {ChakraProvider, extendTheme} from '@chakra-ui/react';
import {initializeApollo} from '../utils/apollo';

type Props = {
  initialApolloState: NormalizedCacheObject;
};

const App = ({Component, pageProps, initialApolloState}: AppProps & Props) => {
  const client = useMemo(() => initializeApollo(initialApolloState), [
    initialApolloState,
  ]);

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

App.getInitialProps = async (
  app: AppContext,
): Promise<AppInitialProps & Props> => {
  const apolloClient = initializeApollo();
  const appProps = await NextApp.getInitialProps(app);

  return {
    ...appProps,
    initialApolloState: apolloClient.cache.extract(),
  };
};

export default App;
