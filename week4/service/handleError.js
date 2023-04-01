/**
 * @param {這裡放 response} res 
 * @param {這邊放要顯示的 err message} err 
 * @param {http 狀態碼} httpCode 
 */
function handleError(res,err,httpCode = 400){
    res.status(httpCode).send({
        status: false,
        message: err,
      });
}
module.exports = handleError