// Вход на сайт

import JWT from 'jsonwebtoken'

import { Users } from '../models'
import { Config } from '../../Config'

async function login(req, res) {
  let { email, password } = req.body

  try {
    let user = await Users.findOne({ email })
        .populate('vk')
        .exec(),
      isCorrectPassword = user ? await user.checkPassword(password) : false

    // Нет пользователя
    if (!user) {
      return res.json({
        ok: false,
        errors: {
          email: 'Нет пользователя с данным email',
        },
      })
    }

    // Неверный пароль
    if (!isCorrectPassword) {
      return res.json({
        ok: false,
        errors: {
          password: 'Пароль указан неверно',
        },
      })
    }

    let jwt = JWT.sign({ user_id: user.id }, Config.jwt.secret, Config.jwt.options)

    res.cookie('jwt', jwt)
    res.json({ ok: true, jwt, user })
  } catch (err) {
    console.log('Ошибка во время авторизации', err)

    res.json({
      ok: false,
      errors: { password: 'Неизвестная ошибка во время авторизации' },
    })
  }
}

export default login
