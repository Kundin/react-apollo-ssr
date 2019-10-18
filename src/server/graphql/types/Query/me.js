import { UserType } from '../../types'

export default {
  type: UserType,
  description: 'Получить текущего пользователя',
  resolve: async (rootVal, args, { user }) => {
    return user
  },
}
