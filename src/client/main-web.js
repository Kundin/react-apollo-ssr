import React from 'react'
import { hydrate } from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import { ApolloClient, ApolloProvider } from '@apollo/client'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { createHttpLink } from 'apollo-link-http'
import { loadableReady } from '@loadable/component'

import { Config } from '@Config'
import { App } from '@App'

const client = new ApolloClient({
  link: createHttpLink({
    uri: Config.apollo.uri,
    credentials: 'same-origin',
  }),
  cache: new InMemoryCache().restore(window.__APOLLO_STATE__),
})

loadableReady(() => {
  hydrate(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root'),
  )
})

if (module.hot) {
  module.hot.accept()
}
