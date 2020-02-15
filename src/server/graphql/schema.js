import { GraphQLSchema } from 'graphql';

import QueryType from './types/QueryType';
import { MutationType } from './types';

const schema = new GraphQLSchema({
  query: QueryType,
  mutation: MutationType,
});

export default schema;
