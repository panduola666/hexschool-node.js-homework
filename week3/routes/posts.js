const express = require('express');
const router = express.Router();
const handleSuccess = require('../service/handleSuccess');
const handleError = require('../service/handleError');

const Post = require('../models/postModel');
router.get('/', async (req, res, next) => {
  const postsData = await Post.find();
  handleSuccess(res, postsData);
});

router.post('/', async (req, res, next) => {
  try {
    const data = req.body;
    if (data.content) {
      const newPost = await Post.create({
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
});

router.patch('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    const data = req.body;
    const allPosts = await Post.findByIdAndUpdate({ _id: id }, data);
    handleSuccess(res, allPosts);
  } catch (err) {
    handleError(res, err);
  }
});

router.delete('/', async (req, res, next) => {
  const allPosts = await Post.deleteMany({});
    handleSuccess(res, allPosts);
});
router.delete('/:id', async (req, res, next) => {
  const {id} = req.params;
  const allPosts = await Post.findByIdAndDelete({ _id: id });
  handleSuccess(res, allPosts);
});
module.exports = router;
