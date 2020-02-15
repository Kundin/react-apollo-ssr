import {
  GraphQLInt,
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLBoolean,
} from 'graphql';

export default new GraphQLObjectType({
  name: 'User',
  description: 'Пользователь',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLID),
      description: ' Уникальный идентификатор',
    },

    first_name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Имя',
    },

    last_name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Фамилия',
    },

    full_name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Полное имя',
    },

    sex: {
      type: new GraphQLNonNull(GraphQLInt),
      description: ['Пол\n\n', '0 - не определён\n\n', '1 - мужской\n\n', '2 - женский'].join(),
    },

    email: {
      type: GraphQLString,
      description: 'Адрес электронной почты',
    },

    isWoman: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Это женщина?',
    },

    isMan: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Это мужчина?',
    },

    createdAt: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Дата регистрации',
      resolve: (user) => user.createdAt.toString(),
    },

    updatedAt: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Дата последнего обновления',
      resolve: (user) => user.updatedAt.toString(),
    },
  }),
});
