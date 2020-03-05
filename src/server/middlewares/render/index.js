/* eslint-disable no-console */

const path = require('path');
const fetch = require('node-fetch');
const { createElement } = require('react');
const { renderToString } = require('react-dom/server');
const { StaticRouter } = require('react-router');
const { getDataFromTree } = require('@apollo/react-ssr');
const { ApolloProvider } = require('@apollo/react-hooks');
const { ApolloClient } = require('apollo-client');
const { createHttpLink } = require('apollo-link-http');
const { InMemoryCache } = require('apollo-cache-inmemory');
const { Helmet } = require('react-helmet');
const { ChunkExtractor } = require('@loadable/server');
const { ApolloLink } = require('apollo-link');
const { onError } = require('apollo-link-error');

const HtmlDocument = require('./htmlDocument');

const nodeStats = path.resolve(__dirname, '../../../../dist/node/loadable-stats.json');
const webStats = path.resolve(__dirname, '../../../../dist/web/loadable-stats.json');

module.exports = async function render(req, res) {
  const routerContext = {};

  const errorLink = onError(({ graphQLErrors, networkError }) => {
    if (graphQLErrors)
      graphQLErrors.map(({ message, locations, path: errorPath }) =>
        console.log(
          `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${errorPath}`,
        ),
      );

    if (networkError) console.log(`[Network error]: ${networkError}`);
  });

  const httpLink = createHttpLink({
    fetch,
    uri: process.env.APOLLO_SERVER_URI,
    credentials: 'same-origin',
  });

  const client = new ApolloClient({
    ssrMode: true,
    link: ApolloLink.from([errorLink, httpLink]),
    cache: new InMemoryCache(),
  });

  const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats });
  const { default: App } = nodeExtractor.requireEntrypoint();

  const components = createElement(
    ApolloProvider,
    { client },
    createElement(StaticRouter, { location: req.url, context: routerContext }, createElement(App)),
  );

  // Redirect
  if (routerContext.url) {
    return res.redirect(routerContext.statusCode, routerContext.url);
  }

  // Send HTML
  const webExtractor = new ChunkExtractor({ statsFile: webStats });
  const jsx = webExtractor.collectChunks(components);

  await getDataFromTree(jsx);

  const apolloState = client.extract();
  const html = renderToString(jsx);
  const helmet = Helmet.renderStatic();
  const htmlDocument = HtmlDocument({
    html,
    apolloState,
    helmet,
    webExtractor,
  });

  return res.status(routerContext.statusCode || 200).send(htmlDocument);
};
