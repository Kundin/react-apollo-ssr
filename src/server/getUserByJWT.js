// Получить пользователя по JSON Web Token

import JWT from 'jsonwebtoken'

import config from '../Config'
import { Users } from './models'

export default async token => {
  let user

  // Получаем информацию из токена
  try {
    let { user_id } = JWT.verify(token, config.jwt.secret)
    // console.log('USER_ID', user_id)

    // Расшариваем информацию о пользователе
    user = await Users.findById(user_id).exec()
  } catch (err) {
    console.log('JWT ERROR', err)
  }

  return user
}
