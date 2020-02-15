// Схема пользователя

import { Schema } from 'mongoose';

export default new Schema(
  {
    first_name: {
      type: String,
      required: true,
      trim: true,
    },

    last_name: {
      type: String,
      required: true,
      trim: true,
    },

    sex: {
      type: Number,
      required: true,
      min: 0,
      max: 2,
      default: 0,
    },

    email: {
      type: String,
      trim: true,
    },

    hashPassword: {
      type: String,
    },

    salt: {
      type: String,
    },
  },
  {
    timestamps: true,

    toJSON: {
      virtuals: true,
    },
  },
);
