// Получить пользователя по JSON Web Token

import JWT from 'jsonwebtoken';

import Config from '../Config';
import { User } from './models';

export default async (token) => {
  let user;

  // Получаем информацию из токена
  try {
    const { userId } = JWT.verify(token, Config.jwt.secret);
    // console.log('USER_ID', user_id)

    // Расшариваем информацию о пользователе
    user = await User.findById(userId).exec();
  } catch (err) {
    // console.log('JWT ERROR', err);
  }

  return user;
};
