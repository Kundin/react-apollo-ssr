import { FC, memo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Switch, Route } from 'react-router-dom';
import loadable from '@loadable/component';

import '@Themes/ThemeDefault';
import './App.css';

const PageIndex = loadable(() => import('@Pages/PageIndex'));

const App: FC = () => {
  return (
    <>
      <Helmet htmlAttributes={{ lang: 'ru' }}>
        <title>React Apollo SSR</title>
        <meta charSet='utf-8' />
        <meta name='description' content='React with Apollo GraphQL and Server Side Rendering' />
        <meta name='viewport' content='width=device-width, initial-scale=1, shrink-to-fit=no' />
        <link rel='icon' href='/static/favicon.ico' />
      </Helmet>

      <Switch>
        <Route exact path='/'>
          <PageIndex />
        </Route>
      </Switch>
    </>
  );
};

export default memo(App);
