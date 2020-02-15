// Модель пользователя

import { model } from 'mongoose';
import crypto from 'crypto';

import UserSchema from './schema';

/* ВИРТУАЛЬНЫЕ ПОЛЯ */

// Полное имя
UserSchema.virtual('full_name').get(function get() {
  return `${this.first_name} ${this.last_name}`;
});

// Это женщина?
UserSchema.virtual('isWoman').get(function get() {
  return this.sex === 1;
});

// Это мужчина?
UserSchema.virtual('isMan').get(function get() {
  return this.sex === 2;
});

// Пароль
UserSchema.virtual('password')
  .set(function set(password) {
    this.plainPassword = password;
    this.salt = `${Math.random()}`;
    this.hashPassword = this.encryptPassword(password);
  })
  .get(function get() {
    return this.plainPassword;
  });

/* МЕТОДЫ ДОКУМЕНТА */

// Зашифровать пароль
UserSchema.methods.encryptPassword = function encryptPassword(password) {
  return crypto
    .createHmac('sha1', this.salt)
    .update(password)
    .digest('hex');
};

// Проверить правильность пароля
UserSchema.methods.checkPassword = function checkPassword(password) {
  return this.encryptPassword(password) === this.hashPassword;
};

/* МЕТОДЫ МОДЕЛИ */

export default model('User', UserSchema);
