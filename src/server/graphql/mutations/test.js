import { GraphQLString } from 'graphql'

export const test = {
  type: GraphQLString,
  description: 'Тестовая мутация',
  args: {},
  resolve: () => {
    return 'Test is success!'
  },
}
