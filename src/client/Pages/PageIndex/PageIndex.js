import React, { Fragment } from 'react'
import { Helmet } from 'react-helmet'
import { cn } from '@bem-react/classname'

import './PageIndex.css'

const cnPageIndex = cn('PageIndex')

export const PageIndex = () => {
  return (
    <Fragment>
      <Helmet>
        <title>React Apollo SSR</title>
      </Helmet>

      <div className={cnPageIndex()}>React Apollo SSR</div>
    </Fragment>
  )
}
