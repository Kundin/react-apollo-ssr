import { GraphQLInt, GraphQLString, GraphQLList } from 'graphql';

import { UserType } from '../types';
import { User } from '../../models';

const users = {
  type: new GraphQLList(UserType),
  description: 'Получить список пользователей',
  args: {
    full_name: {
      name: 'full_name',
      type: GraphQLString,
    },
    sex: {
      name: 'sex',
      type: GraphQLInt,
    },
    skip: {
      name: 'skip',
      type: GraphQLInt,
      description: 'С какой записи начать получение данных',
    },
  },
  resolve: async (obj, args) => {
    const { id, sex } = args;
    const query = {};
    const limit = 50;
    const skip = args.skip || 0;

    // eslint-disable-next-line no-underscore-dangle
    if (id) query._id = id;
    if (sex) query.sex = sex;

    const usersData = await User.find(query)
      .skip(skip)
      .limit(limit)
      .exec();

    return usersData;
  },
};

export default users;
