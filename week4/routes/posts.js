var express = require('express');
var router = express.Router();
const posts = require('../models/posts');
const users = require('../models/users');

const handleError = require('../service/handleError');
const handleSuccess = require('../service/handleSuccess');

router.get('/', async (req, res) => {
  const { q, sort } = req.query;
  const createdAtSort = {
    asc: 'createdAt',
    desc: '-createdAt',
  };

  const data = await posts
    .find({ content: new RegExp(q) })
    .populate({
      path: 'user',
      select: 'name photo',
    })
    .sort(createdAtSort[sort]);
  if (data.length) {
    handleSuccess(res, data);
  } else {
    handleError(res, '查無貼文', 404);
  }
});

router.post('/', async (req, res) => {
  try {
    const { body } = req;
    const user = await users.findById(body.user);
    if (user) {
      const data = await posts.create({
        content: body.content,
        image: body.image,
        user: body.user,
      });
      handleSuccess(res, data);
    } else {
      handleError(res, '查無此用戶ID', 404);
    }
  } catch (err) {
    handleError(res, err.message);
  }
});
router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    if (body.content || body.image) {
      await posts.findByIdAndUpdate(
        { _id: id },
        {
          content: body.content,
          image: body.image,
        }
      );
      handleSuccess(res, '修改完成');
    } else {
      handleError(res, '欄位錯誤');
    }
  } catch (err) {
    handleError(res, err.message);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const data = await posts.findByIdAndDelete(id);
    if (data) {
      handleSuccess(res, '已刪除');
    } else {
      handleError(res, '該貼文已刪除', 404);
    }
  } catch (err) {
    handleError(res, err.message);
  }
});
router.delete('/', async (req, res) => {
  const data = await posts.deleteMany({});
  handleSuccess(res, data);
});

module.exports = router;
