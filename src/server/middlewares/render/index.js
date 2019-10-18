import path from 'path'
import React from 'react'
import fetch from 'node-fetch'
import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import { getDataFromTree } from '@apollo/react-ssr'
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { Helmet } from 'react-helmet'
import { ChunkExtractor } from '@loadable/server'

import config from '../../../config'
import HtmlDocument from './htmlDocument'

const nodeStats = path.resolve(
  __dirname,
  '../../../../public/dist/node/loadable-stats.json',
)

const webStats = path.resolve(
  __dirname,
  '../../../../public/dist/web/loadable-stats.json',
)

async function render(req, res) {
  const context = {}

  const client = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      fetch,
      uri: config.apollo.uri,
      credentials: 'same-origin',
      headers: {
        cookie: req.header('Cookie'),
      },
    }),
    cache: new InMemoryCache(),
  })

  const nodeExtractor = new ChunkExtractor({ statsFile: nodeStats })
  const { default: App } = nodeExtractor.requireEntrypoint()

  const components = (
    <ApolloProvider client={client}>
      <StaticRouter location={req.url} context={context}>
        <App />
      </StaticRouter>
    </ApolloProvider>
  )

  const webExtractor = new ChunkExtractor({ statsFile: webStats })
  const jsx = webExtractor.collectChunks(components)

  await getDataFromTree(jsx)

  const apolloState = client.extract()
  const html = renderToString(jsx)
  const helmet = Helmet.renderStatic()
  const htmlDocument = HtmlDocument({
    html,
    apolloState,
    helmet,
    webExtractor,
  })

  return res.send(htmlDocument)
}

export default render
