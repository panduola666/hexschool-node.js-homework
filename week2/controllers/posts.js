const handleSuccess = require('../service/handleSuccess');
const handleError = require('../service/handleError');
const Posts = require('../model/posts');

const posts = {
  async getPosts({ req, res }) {
    const allPosts = await Posts.find();
    handleSuccess(res, allPosts);
  },
  async createPosts({ req, res, body }) {
    try {
      const data = JSON.parse(body);
      if (data.content) {
        const newPost = await Posts.create({
          name: data.name,
          content: data.content,
        });
        handleSuccess(res, newPost);
      } else {
        handleError(res);
      }
    } catch (err) {
      handleError(res, err);
    }
  },
  async patchPosts({ req, res, body }) {
    try {
      const id = req.url.split('/').pop();
      const data = JSON.parse(body);
      const allPosts = await Posts.findByIdAndUpdate({ _id: id }, data);
      handleSuccess(res, allPosts);
    } catch (err) {
      handleError(res, err);
    }
  },
  async deleteOnePosts({ req, res }) {
    const id = req.url.split('/').pop();
    const allPosts = await Posts.findByIdAndDelete({ _id: id });
    handleSuccess(res, allPosts);
  },
  async deleteAllPosts({ req, res }) {
    const allPosts = await Posts.deleteMany({});
    handleSuccess(res, allPosts);
  },
};

module.exports = posts;
