import { GraphQLObjectType, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'Test2',
  description: 'Тестовый тип',
  fields: () => ({
    test: {
      type: GraphQLString,
    },
  }),
});
