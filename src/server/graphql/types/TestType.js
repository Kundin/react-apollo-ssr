import { GraphQLObjectType, GraphQLString } from 'graphql';

export default new GraphQLObjectType({
  name: 'Test',
  description: 'Тестовый тип',
  fields: () => ({
    test: {
      type: GraphQLString,
    },
  }),
});
