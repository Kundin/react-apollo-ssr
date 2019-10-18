// Выход из профиля

async function logout(req, res, next) {
  res.clearCookie('jwt')
  res.json({ ok: true })
}

export default logout
