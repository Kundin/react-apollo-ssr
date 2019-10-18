import { GraphQLObjectType, GraphQLString } from 'graphql'

export default new GraphQLObjectType({
  name: 'Mutation',
  description: 'Доступные мутации',
  fields: {
    test: {
      type: GraphQLString,
      description: 'Тестовая мутация',
      args: {},
      resolve: (rootVal, args, { user }) => {
        return 'Test is success!'
      },
    },
  },
})
