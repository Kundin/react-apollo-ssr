import { GraphQLObjectType } from 'graphql';

import * as queries from '../queries';

export default new GraphQLObjectType({
  name: 'Query',
  description: 'Доступные запросы',
  fields: () => queries,
});
