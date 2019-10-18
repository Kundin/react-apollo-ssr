import { GraphQLInt, GraphQLString, GraphQLList, GraphQLBoolean } from 'graphql'

import { UserType } from '../../types'
import { Users } from '../../../models'

export default {
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
  resolve: async (obj, args, context, info) => {
    try {
      let { id, role, full_name, sex, deactivated } = args,
        query = {},
        limit = 50,
        skip = args.skip || 0

      if (id) query._id = id
      if (sex) query.sex = sex

      return await Users.find(query)
        .skip(skip)
        .limit(limit)
        .exec()
    } catch (err) {
      throw err
    }
  },
}
