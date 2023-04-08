/**
 * @param {http 狀態碼} httpCode
 * @param {這邊放要顯示的 err message} errMessage
 */
function handleError(httpCode, errMessage, next) {
  const error = new Error(errMessage);
  error.status = httpCode;
  error.isOperational = true;
  next(error);
}
module.exports = handleError;
