const jwt = require('jsonwebtoken');

const users = require('../models/users');

const handleSuccess = require('./handleSuccess');
const handleError = require('./handleError');
const handlePromiseError = require('./handlePromiseError');

const isAuth = handlePromiseError(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    handleError(401, '尚未登入', next);
    return;
  }
  // 有 token
  const decoded = await new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
      if (err) {
        reject(err);
      } else {
        resolve(payload);
      }
    });
  });
  const currentUser = await users.findById(decoded.id);

  req.user = currentUser;
  next();
});

/**
 * 
 * @param {用戶資訊} user 
 * @param {http狀態碼} statusCode 
 * @param {*} res 
 */
const createJWT = (user, res) => {
    const token = jwt.sign({id:user._id},process.env.JWT_SECRET,{
        expiresIn: process.env.JWT_EXPIRES_DAY
    })
    handleSuccess(res,{
        token,
        name:user.name,
        id:user._id,
        photo: user.photo
    })
};

module.exports = {
    isAuth,
    createJWT
}
