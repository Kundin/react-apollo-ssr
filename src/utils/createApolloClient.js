const fetch = require('node-fetch');
const { ApolloClient, ApolloLink, InMemoryCache, createHttpLink } = require('@apollo/client');
const { onError } = require('@apollo/link-error');

const isNode = typeof window === 'undefined';

module.exports = ({ uri }) => {
  const httpLink = createHttpLink({
    fetch,
    uri,
    credentials: 'same-origin',
  });

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path: errorPath }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${errorPath}`,
        ),
      );

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
