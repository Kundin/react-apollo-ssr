import { GraphQLObjectType, GraphQLSchema } from 'graphql'

import { QueryType } from './types'
import Mutation from './mutation'

export default new GraphQLSchema({
	query: QueryType,
	mutation: Mutation,
})
