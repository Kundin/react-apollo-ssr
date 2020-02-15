import { GraphQLObjectType } from 'graphql';

import mutations from '../mutations';

export default new GraphQLObjectType({
  name: 'Mutation',
  description: 'Доступные мутации',
  fields: () => mutations,
});
