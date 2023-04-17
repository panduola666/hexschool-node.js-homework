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
      unique: true,
      select: false
    },
    password:{
      type: String,
      required: [true, '密碼未填寫'],
      minlength: 8,
      select: false
    },
    photo: {
      type: String,
      default: '',
    },
    sex:{
      type: String,
      default: 'boy',
      enum:['boy','girl']
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
