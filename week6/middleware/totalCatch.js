function errorDev(err, res) {
  res.status(err.status).send({
    status: false,
    message: err.message,
    error: err,
    stack: err.stack,
  });
}
function errPro(err, res) {
  if (err.isOperational) {
    res.status(err.status).send({
      status: false,
      message: err.message,
    });
  } else {
    res.status(500).send({
      status: false,
      message: '系統錯誤,請洽系統管理員',
    });
  }
}

function totalCatch(err, req, res, next) {
  err.status = err.status || 500;
  if (process.env.NODE_ENV === 'dev') {
    errorDev(err, res);
    return;
  }

  if (err.name === 'ValidationError') {
    err.isOperational = true;
    err.message = '資料欄未填寫錯誤,請重新輸入';
    errPro(err, res);
  }
  if (err.name === 'CastError') {
    err.isOperational = true;
    err.message = '找不到該 ID';
    errPro(err, res);
  }
  if(err.message.split(' ').includes('email:')){
    err.isOperational = true;
    err.message = '此信箱已註冊';
    errPro(err, res);
  }
  if(err.message.split(' ').includes('name:')){
    err.isOperational = true;
    err.message = '此用戶名已註冊';
    errPro(err, res);
  }
  errPro(err, res);
}

module.exports = totalCatch;
