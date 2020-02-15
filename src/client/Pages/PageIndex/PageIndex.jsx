import React from 'react';
import { Helmet } from 'react-helmet';
import { cn } from '@bem-react/classname';

import './PageIndex.css';

const cnPageIndex = cn('PageIndex');

const PageIndex = () => {
  return (
    <>
      <Helmet>
        <title>React Apollo SSR</title>
      </Helmet>

      <div className={cnPageIndex()}>React Apollo SSR</div>
    </>
  );
};

export default PageIndex;
