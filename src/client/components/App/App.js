import React from 'react'
import { Route, Link, Switch } from 'react-router-dom'
import loadable from '@loadable/component'

const PageFromage = loadable(() =>
  import(
    /* webpackChunkName: "PageFromage" */ '../../pages/PageFromage/PageFromage'
  ),
)
const PageFromages = loadable(() =>
  import(
    /* webpackChunkName: "PageFromages" */ '../../pages/PageFromages/PageFromages'
  ),
)

function App() {
  return (
    <React.Fragment>
      <section>
        <div>
          <div>
            <p>
              <Link to="/">Index</Link>
              <Link to="/test">Test</Link>
            </p>
          </div>
        </div>
      </section>

      <h2>Routes</h2>
      <Switch>
        <Route path="/" exact component={PageFromages} />
        <Route path="/test" component={PageFromage} />
      </Switch>
    </React.Fragment>
  )
}

export default App
