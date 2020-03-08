import React from 'react';
import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import { ApolloProvider } from '@apollo/client';

import App from '@App';
import createApolloClient from '../utils/createApolloClient';

loadableReady(() => {
  const apolloClient = createApolloClient({ uri: process.env.APOLLO_SERVER_URI });

  hydrate(
    <ApolloProvider client={apolloClient}>
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
