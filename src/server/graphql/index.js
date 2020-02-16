import { GraphQLSchema } from 'graphql';

import MutationType from './types/MutationType';
import QueryType from './types/QueryType';

export default new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});
