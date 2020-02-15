import { GraphQLID } from 'graphql';

import { UserType } from '../types';
import { User } from '../../models';

const user = {
  type: UserType,
  description: 'Получить пользователя',
  args: {
    id: {
      name: 'id',
      type: GraphQLID,
    },
  },
  resolve: async (obj, args) => {
    const { id } = args;
    const query = {};

    // eslint-disable-next-line no-underscore-dangle
    if (id) query._id = id;

    const userData = await User.findOne(query)
      .populate('vk')
      .exec();

    return userData;
  },
};

export default user;
