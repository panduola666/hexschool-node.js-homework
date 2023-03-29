const handleSuccess = require('../service/handleSuccess');
const handleError = require('../service/handleError');
const Post = require('../models/postModel');

const posts = {
  async getPosts( req, res ) {
    const postsData = await Post.find();
    handleSuccess(res, postsData);
  },
  async createPosts(req,res) {
    try {
      const data = req.body;
      if (data.content) {
        const newPost = await Post.create({
          name: data.name,
          content: data.content,
          image: data.image,
          likes: data.likes
        });
        handleSuccess(res, newPost);
      } else {
        handleError(res);
      }
    } catch (err) {
      handleError(res, err);
    }
  },
  async patchPosts(req,res) {
    try {
      const {id} = req.params;
      const data = req.body;
      const allPosts = await Post.findByIdAndUpdate({ _id: id }, data);
      handleSuccess(res, allPosts);
    } catch (err) {
      handleError(res, err);
    }
  },
  async deleteOnePosts(req,res) {
    const {id} = req.params;
    const allPosts = await Post.findByIdAndDelete({ _id: id });
    handleSuccess(res, allPosts);
  },
  async deleteAllPosts(req,res) {
    const allPosts = await Post.deleteMany({});
    handleSuccess(res, allPosts);
  },
};

module.exports = posts;
