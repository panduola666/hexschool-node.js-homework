const mongoose = require('mongoose');
const postSchema = new mongoose.Schema(
  /* 加入欄位驗證 */
  {
    content: {
      type: String,
      required: [true,"貼文內容必填"]
    },
    image: {
      type: String,
      default: ""
    },
    createAt:{
      type: Date,
      default: Date.now(),
      select: false
    }
  },
  {
    versionKey: false
  }
);

const Post = mongoose.model('Post', postSchema);

module.exports = Post;