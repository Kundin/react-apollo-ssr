import { GraphQLString } from 'graphql';

export default {
  type: GraphQLString,
  description: 'Тестовая мутация',
  args: {},
  resolve: () => {
    return 'Test is success!';
  },
};
