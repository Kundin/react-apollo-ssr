import React from 'react';
import loadable from '@loadable/component';

import '@Themes/ThemeDefault';
import './App.css';

const PageIndex = loadable(() => import('@Pages/PageIndex'));

const App = () => {
  return (
    <div>
      <PageIndex />
    </div>
  );
};

export default App;
