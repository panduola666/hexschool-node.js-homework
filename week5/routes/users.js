var express = require('express');
var router = express.Router();
const users = require('../models/users');

const handleError = require('../service/handleError');
const handleSuccess = require('../service/handleSuccess');
const handlePromiseError = require('../service/handlePromiseError')

router.get('/', handlePromiseError(async (req, res) => {
  const data = await users.find({});
  handleSuccess(res, data);
}));

router.post('/', handlePromiseError(async (req, res,next) => {
    const { body } = req;
    const mailRegExp = new RegExp(
      '^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$',
      'g'
    );
    if (!body.name || !body.email) {
      handleError(400, 'name, email 必填',next);
      return;
    }
    if (mailRegExp.test(body.email)) {
      const data = await users.create({
        name: body.name,
        email: body.email,
      });
      handleSuccess(res, data);
    } else {
      handleError(400, '信箱格式錯誤',next);
    }
}));

router.patch('/:id', handlePromiseError(async (req, res,next) => {
    const { id } = req.params;
    const { body } = req;
    if(body.email){
      handleError(400, '信箱不可修改',next);
      return
    }
    await users.findByIdAndUpdate(
      id,
      {
        name: body.name,
        photo: body.photo,
      }
    );
    handleSuccess(res, '修改完成');
}));

router.delete('/', handlePromiseError(async (req, res) => {
  const data = await users.deleteMany({});
  handleSuccess(res, data);
}));


module.exports = router;
