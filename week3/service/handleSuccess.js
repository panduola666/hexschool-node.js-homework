function handleSuccess(res, data) {
  res
    .status(200)
    .send({
      status: 'success',
      data,
    })
    .end();
}
module.exports = handleSuccess;
