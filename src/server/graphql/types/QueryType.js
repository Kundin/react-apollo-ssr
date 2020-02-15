import { GraphQLObjectType } from 'graphql';

import queries from '../queries';

export default new GraphQLObjectType({
  name: 'Query',
  description: 'Доступные запросы',
  fields: () => queries,
});
