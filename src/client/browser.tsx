import { hydrate } from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { loadableReady } from '@loadable/component';
import { ApolloProvider } from '@apollo/client';
import { HelmetProvider } from 'react-helmet-async';

import App from '@App';
import createApolloClient from '../utils/createApolloClient';

loadableReady(() => {
  const apolloClient = createApolloClient({ uri: process.env.APOLLO_SERVER_URI });

  hydrate(
    <ApolloProvider client={apolloClient}>
      <BrowserRouter>
        <HelmetProvider>
          <App />
        </HelmetProvider>
      </BrowserRouter>
    </ApolloProvider>,
    document.getElementById('root'),
  );
});

if (module.hot) {
  module.hot.accept();
}
