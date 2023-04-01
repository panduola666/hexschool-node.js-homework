const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, '用戶暱稱未填寫'],
    },
    email: {
      type: String,
      required: [true, '用戶信箱未填寫'],
    },
    photo: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const users = mongoose.model('users', userSchema);
module.exports = users;
