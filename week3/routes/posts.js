const express = require('express');
const router = express.Router();
const handleSuccess = require('../service/handleSuccess');
const handleError = require('../service/handleError');
const PostsController = require('../controllers/posts');
const Post = require('../models/postModel');
router.get('/', PostsController.getPosts);

router.post('/', PostsController.createPosts);

router.patch('/:id', PostsController.patchPosts);

router.delete('/', PostsController.deleteAllPosts);
router.delete('/:id', PostsController.deleteOnePosts);
module.exports = router;
