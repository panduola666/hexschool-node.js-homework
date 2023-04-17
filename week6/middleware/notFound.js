function notFound(req, res, next) {
  res.status(404).send({
    status: false,
    message: '該路由不存在',
  });
}

module.exports = notFound