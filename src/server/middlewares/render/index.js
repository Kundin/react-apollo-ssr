const path = require('path');
const { createElement } = require('react');
const { renderToString } = require('react-dom/server');
const { StaticRouter } = require('react-router');
const { ApolloProvider } = require('@apollo/client');
const { getDataFromTree } = require('@apollo/react-ssr');
const { Helmet } = require('react-helmet');
const { ChunkExtractor } = require('@loadable/server');

const HtmlDocument = require('./htmlDocument');
const createApolloClient = require('../../../utils/createApolloClient');

const nodeStats = path.resolve(__dirname, '../../../../dist/node/loadable-stats.json');
const webStats = path.resolve(__dirname, '../../../../dist/web/loadable-stats.json');

module.exports = async function render(req, res) {
  const routerContext = {};
  const apolloClient = createApolloClient({ uri: process.env.APOLLO_SERVER_URI });

  const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats });
  const { default: App } = nodeExtractor.requireEntrypoint();

  const components = createElement(
    ApolloProvider,
    { client: apolloClient },
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

  const apolloState = apolloClient.extract();
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
