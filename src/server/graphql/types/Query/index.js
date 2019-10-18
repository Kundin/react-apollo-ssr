import { GraphQLObjectType } from 'graphql'

import users from './users'
import user from './user'
import me from './me'

export default new GraphQLObjectType({
	name: 'Query',
	description: 'Доступные запросы',
	fields: () => ({
		users,
		user,
		me,
	}),
})
