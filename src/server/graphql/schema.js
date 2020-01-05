import { GraphQLSchema } from 'graphql'

import { QueryType, MutationType } from './types'

export const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
})
