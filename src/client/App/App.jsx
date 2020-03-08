import React, { memo } from 'react';
import loadable from '@loadable/component';
import Helmet from 'react-helmet';

import '@Themes/ThemeDefault';
import './App.css';

const PageIndex = loadable(() => import('@Pages/PageIndex'));

const App = () => {
  return (
    <>
      <Helmet htmlAttributes={{ lang: 'ru' }}>
        <title>React Apollo SSR</title>
        <meta charset='utf-8' />
        <meta name='description' content='React with Apollo GraphQL and Server Side Rendering' />
        <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
        <link rel='icon' href='/static/favicon.ico' />
      </Helmet>

      <div>
        <PageIndex />
      </div>
    </>
  );
};

export default memo(App);
