var express = require('express');
var router = express.Router();
const users = require('../models/users');

const handleError = require('../service/handleError');
const handleSuccess = require('../service/handleSuccess');

/* GET users listing. */
router.get('/', async (req, res) => {
  const data = await users.find({});
  handleSuccess(res,data)
});

router.post('/', async (req, res) => {
  try {
    const { body } = req;
    const mailRegExp = new RegExp('^\\w+([-+.]\\w+)*@\\w+([-.]\\w+)*\\.\\w+([-.]\\w+)*$',"g");
    if(!body.name || !body.email){
      handleError(res, 'name, email 必填');
      return
    }
    if(mailRegExp.test(body.email)){
      const data = await users.create({
        name: body.name,
        email: body.email,
      });
      handleSuccess(res,data)
    }else{
      handleError(res,'信箱格式錯誤');
    }
  } catch (err) {
    handleError(res, err.message);
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { body } = req;
    await users.findByIdAndUpdate(
      { _id: id },
      {
        name: body.name,
        photo: body.photo,
      }
    );
    handleSuccess(res,"修改完成")
  } catch (err) {
    handleError(res, err.message);
  }
});

router.delete('/', async (req, res) => {
  const data = await users.deleteMany({});
  handleSuccess(res,data)
});

module.exports = router;
