import React from 'react'
import gql from 'graphql-tag'
import { useQuery } from '@apollo/react-hooks'
import { Helmet } from 'react-helmet'
import { cn } from '@bem-react/classname'

import './PageFromage.css'

const GET_FROMAGE = gql`
  {
    me {
      first_name
    }
  }
`

const baseClass = cn('PageFromage')

function PageFromage() {
  const { loading, error, data } = useQuery(GET_FROMAGE)

  if (loading) return <p>Loading...</p>
  if (error) return <p>Error :(</p>

  return (
    <div>
      <Helmet>
        <title>Fromage</title>
      </Helmet>
      <div className={baseClass()}>{data.me.first_name}</div>
    </div>
  )
}

export default PageFromage
