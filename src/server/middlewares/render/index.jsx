import path from 'path';
import fetch from 'node-fetch';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { Helmet } from 'react-helmet';
import { ApolloClient, ApolloProvider } from '@apollo/client';
import { getDataFromTree } from '@apollo/react-ssr';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ChunkExtractor } from '@loadable/server';

import Config from '../../../Config';
import HtmlDocument from './htmlDocument';

const nodeStats = path.resolve(__dirname, '../../../../public/dist/node/loadable-stats.json');
const webStats = path.resolve(__dirname, '../../../../public/dist/web/loadable-stats.json');

export default async function render(req, res) {
  const routerContext = {};

  const client = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      fetch,
      uri: Config.apollo.uri,
      credentials: 'same-origin',
      headers: {
        cookie: req.header('Cookie'),
      },
    }),
    cache: new InMemoryCache(),
  });

  const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats });
  const { default: App } = nodeExtractor.requireEntrypoint();

  const components = (
    <ApolloProvider client={client}>
      <StaticRouter location={req.url} context={routerContext}>
        <App />
      </StaticRouter>
    </ApolloProvider>
  );

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

  return res.status(routerContext.status || 200).send(htmlDocument);
}
