import { UserType } from '../types';

const me = {
  type: UserType,
  description: 'Получить текущего пользователя',
  resolve: async (rootVal, args, { user }) => {
    return user;
  },
};

export default me;
