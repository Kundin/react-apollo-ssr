import fetch from 'cross-fetch';
import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
  NormalizedCacheObject,
} from '@apollo/client';
import { onError } from '@apollo/link-error';

export interface Params {
  uri: string;
}

const isNode = typeof window === 'undefined';

const createApolloClient = ({ uri }: Params): ApolloClient<NormalizedCacheObject> => {
  const httpLink = createHttpLink({
    fetch,
    uri,
    credentials: 'same-origin',
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path: errorPath }) =>
        // eslint-disable-next-line no-console
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${errorPath}`,
        ),
      );

    // eslint-disable-next-line no-console
    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  const cache = new InMemoryCache();

  // eslint-disable-next-line no-underscore-dangle
  if (!isNode) cache.restore(window.__APOLLO_STATE__);

  return new ApolloClient({
    ssrMode: true,
    link: ApolloLink.from([errorLink, httpLink]),
    cache,
  });
};

export default createApolloClient;
