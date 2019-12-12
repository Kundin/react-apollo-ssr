import React from 'react'
import loadable from '@loadable/component'

import './App.css'

const PageIndex = loadable(() => import('../../Pages/PageIndex'))

export const App = () => {
  return (
    <div>
      <PageIndex />
    </div>
  )
}
