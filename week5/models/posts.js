const mongoose = require('mongoose');

const postsSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, '貼文內容未填寫'],
    },
    image: {
      type: String,
      default: '',
    },
    createdAt: {
      type: Date,
      default: Date.now,
      select: false,
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'users',
      required: [true, '用戶ID未填寫'],
    },
    likes: {
      type: [
        {
          type: mongoose.Schema.ObjectId,
          ref: 'users',
        },
      ],
      default: [],
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const posts = mongoose.model('posts', postsSchema);
module.exports = posts;
