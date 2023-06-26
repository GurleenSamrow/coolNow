exports.httpResponseApi = (req, res, next) => {
    res.apiRes = (statusCode, success, message, payload = null) => {
      let resObj = { success, message };
      if(payload){
        resObj.payload = payload;
      }
      return res.status(statusCode).json(resObj);
    };
    res.Err = (err) => {
      //// Duplicate Error Messages
      if(err.errors && (err.errors.mobile || err.errors.email)){
        let errMsg  = 'User already exists.';
        if (err.errors.email){
          errMsg  = err.errors.email.message;
        }
        else if(err.errors.mobile){
          errMsg  = err.errors.mobile.message;
        }       
        return res.apiRes(409, false, errMsg);
      }
      //// Duplicate Error Messages        
      return res.status(500).json({success: false, message: err.message});
    };
    res.invalidParam = (errors = null, message = null) => {
      let jsonMsg = {success: false, message: "Invalid parameters were passed."};
      if(errors && errors.length){
        jsonMsg.validationErrors = errors;
      }
      if(message){
        jsonMsg.message = message;
      }
      return res.status(400).json(jsonMsg);
    };
    next();
  };