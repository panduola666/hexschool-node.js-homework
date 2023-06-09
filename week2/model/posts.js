const mongoose = require('mongoose');
const postsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '貼文姓名未填寫']
  },
  image: {
    type: String,
    default: ""
  },
  createdAt: {
    type: Date,
    default: Date.now,
    select: false
  },
  content: {
    type: String,
    required: [true, 'Content 未填寫'],
  },
  likes: {
    type: Number,
    default: 0
  },
},
{
    versionKey: false,
    timestamps: true
});

const posts = mongoose.model(
  'posts',
  postsSchema
);

module.exports = posts;