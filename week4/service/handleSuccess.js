/**
 * @param {這裡放 response} res 
 * @param {這邊放要顯示的資料} data 
 */
function handleSuccess(res,data){
    res.status(200).send({
        status: true,
        data,
      });
}
module.exports = handleSuccess