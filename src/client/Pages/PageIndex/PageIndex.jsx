import React, { memo } from 'react';
import { cn } from '@bem-react/classname';

import './PageIndex.css';

const cnPageIndex = cn('PageIndex');

const PageIndex = () => {
  return <div className={cnPageIndex()}>React Apollo SSR</div>;
};

export default memo(PageIndex);
