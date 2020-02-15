// Вход на сайт

import JWT from 'jsonwebtoken';

import { User } from '../models';
import Config from '../../Config';

async function login(req, res) {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email })
      .populate('vk')
      .exec();
    const isCorrectPassword = user ? await user.checkPassword(password) : false;

    // Нет пользователя
    if (!user) {
      return res.json({
        ok: false,
        errors: {
          email: 'Нет пользователя с данным email',
        },
      });
    }

    // Неверный пароль
    if (!isCorrectPassword) {
      return res.json({
        ok: false,
        errors: {
          password: 'Пароль указан неверно',
        },
      });
    }

    const jwt = JWT.sign({ user_id: user.id }, Config.jwt.secret, Config.jwt.options);

    res.cookie('jwt', jwt);
    return res.json({ ok: true, jwt, user });
  } catch (err) {
    // console.log('Ошибка во время авторизации', err);

    return res.json({
      ok: false,
      errors: { password: 'Неизвестная ошибка во время авторизации' },
    });
  }
}

export default login;
