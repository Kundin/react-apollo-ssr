import React from 'react'
import { Link } from 'react-router-dom'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { Helmet } from 'react-helmet'

const GET_FROMAGES = gql`
  {
    users {
      first_name
    }
  }
`

function PageFromages() {
  const { loading, error, data } = useQuery(GET_FROMAGES)
  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <React.Fragment>
      <Helmet>
        <title>Listing fromages</title>
      </Helmet>
      <div className="box">
        <p className="has-text-centered">
          <span className="tag is-primary">
            <Link to="https://github.com/zyhou/react-apollo-ssr">Github</Link>
          </span>
          {data.users[0].first_name}
        </p>
      </div>

      <section className="container">
        <div className="columns is-multiline"></div>
      </section>
    </React.Fragment>
  )
}

export default PageFromages
