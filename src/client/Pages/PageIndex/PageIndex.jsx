import React, { memo } from 'react';

import styles from './PageIndex.css';

const PageIndex = () => {
  return (
    <div className={styles.page}>
      <span className={styles.text}>React Apollo SSR</span>
    </div>
  );
};

export default memo(PageIndex);
