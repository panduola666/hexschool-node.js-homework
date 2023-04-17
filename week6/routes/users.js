const express = require('express');
const router = express.Router();
const users = require('../models/users');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const handleError = require('../service/handleError');
const handleSuccess = require('../service/handleSuccess');
const handlePromiseError = require('../service/handlePromiseError');
const { isAuth, createJWT } = require('../service/auth');

// 註冊
router.post(
  '/sign_up',
  handlePromiseError(async (req, res, next) => {
    const { name, email, checkPassword } = req.body;
    let { password } = req.body;
    if (!name || !email || !password) handleError(400, '欄位未填寫正確', next);
    if (!validator.isLength(password, { min: 8 }))
      handleError(400, '密碼不得低於 8 字元', next);
    if (password !== checkPassword) handleError(400, '密碼不一致', next);
    if (!validator.isEmail(email)) handleError(400, '信箱格式錯誤', next);

    password = await bcrypt.hash(password, 12);
    const data = await users.create({
      name,
      email,
      password,
    });
    createJWT(data, res);
  })
);
// 登入
router.post(
  '/sign_in',
  handlePromiseError(async (req, res, next) => {
    const { email, password } = req.body;
    if (!email || !password) {
      handleError(400, '帳號密碼不可為空', next);
      return;
    }
    const data = await users.findOne({ email }).select('+password');
    const auth = await bcrypt.compare(password, data.password);
    if (!auth) {
      handleError(400, '密碼錯誤', next);
      return;
    }
    createJWT(data, res);
  })
);

// 重設密碼
router.post(
  '/updatePassword',
  isAuth,
  handlePromiseError(async (req, res, next) => {
    const { checkPassword } = req.body;
    let { password } = req.body;
    const { _id } = req.user;
    if (password !== checkPassword) handleError(400, '兩次密碼不一致', next);
    if (!validator.isLength(password, { min: 8 }))
      handleError(400, '密碼不得低於 8 字元', next);
    password = await bcrypt.hash(password, 12);
    const data = await users.findByIdAndUpdate(_id,{password})
    handleSuccess(res, '修改完成');
  })
);

// 取得個資
router.get(
  '/profile',
  isAuth,
  handlePromiseError(async (req, res) => {
    handleSuccess(res, { user: req.user });
  })
);

// 更新個資
router.patch(
  '/profile',
  isAuth,
  handlePromiseError(async (req, res, next) => {
    const { _id } = req.user;
    const { name, photo, sex } = req.body;
    if (sex !== 'boy' && sex !== 'girl') {
      return handleError(401, 'sex 僅可輸入 boy 或 girl', next);
    }
    await users.findByIdAndUpdate(_id, {
      name,
      photo,
      sex,
    });
    handleSuccess(res, '修改完成');
  })
);

router.delete(
  '/',
  handlePromiseError(async (req, res) => {
    const data = await users.deleteMany({});
    handleSuccess(res, data);
  })
);

module.exports = router;
