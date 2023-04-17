var express = require('express');
var router = express.Router();
const posts = require('../models/posts');
const users = require('../models/users');

const handleError = require('../service/handleError');
const handleSuccess = require('../service/handleSuccess');
const handlePromiseError = require('../service/handlePromiseError');

router.get(
  '/',
  handlePromiseError(async (req, res, next) => {
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
      handleError(404, '當前沒有任何貼文', next);
    }
  })
);

router.post(
  '/',
  handlePromiseError(async (req, res, next) => {
    const { body } = req;
    if (!body.user || !body.content) {
      handleError(400, 'user, content 必填', next);
      return;
    }
    const user = await users.findById(body.user);
    if (user) {
      const data = await posts.create({
        content: body.content,
        image: body.image,
        user: body.user,
      });
      handleSuccess(res, data);
    } else {
      handleError(404, '查無此用戶 ID', next);
    }
  })
);

router.patch(
  '/:id',
  handlePromiseError(async (req, res, next) => {
    const { id } = req.params;
    const { body } = req;
    if (!body.content) {
      handleError(400, 'content 不得為空', next);
    }
    await posts.findByIdAndUpdate(
      id,
      {
        content: body.content,
        image: body.image,
      }
    );
    handleSuccess(res, '修改完成');
  })
);

router.delete('/:id', handlePromiseError(async (req, res,next) => {
    const { id } = req.params;
    const data = await posts.findByIdAndDelete(id);
    if (data) {
      handleSuccess(res, '已刪除');
    } else {
      handleError(404, '該貼文已刪除',next);
    }
}));
router.delete('/', handlePromiseError(async (req, res) => {
  const data = await posts.deleteMany({});
  handleSuccess(res, data);
}));

module.exports = router;
