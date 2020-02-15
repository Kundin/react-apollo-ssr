import { GraphQLString } from 'graphql';

const test = {
  type: GraphQLString,
  description: 'Тестовая мутация',
  args: {},
  resolve: () => {
    return 'Test is success!';
  },
};

export default test;
