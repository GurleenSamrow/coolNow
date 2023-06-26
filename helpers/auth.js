const jwt       = require('jsonwebtoken');
const userModel = require('../models/userModel');
const secretKey = "~`j+=w^$ECr^(@#!*)sg";
exports.getToken = (user) => {
  // Expiry is set to one week i.e. 604800 SECONDS
  return jwt.sign(user, secretKey, {algorithm: 'HS512', expiresIn: 604800});
};

exports.verifyToken = (req, res, next) => {
  let token = req.headers['authorization'] ? req.headers['authorization'] : null;
  if (!token) {
    return res.apiRes(403, false, 'Authentication token not provided!');
  } 
  
  jwt.verify(token, secretKey, (err, decoded) => {     
    if (err) {            
      if (err.name == 'TokenExpiredError') {
        let decodedToken =  jwt.decode(token);
        let userId       =  decodedToken._id;   
        userModel.findOneAndUpdate({_id: userId,status:'active'}, {$set: {deviceToken: ''}}, {new : true}, (err, user) => {
          if (err) {
            return res.Err(err);
          } else if (!user) {
            return res.apiRes(404, false, 'User not found!', {tokenError: true});
          } else {
            return res.apiRes(403, false, 'Session expired. You need to login again.', { tokenError: true});
          }
        });
      } else {
        return res.apiRes(401, false, err.message, { tokenError: true});
      }
    } 
    else {
      let decodedToken =  jwt.decode(token);
      let userId       =  decoded._id;
      userModel.findOne({_id: userId,status:'active'}, (err, user) => {
        if (err) {
          return res.Err(err);
        } else if (!user) {
          return res.apiRes(404, false, 'User does not exist.', {tokenError: true});
        } else {
          if (userId !== decoded._id) {
            return res.apiRes(403, false, 'Unable to authenticate the user. Please verify your authentication token.', {tokenError: true});
          } 
          else if('' === user.auth){
            return res.apiRes(403, false, 'Session expired. You need to login again.', {tokenError: true});
          }
          else if (user.auth !== decoded.auth) {
            return res.apiRes(403, false, 'User is logged in from another device.', {tokenError: true});
          } 
          else {
            req.decoded = user;
            next();
          }
        }
      }).select('_id  userRole phone auth');
    }
  });
};

exports.generateGUID = () => {
  //return new Buffer(new Date().getTime().toString(), 'base64');
  return new Date().getTime();
};

exports.hasRole = (rolesArray) => {
  return (req, res, next) => {
    if(-1 === rolesArray.indexOf(req.decoded.userRole)){
      return res.apiRes(403, false, 'You are not authorized to access this.');
    }
    next(); 
  };
};