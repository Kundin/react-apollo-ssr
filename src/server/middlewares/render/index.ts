import path from 'path';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { StaticRouter } from 'react-router';
import { ApolloProvider } from '@apollo/client';
import { getDataFromTree } from '@apollo/react-ssr';
import { HelmetProvider } from 'react-helmet-async';
import { ChunkExtractor } from '@loadable/server';

import HtmlDocument from './htmlDocument';
import { createApolloClient } from '../../../utils';

const nodeStats = path.resolve(__dirname, '../../../../dist/node/loadable-stats.json');
const webStats = path.resolve(__dirname, '../../../../dist/web/loadable-stats.json');

export default async function render(req, res) {
  const routerContext = { statusCode: 200, url: undefined };
  const helmetContext = { helmet: null };
  const apolloClient = createApolloClient({ uri: process.env.APOLLO_SERVER_URI });

  const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats });
  const { default: App } = nodeExtractor.requireEntrypoint();

  const components = createElement(ApolloProvider, {
    client: apolloClient,
    children: createElement(
      StaticRouter,
      { location: req.url, context: routerContext },
      createElement(HelmetProvider, { context: helmetContext }, createElement(App)),
    ),
  });

  // Redirect
  if (routerContext.url) {
    return res.redirect(routerContext.statusCode, routerContext.url);
  }

  // Send HTML
  const webExtractor = new ChunkExtractor({ statsFile: webStats });
  const jsx = webExtractor.collectChunks(components);

  await getDataFromTree(jsx);

  const apolloState = apolloClient.extract();
  const html = renderToString(jsx);
  const htmlDocument = HtmlDocument({
    html,
    apolloState,
    helmet: helmetContext.helmet,
    webExtractor,
  });

  return res.status(routerContext.statusCode || 200).send(htmlDocument);
}
