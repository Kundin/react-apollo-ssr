import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ApolloClient, ApolloProvider } from '@apollo/client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { createHttpLink } from 'apollo-link-http';
import { loadableReady } from '@loadable/component';

import App from '@App';

const client = new ApolloClient({
  link: createHttpLink({
    uri: process.env.APOLLO_SERVER_URI,
    credentials: 'same-origin',
  }),
  cache: new InMemoryCache().restore(window.APOLLO_STATE),
});

loadableReady(() => {
  hydrate(
    <ApolloProvider client={client}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root'),
  );
});

if (module.hot) {
  module.hot.accept();
}
