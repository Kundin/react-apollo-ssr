import { UserType } from '../types'

export const me = {
  type: UserType,
  description: 'Получить текущего пользователя',
  resolve: async (rootVal, args, { user }) => {
    return user
  },
}
