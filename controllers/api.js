var mongoose = require('../node_modules/mongoose');
var Config = require('../config/config');
var helper = require('../helper.js');
var moment = require('../node_modules/moment');
var each = require('../node_modules/sync-each');
var CommonHelper = require('../helpers/CommonHelper');
var toAbsolutePath = require('../node_modules/to-absolute-path');
var fs = require('fs');
var path 	 = require('path');
const async = require('async');
const response = require('../services/response')
const services = require('../models/dashboardModel/services');

const twilio = require('twilio');
const accountSid = 'AC4cba3e5ee1ef9d47b9403c8cfc7587a2'; // Your Account SID from www.twilio.com/console
const authToken = '4a53c503583dc9bad84b2314e967a5d9'; // Your Auth Token from www.twilio.com/console
const isdCode = '+91';

var Publishable_Key = 'pk_test_51KCNytSHANuRn5Nt1bcbIEAPkohyilUUOnVMrQrRO1tHmKPbmCR4LAMLC0T0TmB2HjbKLrTlPrHSYxVcZPfsSomU007x06PmbG'
var Secret_Key = 'sk_test_51KCNytSHANuRn5NtJMU88p7xldot4XYa8DW3IpYQBkYT41uKtF0s5PTUNqUWMPJE93Gk8IyQOc5NKr0gcomHnoYx00ii9weCB5'
	
var User = helper.getModel('user');

var timezone = "08:00"  // UTC +8:00 or GMT +8:00;


function getTimezoneName() {
  const today = new Date();
  const short = today.toLocaleDateString(undefined);
  const full = today.toLocaleDateString(undefined, { timeZoneName: 'long' });

  // Trying to remove date from the string in a locale-agnostic way
  const shortIndex = full.indexOf(short);
  if (shortIndex >= 0) {
    const trimmed = full.substring(0, shortIndex) + full.substring(shortIndex + short.length);
    
    // by this time `trimmed` should be the timezone's name with some punctuation -
    // trim it from both sides
    return trimmed.replace(/^[\s,.\-:;]+|[\s,.\-:;]+$/g, '');

  } else {
    // in some magic case when short representation of date is not present in the long one, just return the long one as a fallback, since it should contain the timezone's name
    return full;
  }
}		

function daysInMonth (month, year) {
    return new Date(year, month, 0).getDate();
}

module.exports = {

    usersLogin:  function(req, res, next){ 
	try{	

        if (!req.body) {
            res.json({
                error: true,
                message: 'Form data is missing',
                responseCode: 0
            });
            res.end();
        }
        //console.log("REQUEST=========", req.body);
        var user = req.body.email || "";
        var pass = req.body.password || "";
        var device_token = req.body.device_token || "";
        var device_id = req.body.device_id || "";
        var device_type = req.body.device_type || "A";
        var updated_data = {};
	

        if (!user || !pass) {
            res.json({
                error: true,
                message: "Either your email or password is missing",
                responseCode: 0
            });
            res.end();
            return;
        }

        var _sendError = function(err) {
            if (err) {
                res.json({
                    error: true,
                    message: "Something went wrong, please try again" + err,
                    responseCode: 0
                });
                res.end();
                return;
            }
        }


		pass = helper.password(pass);
		User.findOne({
			email: user.toLowerCase(),
		}, function(err, user) {
			
			if(err){
				_sendError(err);
			}

			if (user) {
				// Wrong Information
				if(user.password != pass ){
					res.json({
						error: true,
						message: "Invalid email or password!",
						responseCode: 0
					});
					res.end();
					return;
				}
				updated_data.device_type = device_type;
				if(device_type == 'A'){
					updated_data.device_id =  device_id;
					if(device_token) updated_data.device_token =  device_token;
				}else{
					updated_data.device_token =  device_token;
				}
				User.findOneAndUpdate({
					_id: user._id
				}, {
					"$set": updated_data
				}, {new: true},function(err,userInfo) {
					if (err) {
						_sendError(err)
					} else {
						// return the information as JSON
						res.json({
							error: false,
							message: 'Login Success',
							userInfo: userInfo,
							responseCode: 1
						});
						res.end();
						return;
					}
				})
			} else {
				res.json({
					error: true,
					message: "Invalid email or password!",
					responseCode: 0
				});
				res.end();
				return;
			}
		})
	}catch(err){
		response.success=false,
		response.message="Internal Server Error",
		response.data =null,
		res.send(500).json(response)
	}
    }, 
   /**
 * @api {post} http://http://18.191.254.193/user_signup Sinup
 * @apiVersion 1.0.0
 * @apiName Signup
 * @apiGroup User
 * @apiParamExample {json} Request-Example:
 * 
 * {
 * 	"phone": "9823456789",
 * 	"user_type": "test@123",
 *  "name":"asdsa" 
    "email":"test@test.com" 
    "password":"2222"
    "device_id":"dsfsdfsd"
  	"device_type":"A" 
    "device_token":"sdfdsfds"
 * }
 * 
 * @apiParamExample {json} Success-Response:
 * 
{
    "success": true,
    "message": "Logged in Successfully",
    "payload": {
        "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTM0OTFiMzdhNTA4MTE5YzFmNmZmYzUiLCJwYXNzd29yZCI6IiQyYSQwOCRjLzF0cXpuVDltOEgwOEgvV3BVcC9PeVdDMGhyQ3ByUDlLTlJqd1hQd2hxS3RsYy5hRXhEVyIsInVwZGF0ZWRBdCI6IjIwMjEtMDktMDVUMDk6NDU6MjMuMjExWiIsImNyZWF0ZWRBdCI6IjIwMjEtMDktMDVUMDk6NDU6MjMuMjExWiIsInBob25lIjoiMTIzNDU2NzgiLCJfX3YiOjAsImF1dGgiOiIiLCJzdGF0dXMiOiJhY3RpdmUiLCJ1c2VyUm9sZSI6ImFwcHVzZXIiLCJkZXZpY2VUb2tlbiI6IiIsImltYWdlIjoiIiwiY29udGFjdCI6W10sImludGVyZXN0cyI6W10sImlhdCI6MTYzMDgzNTI0OSwiZXhwIjoxNjMxNDQwMDQ5fQ.n1yoAlD6pn74f3xQiUc1zTBqG9Eu6y9Q3iINd3f1vjD0cqd_GUD4KtvrtfyZJ5fF7EK_4mQMQQfO_-XeSQFkJA",
        "userInfo": {
            "_id": "613491b37a508119c1f6ffc5",
            "notification": "on",
            "phone": "12345678",
            "deviceToken": "",
            "userRole": "appuser",
            "accountType": "",
            "bio": "",
            "interests": [],
            "image": ""
        }
    }
}
 *
 * @apiSuccess {boolean} success=true Request successfully completed.
 *
 * @apiError {json} UserNotFoundError {message: 'User not found',success: false}
 * @apiError {json} InvalidParamError {message: 'Invalid parameters were passed.',success: false}
 * @apiError {json} AuthenticationTokenNotFound { message: 'Authentication token not provided!' , success: false}
 * @apiError {json} AuthTokenExpiredError { message: 'Session expired. You need to login again.' , success: false, sessionExpired: true}
 */
	usersSignup: async function(req, res, next){ 
	try{
		const data = await User.find({email:req.body.email})
		console.log("data",data);
	if(data.length > 0){
		   return res.json({
			error: true,
			message: 'This user already exists',
			responseCode: 0
		});
	}
		//console.log("REQUEST~~~", req.body);
		if (!req.body) {
            res.json({
                error: true,
                message: 'Form data is missing',
                responseCode: 0
            });
            res.end();
        }
		
        //var User = helper.getModel('user');
        var posted_data = {};
        posted_data.name = req.body.name;
        posted_data.email = req.body.email.toLowerCase();
		posted_data.phone = req.body.phone;
        posted_data.password = helper.password(req.body.password);
		posted_data.user_type = req.body.user_type || "C"; 
		posted_data.gender = "";
		posted_data.track_aircon = {};
		posted_data.profile_photo = "";
        posted_data.device_token = req.body.device_token || "";
        posted_data.device_id = req.body.device_id || "";
        posted_data.device_type = req.body.device_type || "";
        var newUser = new User(posted_data);
        var _loadUserInfo = function(callback) {
            User.findOne({
                phone: posted_data.phone,
				user_type: posted_data.user_type,
				email:posted_data.email
            }, {
                "name": 1,
                "email": 1,
				"phone": 1
            })
            .exec(callback);
        };

        _loadUserInfo(async function(err, result){ 
            if(err){
                 res.json({
					error: true,
					message: "Something went wrong, please try again:"+JSON.stringify(err),
					responseCode: 0
				});
				res.end();
            }
            if(result){
                res.json({
                    error: true,
                    message: 'This user already exists ...',
                    responseCode: 0
                });
                return res.end();
            
		}
            newUser.save(function(errors, dbres) {
                if(errors){
                    res.json({
                        error: true,
                        message: "Something went wrong, please try again: "+errors,
                        responseCode: 0
                    });
                    res.end();
                    return;
                } else {
                    // return the information including token as JSON
                    res.json({
                        error: false,
                        message: 'Signup Success',
                        userInfo: dbres,
                        responseCode: 1
                    });
                    res.end();
                    return;
                }
            })
        })
	}catch(err){
		response.success=false,
		response.message="Internal Server Error",
		response.data =null,
		res.send(500).json(response)
	}
    }, 

/**
 * @api {post} http://http://18.191.254.193/user_sendotp Login
 * @apiVersion 1.0.0
 * @apiName Login
 * @apiGroup User
 * @apiParamExample {json} Request-Example:
 * 
 * {
 * 	"phone": "9823456789",
 * 	"user_type": "test@123",
 * }
 * 
 * @apiParamExample {json} Success-Response:
 * 
{
    "success": true,
    "message": "Logged in Successfully",
    "payload": {
        "token": "eyJhbGciOiJIUzUxMiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MTM0OTFiMzdhNTA4MTE5YzFmNmZmYzUiLCJwYXNzd29yZCI6IiQyYSQwOCRjLzF0cXpuVDltOEgwOEgvV3BVcC9PeVdDMGhyQ3ByUDlLTlJqd1hQd2hxS3RsYy5hRXhEVyIsInVwZGF0ZWRBdCI6IjIwMjEtMDktMDVUMDk6NDU6MjMuMjExWiIsImNyZWF0ZWRBdCI6IjIwMjEtMDktMDVUMDk6NDU6MjMuMjExWiIsInBob25lIjoiMTIzNDU2NzgiLCJfX3YiOjAsImF1dGgiOiIiLCJzdGF0dXMiOiJhY3RpdmUiLCJ1c2VyUm9sZSI6ImFwcHVzZXIiLCJkZXZpY2VUb2tlbiI6IiIsImltYWdlIjoiIiwiY29udGFjdCI6W10sImludGVyZXN0cyI6W10sImlhdCI6MTYzMDgzNTI0OSwiZXhwIjoxNjMxNDQwMDQ5fQ.n1yoAlD6pn74f3xQiUc1zTBqG9Eu6y9Q3iINd3f1vjD0cqd_GUD4KtvrtfyZJ5fF7EK_4mQMQQfO_-XeSQFkJA",
        "userInfo": {
            "_id": "613491b37a508119c1f6ffc5",
            "notification": "on",
            "phone": "12345678",
            "deviceToken": "",
            "userRole": "appuser",
            "accountType": "",
            "bio": "",
            "interests": [],
            "image": ""
        }
    }
}
 *
 * @apiSuccess {boolean} success=true Request successfully completed.
 *
 * @apiError {json} UserNotFoundError {message: 'User not found',success: false}
 * @apiError {json} InvalidParamError {message: 'Invalid parameters were passed.',success: false}
 * @apiError {json} AuthenticationTokenNotFound { message: 'Authentication token not provided!' , success: false}
 * @apiError {json} AuthTokenExpiredError { message: 'Session expired. You need to login again.' , success: false, sessionExpired: true}
 */
	userSendOtp:  function(req, res, next){  //console.log('sendOtp'); 
		try{ 
        console.log(req.body)
        var phone = req.body.phone || ''; 
		var user_type = req.body.user_type || '';
        if(!phone || !user_type) {
            res.json({
                error: true,
                message: "Required parameters missing!",
				responseCode: 0
            });
            res.end();
            return;
        }

        var otp = helper.randomNumericID(4);
        var updateInfo = { otp: otp }
        var conditions = { phone: phone, user_type: user_type };
        User.findOneAndUpdate(conditions, {"$set": updateInfo}, {new: true}, function(err, user){
            if(err || !user){
                res.json({
                    error: true,
                    message: "No account exists for this phone number!",
					responseCode: 0
                });
                res.end();
                return;       
            } else {
				
				var client = new twilio(accountSid, authToken);
				 client.messages.create({
					body: `Please enter following OTP: ${otp} in the app to enter login.`,
					to: "6563297257.", // Text this number
					from: '+658533575' // From a valid Twilio number
				})
				.then((err, message) => {
					if(err){
						console.log('err--', err);
					}
					console.log(message)
					//console.log('message', message);
				}).catch((err)=>{
					console.log(err)
				});
				
				res.json({
					error: false,
					message: "OTP sent to your phone, please check your inbox",
					otp:otp,
					responseCode: 1
				});
				res.end();
				return;
            }
        });
	}catch(err){
		response.success=false,
		response.message="Internal Server Error",
		response.data =null,
		res.send(500).json(response)
	}
    },

/**
 * @api {post} http://http://18.191.254.193/user_otpverification otpverification
 * @apiVersion 1.0.0
 * @apiName otpverification
 * @apiGroup User
 * @apiParamExample {json} Request-Example:
 * 
 * {
 * 	"phone": "9823456789",
 * 	"user_type": "C",
 *  "otp": "12345",
 * }
 * 
 * @apiParamExample {json} Success-Response:
 * 
{
    "success": true,
    "message": "Logged in Successfully",
    "userInfo": {
        
    }
}
 *
 * @apiSuccess {boolean} success=true Request successfully completed.
 *
 * @apiError {json} UserNotFoundError {message: 'User not found',success: false}
 * @apiError {json} InvalidParamError {message: 'Invalid parameters were passed.',success: false}
 * @apiError {json} AuthenticationTokenNotFound { message: 'Authentication token not provided!' , success: false}
 * @apiError {json} AuthTokenExpiredError { message: 'Session expired. You need to login again.' , success: false, sessionExpired: true}
 */
	
	userOtpVerification: function(req, res, next){  //console.log('otpVerification');
	try{	
		var phone = req.body.phone || "";
		var otp = req.body.otp || "";
		var user_type = req.body.user_type || "";
		
		if(!phone || !otp || !user_type) {
            res.json({
                error: true,
                message: "Required parameters missing!",
				responseCode: 0
            });
            res.end();
            return;
        }
		
		User.findOne({
			phone: phone, 
			otp: otp,
			user_type: user_type
		}, function (err, response) {
			if (err) {
				res.json({
                    error: true,
                    message: "Something went wrong while otp verification",
					responseCode: 0
                });
                res.end();
                return; 
			} else {
				if(response){
					res.json({
						error: false,
						message: 'Otp matched successfully!',
						userInfo: response,
						responseCode: 1
					});
					res.end();
					return;
				} else {
					res.json({
						error: true,
						message: "otp doesn't match",
						responseCode: 0
					});
					res.end();
					return;
				}
			}
		});
	}catch(err){
		response.success=false,
		response.message="Internal Server Error",
		response.data =null,
		res.send(500).json(response)
	}
	},
/**
 * @api {post} http://http://18.191.254.193/user_changepassword change password
 * @apiVersion 1.0.0
 * @apiName change password
 * @apiGroup User
 * @apiParamExample {json} Request-Example:
 * 
 * {
 * 	"phone": "9823456789",
 * 	"user_type": "C",
 *  "old_password": "12345",
 * 	"new_password":"dsds"
 * 
 * }
 * 
 * @apiParamExample {json} Success-Response:
 * 
{
    "success": true,
    "message": "Logged in Successfully",
    "userInfo": {
        
    }
}
 *
 * @apiSuccess {boolean} success=true Request successfully completed.
 *
 * @apiError {json} UserNotFoundError {message: 'User not found',success: false}
 * @apiError {json} InvalidParamError {message: 'Invalid parameters were passed.',success: false}
 * @apiError {json} AuthenticationTokenNotFound { message: 'Authentication token not provided!' , success: false}
 * @apiError {json} AuthTokenExpiredError { message: 'Session expired. You need to login again.' , success: false, sessionExpired: true}
 */
	userChangePassword: function(req, res, next){  //console.log('userChangePassword');
    try{
        var phone = req.body.phone || '';
        var old_password = req.body.old_password || '';
        var new_password = req.body.new_password || '';
		var user_type = req.body.user_type || '';

        if(!phone || !old_password || !new_password || !user_type){
            res.json({
                error: true,
                message: "Required parameters missing!",
				responseCode: 0
            });
            res.end();
            return;
        }
		
        var updateInfo = { password: helper.password(new_password) }
        if(req.body.device_token) updateInfo.device_token = req.body.device_token;
		if(req.body.device_id) updateInfo.device_id = req.body.device_id;
        if(req.body.device_type) updateInfo.device_type = req.body.device_type;

        User.findOne({phone: phone, password: helper.password(old_password), user_type:user_type}, null, {sort: {created_at: -1}})
		.exec(function(error, user_info){
			if(error) {
				res.json({
					error: true,
					message: "Something went wrong, Please try again later!",
					responseCode: 0
				})
				res.end();
				return
			}else{
				if(!user_info){
					res.json({
						error: true,
						message: "Your old password is not correct",
						responseCode: 0
					});
					res.end();
					return;
				}

				User.findOneAndUpdate({_id: user_info._id}, {"$set": updateInfo}, {new: true}, function(err, doc){
					if(err){
						res.json({
							error: true,
							message: "Something went wrong while updating password, Please try again later!",
							responseCode: 0
						});
						res.end();
						return;
					}
					// return the information as JSON

					res.json({
						error: false,
						message: 'Password updated successfully!',
						userInfo: doc,
						responseCode: 1
					});
					res.end();
					return;
				})
			}
		})
	}catch(err){
		response.success=false,
		response.message="Internal Server Error",
		response.data =null,
		res.send(500).json(response)
	}
    },
/**
 * @api {post} http://http://18.191.254.193/user_changepassword change password
 * @apiVersion 1.0.0
 * @apiName change password
 * @apiGroup User
 * @apiParamExample {json} Request-Example:
 * 
 * {
 * 	"phone": "9823456789",
 * 	"user_type": "C",
 *  "old_password": "12345",
 * 	"new_password":"dsds"
 * 
 * }
 * 
 * @apiParamExample {json} Success-Response:
 * 
{
    "success": true,
    "message": "Logged in Successfully",
    "userInfo": {
        
    }
}
 *
 * @apiSuccess {boolean} success=true Request successfully completed.
 *
 * @apiError {json} UserNotFoundError {message: 'User not found',success: false}
 * @apiError {json} InvalidParamError {message: 'Invalid parameters were passed.',success: false}
 * @apiError {json} AuthenticationTokenNotFound { message: 'Authentication token not provided!' , success: false}
 * @apiError {json} AuthTokenExpiredError { message: 'Session expired. You need to login again.' , success: false, sessionExpired: true}
 */	
	userForgotPassword: function(req, res, next){  //console.log('userForgotPassword');
try{
        var phone = req.body.phone || '';
        var new_password = req.body.new_password || '';
		var user_type = req.body.user_type || '';

        if(!phone || !new_password || !user_type){
            res.json({
                error: true,
                message: "Required parameters missing!",
				responseCode: 0
            });
            res.end();
            return;
        }
        var updateInfo = { password: helper.password(new_password) }
        if(req.body.device_token) updateInfo.device_token = req.body.device_token;
		if(req.body.device_id) updateInfo.device_id = req.body.device_id;
        if(req.body.device_type) updateInfo.device_type = req.body.device_type;

        User.findOne({phone: phone, user_type:user_type}, null, {sort: {created_at: -1}})
		.exec(function(error, user_info){
			if(error) {
				res.json({
					error: true,
					message: "Something went wrong, Please try again later!",
					responseCode: 0
				})
				res.end();
				return
			}else{
				if(!user_info){
					res.json({
						error: true,
						message: "Your old password is not correct",
						responseCode: 0
					});
					res.end();
					return;
				}

				User.findOneAndUpdate({_id: user_info._id}, {"$set": updateInfo}, {new: true}, function(err, doc){
					if(err){
						res.json({
							error: true,
							message: "Something went wrong while updating password, Please try again later!",
							responseCode: 0
						});
						res.end();
						return;
					}
					// return the information as JSON

					res.json({
						error: false,
						message: 'Password updated successfully!',
						userInfo: doc,
						responseCode: 1
					});
					res.end();
					return;
				})
			}
		})
	}catch(err){
		response.success=false,
		response.message="Internal Server Error",
		response.data =null,
		res.send(500).json(response)
	}
    },
	
	test: function(req, res, next){ console.log('test'); 
	
	var socialSpaceInterest = helper.getModel('socialSpaceInterestModel');
	var socailSpaceNotification = helper.getModel('socialSpaceNotificationModel');
	
	
	var socailSpaceInterest = helper.getModel('socialSpaceInterestModel');
	var socailSpaceNotification = helper.getModel('socialSpaceNotificationModel');
	const  query     =  {status: 'active'};
	var user = [];
	socailSpaceNotification.find(query, function (err, notifications) {
		//console.log(notifications);
		if(err){
			return res.Err(err);
		}
		if (notifications) {
				var i = 0; 
				each(notifications, function (notification, nextNoti) {
					var noti = JSON.parse(JSON.stringify(notification));
					noti.social_space_interest = "";
					socailSpaceInterest.findOne({
						user_id: mongoose.Types.ObjectId("61b728b5a59b89d177daad48"),
						socailSpace_id: notification._id
					}, function (err, response) {
						if(err){
							return res.Err(err);
						}
						if(response){
							noti.social_space_interest = response.interest;
						} 
						user.push(noti);
						if (++i >= notifications.length) {
							return res.apiRes(200, true, 'SocialSpace updated successfully.', {user});
						} else {
							nextNoti();
						}
					});
				});  
		} else {
			 return res.apiRes(409, false, 'SocialSpace not found.');
		}
	});
	
	
	},
	
	userScheduleAppointment: function (req, res, next) { //console.log("userScheduleAppointment");
		//console.log(req.body);
		//console.log(req.files);

        var userId = mongoose.Types.ObjectId(req.body.user_id) || "";
		var userName = (req.body.user_name) ? req.body.user_name : "";
		var technicianId = mongoose.Types.ObjectId(req.body.technician_id) || "";
		var technicianName = (req.body.technician_name) ? req.body.technician_name : "";
		var selectedService = ((req.body.selected_service).length > 0) ? req.body.selected_service : 0;
		var date = (req.body.date) ? req.body.date : "";
		var timeSlots = ((req.body.time_slots).length > 0) ? req.body.time_slots : 0;
		var location = (req.body.location) ? req.body.location : "";
		var latitude = (req.body.latitude) ? req.body.latitude : "";
		var longitude = (req.body.longitude) ? req.body.longitude : "";
		var promoCode = (req.body.promo_code) ? req.body.promo_code : "";
		var discountType = (req.body.discount_type) ? parseInt(req.body.discount_type) : "";
		var promoDiscount = (req.body.promo_discount) ? parseInt(req.body.promo_discount) : 0;
		var tip = (req.body.tip) ? parseInt(req.body.tip) : 0;
		var totalItemPrice = (req.body.total_item_price) ? parseInt(req.body.total_item_price) : 0;
		var serviceCharge = (req.body.service_charge) ? parseInt(req.body.service_charge) : 0;
		var tax = (req.body.tax) ? parseInt(req.body.tax) : 0;
        var grandTotal = (req.body.grand_total) ? parseInt(req.body.grand_total) : 0;
		
		if(!userId || !userName || !technicianId || !technicianName || (selectedService == 0) || !date || (timeSlots == 0) || !location || !latitude || !longitude){
            res.json({
                error: true,
                message: "Required parameters missing!"
            });
            res.end();
            return;
        }
		
		var pItems = [];
		var bookingTotal = 0; 
		var bTAfterDiscount = 0;
		var totalDiscount = 0;
		var tPAmount = 0;
		var timeTotal = 0; 
		var timezoneCreatedAt = "";
		var i = 0;
		timeSlots.forEach(function (slot, index) {
			
			var startTimeString = date+" "+slot.start_time_slot+":00";
			var startTimeFormat = moment(startTimeString).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
			var endTimeString = date+" "+slot.end_time_slot+":00";
			var endTimeFormat = moment(endTimeString).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
			
			var pData = {};
			pData.item_uniq_id = helper.getUniqueItemId();
			pData.service_id = mongoose.Types.ObjectId(selectedService[index].service_id);
			pData.service_name = selectedService[index].service_name;
			pData.service_duration = selectedService[index].duration;
			pData.service_amount = selectedService[index].amount;
			pData.booking_units = selectedService[index].units;
			pData.total_booking_amount = (selectedService[index].amount*selectedService[index].units);
			pData.time_slot = new Date(startTimeFormat);
			pData.end_time_slot = new Date(endTimeFormat);
			pData.start_time = slot.start_time_slot;
			pData.end_time = slot.end_time_slot;
			pData.image = selectedService[index].image;
			pData.video = selectedService[index].video;
			pData.comment = selectedService[index].comment;
			pData.service_confirmation = true;
			
			bookingTotal += (pData.service_amount*pData.booking_units);
			timeTotal += parseInt(selectedService[index].duration);
			pItems.push(pData);
			
			if (++i >= timeSlots.length) {
				
				if(discountType == 'percentage'){
					totalDiscount = (bookingTotal*promoDiscount/100);
				} else {
					totalDiscount = promoDiscount;
				}
				
				bTAfterDiscount = (bookingTotal-totalDiscount);
				tPAmount = (bTAfterDiscount+tip+tax+serviceCharge)
				
				timezoneCreatedAt = moment().utcOffset(CommonHelper.getSettlementTZMins(timezone)).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
				
				var posted_booking = {
					"user_id": userId,
					"user_name": userName,
					"technician_id": technicianId,
					"technician_name": technicianName,
					"user_latitude": latitude,
					"user_longitude": longitude,
					"booking_total": bookingTotal,
					"promo_code": promoCode,
					"discount": promoDiscount,
					"discount_type":discountType,
					"discount_amount":totalDiscount,
					"booking_total_after_discount": bTAfterDiscount,
					"delivery_location": location,
					"tip_amount": tip,
					"tax": tax,
					"service_charge": serviceCharge,
					"total_payable_amount": tPAmount,
					"total_time_duration": timeTotal,
					"amount_paid": {
						"total_paid" : tPAmount,
						"cash" : tPAmount,
						"online" : 0
					},
					"payment_status" : "completed",
					"payment_mode" : "cash",
					"booking_status" : "pending",
					"timezone_created_at": new Date(timezoneCreatedAt),
					"items": pItems
				};
				
				//add new Booking
				var Booking = helper.getModel("booking");
				var newBooking = new Booking(posted_booking);
				newBooking.save(function (err, dbres) {
					if (err) {
						res.json({
							error: true,
							message: "Something went wrong to save data in booking.",
							mongoose_error: JSON.stringify(err),
							responseCode: 0
						});
						res.end();
						return;
					} else {
						//console.log("dbres._id-", dbres._id);
						if (dbres && dbres._id) {
							
							res.json({
								error: false,
								message: 'Booking Success',
								results: dbres,
								responseCode: 1
							});
							res.end();
							return;
						} else {
							res.json({
								error: true,
								message: "Something went wrong to save data in booking.",
								mongoose_error: JSON.stringify(err),
								responseCode: 0
							});
							res.end();
							return;
						}
					}
				})
			}
		})
    },
/**
 * @api {post} http://http://18.191.254.193/user_datewisebookingdetails user_datewisebookingdetails
 * @apiVersion 1.0.0
 * @apiName datewisebookingdetails
 * @apiGroup Booking
 * @apiParamExample {json} Request-Example:
 * 
 * {
 * 	"Date": "05-04-2023",
 * }
 * 
 * @apiParamExample {json} Success-Response:
 * 
{
    "success": true,
    "message": "Logged in Successfully",
    "userInfo": {
        
    }
}
 *
 * @apiSuccess {boolean} success=true Request successfully completed.
 *
 * @apiError {json} UserNotFoundError {message: 'User not found',success: false}
 * @apiError {json} InvalidParamError {message: 'Invalid parameters were passed.',success: false}
 * @apiError {json} AuthenticationTokenNotFound { message: 'Authentication token not provided!' , success: false}
 * @apiError {json} AuthTokenExpiredError { message: 'Session expired. You need to login again.' , success: false, sessionExpired: true}
 */
	userDatewiseAvailableSlots: function (req, res, next) { //console.log("userDatewiseAvailableSlots");
		//console.log(req.body);
		var date = (req.body.date) ? req.body.date : "";
		
		if(!date){
            res.json({
                error: true,
                message: "Required parameters missing!"
            });
            res.end();
            return;
        }
		
		var start_date = moment(date).format('YYYY-MM-DD');
		var end_date = moment(date).add(+1, 'days').format('YYYY-MM-DD');
		
		var Booking = helper.getModel("booking");
		Booking.aggregate([
			{$unwind: "$items"},
			{$match: {
				"items.time_slot": {
					'$gte': new Date(start_date),
					'$lt': new Date(end_date)
				}
			}},
			{$group: {
                _id: "$_id", user_id: {$first: '$user_id'}, user_name: {$first: '$user_name'}, 
                items: {$addToSet: "$items"}
			}},
			{$sort: {
				_id: 1
			}}
		])
		.exec(function (oErr, o_results) {
			if (oErr) {
				res.json({
					error: true,
					message: "Something went wrong to save data in booking.",
					mongoose_error: JSON.stringify(err),
					responseCode: 0
				});
				res.end();
				return;
			} else {
				var slotArr = [];
				var i = 0;
				o_results.forEach(function (results, index) {
					var j = 0;
					results.items.forEach(function (item, index2) {
						slotArr.push(item.start_time+"-"+item.end_time)
						if (++j >= results.items.length) {
							if (++i >= o_results.length) {
								res.json({
									error: false,
									message: "success",
									booked_slots:slotArr,
									responseCode: 1
								});
								res.end();
								return;
							}
						}
					});		
				})	
			}
		})
    },
	
	userMonthAvailableSlotsDays: function (req, res, next) { //console.log("userMonthAvailableSlotsDays");
		//console.log(req.body);
		var month = (req.body.month) ? req.body.month : "";
		var year = (req.body.year) ? req.body.year : "";
		var selectedServicesLength = ((req.body.selected_service).length > 0) ? (req.body.selected_service).length : 0;
		
		if(!month || !year){
            res.json({
                error: true,
                message: "Required parameters missing!"
            });
            res.end();
            return;
        }
		
		var monthDays = daysInMonth(month,year); 
			
		var total_slots = 4;
		var availableSlotsDate = [];
		var days = [];
		
		for(let d = 1;d<=monthDays; d++){
			days.push(d);
		}	
		
		
    },
	
	userCheckPromoCode: function(req, res, next){  //console.log('userCheckPromoCode');
		
		var promocode = req.body.promocode || "";
		
		if(!promocode) {
            res.json({
                error: true,
                message: "Required parameters missing!",
				responseCode: 0
            });
            res.end();
            return;
        }
		
		var currentDate = moment().utcOffset(CommonHelper.getSettlementTZMins(timezone)).format('YYYY-MM-DD');
		//console.log(currentDate);
		
		var Promocode = helper.getModel("promocode");
		Promocode.findOne({
			code_name: promocode,
			active: true,
			$and: [
				{"valid_start_date": {'$lte': new Date(currentDate)}},
				{"valid_end_date": {'$gte': new Date(currentDate)}}
			]
		}, {discount_amount: 1, discount_type:1, code_name:1, active:1}, function (err, response) {
			if (err) {
				res.json({
                    error: true,
                    message: "Something went wrong while check promocode",
					responseCode: 0
                });
                res.end();
                return; 
			} else {
				if(response){
					res.json({
						error: false,
						message: 'promocode match successfully!',
						userInfo: response,
						responseCode: 1
					});
					res.end();
					return;
				} else {
					res.json({
						error: true,
						message: "Invalid promocode",
						responseCode: 0
					});
					res.end();
					return;
				}
			}
		});
	},
	
	technicianLogin: function(req, res, next){ 
		try{
        if (!req.body) {
            res.json({
                error: true,
                message: 'Form data is missing',
                responseCode: 0
            });
            res.end(); 
        }
        //console.log("REQUEST=========", req.body);
        var phone = req.body.phone || "";
        var pass = req.body.password || "";
		var user_type = req.body.user_type || "T";
        var device_token = req.body.device_token || "";
        var device_id = req.body.device_id || "";
        var device_type = req.body.device_type || "A";
        var updated_data = {};

        if (!phone || !pass) {
            res.json({
                error: true,
                message: "Either your phone or password is missing",
                responseCode: 0
            });
            res.end();
            return;
        }

        var _sendError = function(err) {
            if (err) {
                res.json({
                    error: true,
                    message: "Something went wrong, please try again" + err,
                    responseCode: 0
                });
                res.end();
                return;
            }
        }


		pass = helper.password(pass);
		User.findOne({
			phone: phone,
			user_type: user_type
		}, function(err, user) {
			if(err){
				_sendError(err);
			}

			if (user) {
				// Wrong Information
				if(user.password != pass ){
					res.json({
						error: true,
						message: "Invalid phone or password!",
						responseCode: 0
					});
					res.end();
					return;
				}
				updated_data.device_type = device_type;
				if(device_type == 'A'){
					updated_data.device_id =  device_id;
					if(device_token) updated_data.device_token =  device_token;
				}else{
					updated_data.device_token =  device_token;
				}
				User.findOneAndUpdate({
					_id: user._id
				}, {
					"$set": updated_data
				}, {new: true},function(err,userInfo) {
					if (err) {
						_sendError(err)
					} else {
						// return the information as JSON
						res.json({
							error: false,
							message: 'Login Success',
							userInfo: userInfo,
							responseCode: 1
						});
						res.end();
						return;
					}
				})
			} else {
				res.json({
					error: true,
					message: "Invalid phone or password!",
					responseCode: 0
				});
				res.end();
				return;
			}
		})
	}
		catch(err){
			response.success=false,
			response.message="Internal Server Error",
			response.data =null,
			res.send(500).json(response)
		}
    },
	
	logOut: function(req, res, next){
        
        var userID = req.body.user_id || "";
        var updated_data = {}
        updated_data.device_type = req.body.device_type;
        updated_data.device_id = "";
        updated_data.device_token = "";
        User.findOneAndUpdate({
                _id: userID
            }, {
                "$set": updated_data
            }, {new: true},function(err,userInfo) {
            if (err) {
                res.json({
                    error: true,
                    responseCode: 0,
                    message: "something went wrong, please try again"+err
                });
                res.end();
            } else {
                res.json({
                    error: false,
                    message: 'Logged out successfully',
                    userInfo: userInfo,
                    responseCode: 1
                });
                res.end();
                return;
            }
        })
    },
	
	userAddressList: function (req, res, next) { //console.log("userAddressList");
		try{
		//console.log(req.params)
        var userId = mongoose.Types.ObjectId(req.params.id);
		if (!userId) {
            res.json({
                error: true,
                message: 'Required parameter is missing',
                responseCode: 0
            });
            res.end();
        }
		
        var Address = helper.getModel("address");  
        Address.find({user_id: mongoose.Types.ObjectId(userId), is_deleted: {'$ne': true}}).sort({_id: 1}).exec(function (err, results) {
            if (err) {
				res.json({
					error: true,
					message: "Something went wrong to fetch address.",
					mongoose_error: JSON.stringify(err),
					responseCode: 0
				});
				res.end();
				return;
            } else {
                res.json({
                    error: false,
                    message: "Success",
                    mongoose_error: "",
                    responseCode: 1,
                    userInfo: results
                });
                res.end();
                return;
            }
        })
	}catch(err){
		response.success=false,
		response.message="Internal Server Error",
		response.data =null,
		res.send(500).json(response)
	}
    },
/**
 * @api {post} http://http://18.191.254.193/user_save_address user_save_address
 * @apiVersion 1.0.0
 * @apiName user address save
 * @apiGroup User
 * @apiParamExample {json} Request-Example:
 * 
 * {
 * 	"user_id": "",
 *  "phone": "",
 *  "address": "",
 *  "addressType": "",
 *  "lat": "",
 *  "lng": "",
 *  "city": "",
 *  "pincode": "",
 * }
 * 
 * @apiParamExample {json} Success-Response:
 * 
{
    "success": true,
    "message": "Logged in Successfully",
    "userInfo": {
        
    }
}
 *
 * @apiSuccess {boolean} success=true Request successfully completed.
 *
 * @apiError {json} UserNotFoundError {message: 'User not found',success: false}
 * @apiError {json} InvalidParamError {message: 'Invalid parameters were passed.',success: false}
 * @apiError {json} AuthenticationTokenNotFound { message: 'Authentication token not provided!' , success: false}
 * @apiError {json} AuthTokenExpiredError { message: 'Session expired. You need to login again.' , success: false, sessionExpired: true}
 */
	userSaveAddress: function(req, res, next){ //console.log('userSaveAddress'); 
		try{
			//console.log("REQUEST~~~", req.body);
        if (!req.body) {
            res.json({
                error: true,
                message: 'Form data is missing',
                responseCode: 0
            });
            res.end();
        }
		
        //var User = helper.getModel('user');
        var posted_data = {};
        posted_data.user_id = mongoose.Types.ObjectId(req.body.user_id) || "";
        posted_data.name = req.body.name || "";
		posted_data.location = req.body.location || "";
		posted_data.phone = req.body.phone || "";
        posted_data.address = req.body.address || "";
		posted_data.addressType = req.body.addressType || ""; 
		posted_data.city = req.body.city || ""; 
		posted_data.lat = req.body.lat || "";
		posted_data.lng = req.body.lng || "";
		posted_data.floor = req.body.floor || ""; 
        posted_data.pincode = req.body.pincode || "";
        posted_data.user_type = req.body.user_type || "C";
		if (!posted_data.user_id || !posted_data.address) {
            res.json({
                error: true,
                message: "Required parameter is missing",
                responseCode: 0
            });
            res.end();
            return;
        }
		
		var Address = helper.getModel('address');
        var newAddress = new Address(posted_data);
		
		newAddress.save(function(errors, dbres) {
			//console.log("errors", errors)
			if(errors){
				res.json({
					error: true,
					message: "Something went wrong, please try again: "+errors,
					responseCode: 0
				});
				res.end();
				return;
			} else {
				// return the information including token as JSON
				res.json({
					error: false,
					message: 'Address saved success',
					userInfo: dbres,
					responseCode: 1
				});
				res.end();
				return;
			}
		})
	}catch(err){
		response.success=false,
		response.message="Internal Server Error",
		response.data =null,
		res.send(500).json(response)
	}
    },
/**
 * @api {get} http://http://18.191.254.193/user_personaldetails/user_id user_personaldetails
 * @apiVersion 1.0.0
 * @apiName user personaldetails
 * @apiGroup User
 * @apiParamExample {json} Success-Response:
 * 
{
    "success": true,
    "message": "Logged in Successfully",
    "userInfo": {
        
    }
}
 *
 * @apiSuccess {boolean} success=true Request successfully completed.
 *
 * @apiError {json} UserNotFoundError {message: 'User not found',success: false}
 * @apiError {json} InvalidParamError {message: 'Invalid parameters were passed.',success: false}
 * @apiError {json} AuthenticationTokenNotFound { message: 'Authentication token not provided!' , success: false}
 * @apiError {json} AuthTokenExpiredError { message: 'Session expired. You need to login again.' , success: false, sessionExpired: true}
 */	
	userPersonalDetails: function (req, res, next) { //console.log("userPersonalDetails");
		try{//console.log(req.params)
        var userId = mongoose.Types.ObjectId(req.params.id);
		if (!userId) {
            res.json({
                error: true,
                message: 'Required parameter is missing',
                responseCode: 0
            });
            res.end();
        }
		
        var User = helper.getModel("user");  
        User.findOne({_id: userId, is_deleted: {'$ne': true}}).sort({_id: 1}).exec(function (err, results) {
            if (err) {
				res.json({
					error: true,
					message: "Something went wrong to fetch user details.",
					mongoose_error: JSON.stringify(err),
					responseCode: 0
				});
				res.end();
				return;
            } else {
                res.json({
                    error: false,
                    message: "Success",
                    mongoose_error: "",
                    responseCode: 1,
                    userInfo: results
                });
                res.end();
                return;
            }
        })
	}catch(err){
		response.success=false,
		response.message="Internal Server Error",
		response.data =null,
		res.send(500).json(response)
	}
    },
/**
 * @api {post} http://http://18.191.254.193/user_acbtucalculator BTU calculator
 * @apiVersion 1.0.0
 * @apiName BTU calculator
 * @apiGroup calculator
 * @apiParamExample {json} Request-Example:
 * 
 * {
 * 	"size": "",
 *  "size_dimension": "mtr/sqft",
 *  "room_ceiling_height": "",
 *  "height_dimension": "mtr/sqft",
 *  "number_of_people_inside_regularly": "",
 * 	"type":"Kitchen",
 *  "insulation_condition":"",
 *   "sun_exposure" :"Shaded/Sunny/Both"
 *   "climate":"",
 * }
 * 
 * @apiParamExample {json} Success-Response:
 * 
{
    "success": true,
    "message": "Logged in Successfully",
    "userInfo": {
        
    }
}
 *
 * @apiSuccess {boolean} success=true Request successfully completed.
 *
 * @apiError {json} UserNotFoundError {message: 'User not found',success: false}
 * @apiError {json} InvalidParamError {message: 'Invalid parameters were passed.',success: false}
 * @apiError {json} AuthenticationTokenNotFound { message: 'Authentication token not provided!' , success: false}
 * @apiError {json} AuthTokenExpiredError { message: 'Session expired. You need to login again.' , success: false, sessionExpired: true}
 */
	userAcBTUCalculator: function(req, res, next){  //console.log('userAcBTUCalculator');  
        var size = req.body.size || ''; 
		var sizeDimension = req.body.size_dimension || '';
		var roomCeilingHeight = req.body.room_ceiling_height || '';
		var heightDimension = req.body.height_dimension || '';
		var numberOfPeopleInsideRegularly = req.body.number_of_people_inside_regularly || ''; 
		var type = req.body.type || '';  
		var insulationCondition = req.body.insulation_condition || '';
		var sunExposure = req.body.sun_exposure || '';
		var climate = req.body.climate || '';
		
        if(!size  || !sizeDimension || !roomCeilingHeight  || !heightDimension || !numberOfPeopleInsideRegularly || !type || !insulationCondition || !sunExposure || !climate) {
            res.json({
                error: true,
                message: "Required parameters missing!",
				responseCode: 0
            });
            res.end();
            return;
        }
		let btuPerH = '';
		if(sizeDimension=='mtr'){
			btuPerH = (Number(size)/0.092903)*25
		}else{
			btuPerH = Number(size)*25
		}
		 btuPerH = btuPerH*Number(numberOfPeopleInsideRegularly);

		 if(heightDimension == 'mtr'){
			if(roomCeilingHeight > 2.4384){
				let hfactor = (Number(roomCeilingHeight) - 2.4384)/0.0003048;
				btuPerH += hfactor
			}
		 }else{
			if(roomCeilingHeight > 8){
				let hfactor = (Number(roomCeilingHeight) - 8)/0.001;
				btuPerH += hfactor
			}
		 }
		if(type=='kitchen'){
			btuPerH += 4000
		}
		if(sunExposure=='Shaded'){
			btuPerH = btuPerH-(btuPerH*0.1)
		}
		if(sunExposure=='Sunny'){
			btuPerH = btuPerH +(btuPerH*0.1)
		}
		
        res.json({
			error: false,
			message: "",
			data: btuPerH+'BTU/h',
			responseCode: 1
		});
		res.end();
		return;
    },
	getNotificationList: function (req, res, next) { //console.log("getNotificationList");
		//console.log(req.body)
        var toUserId = mongoose.Types.ObjectId(req.body.id);
		var start = (req.body.start) ? parseInt(req.body.start) : 0;
        var limit = (req.body.limit) ? parseInt(req.body.limit) : 10;
		
		if (!toUserId) {
            res.json({
                error: true,
                message: 'Required parameter is missing',
                responseCode: 0
            });
            res.end();
        }
		
        var Notification = helper.getModel("notification");  
        Notification.find({to_user_id: toUserId}).sort({_id: 1}).skip(start).limit(limit).exec(function (err, results) {
            if (err) {
				res.json({
					error: true,
					message: "Something went wrong to fetch notifications.",
					mongoose_error: JSON.stringify(err),
					responseCode: 0
				});
				res.end();
				return;
            } else {
                res.json({
                    error: false,
                    message: "Success",
                    mongoose_error: "",
                    responseCode: 1,
                    results: results
                });
                res.end();
                return;
            }
        })
    },
	
	getGoodFeedbackList: function (req, res, next) { //console.log("getGoodFeedbackList");
		//console.log(req.body)
        var technicianId = mongoose.Types.ObjectId(req.body.id) || "";
		var start = (req.body.start) ? parseInt(req.body.start) : 0;
        var limit = (req.body.limit) ? parseInt(req.body.limit) : 10;
		
		if (!technicianId) {
            res.json({
                error: true,
                message: 'Required parameter is missing',
                responseCode: 0
            });
            res.end();
        }
		
		
        var Feedback = helper.getModel("feedback");  
        Feedback.find({technician_id: technicianId, rating: { $gt: 2.5 }}).sort({_id: 1}).skip(start).limit(limit).exec(function (err, results) {
            if (err) {
				res.json({
					error: true,
					message: "Something went wrong to fetch notifications.",
					mongoose_error: JSON.stringify(err),
					responseCode: 0
				});
				res.end();
				return;
            } else {
                res.json({
                    error: false,
                    message: "Success",
                    mongoose_error: "",
                    responseCode: 1,
                    userInfo: results
                });
                res.end();
                return;
            }
        })
    },
	
	getComplaintList: function (req, res, next) { //console.log("getComplaintList");
		//console.log(req.body)
        var technicianId = mongoose.Types.ObjectId(req.body.id) || "";
		var start = (req.body.start) ? parseInt(req.body.start) : 0;
        var limit = (req.body.limit) ? parseInt(req.body.limit) : 10;
		
		if (!technicianId) {
            res.json({
                error: true,
                message: 'Required parameter is missing',
                responseCode: 0
            });
            res.end();
        }
		
        var Feedback = helper.getModel("feedback");  
        Feedback.find({technician_id: technicianId, rating: { $lte: 2.5 }}).sort({_id: 1}).skip(start).limit(limit).exec(function (err, results) {
            if (err) {
				res.json({
					error: true,
					message: "Something went wrong to fetch notifications.",
					mongoose_error: JSON.stringify(err),
					responseCode: 0
				});
				res.end();
				return;
            } else {
                res.json({
                    error: false,
                    message: "Success",
                    mongoose_error: "",
                    responseCode: 1,
                    userInfo: results
                });
                res.end();
                return;
            }
        })
    },
	
	getServiceList: function (req, res, next) { //console.log("getServiceList");
        var Service = helper.getModel("service");  
        Service.find({status:true, is_deleted:false}, { name: 1, amount: 1, service_period:1 }).sort({_id: 1}).exec(function (err, results) { 
            if (err) {
				res.json({
					error: true,
					message: "Something went wrong to fetch services.",
					mongoose_error: JSON.stringify(err),
					responseCode: 0
				});
				res.end();
				return;
            } else {
                res.json({
                    error: false,
                    message: "Success",
                    responseCode: 1,
                    services: results
                });
                res.end();
                return;
            }
        })
    },
	
	getPackageList: function (req, res, next) { //console.log("getPackageList");
		
        var Package = helper.getModel("package");  
        Package.find({package_status:true, is_deleted:false}, { package_name: 1, package_price: 1, items:1 }).sort({_id: 1}).exec(function (err, results) { 
            if (err) {
				res.json({
					error: true,
					message: "Something went wrong to fetch packages.",
					mongoose_error: JSON.stringify(err),
					responseCode: 0
				});
				res.end();
				return;
            } else {
                res.json({
                    error: false,
                    message: "Success",
                    responseCode: 1,
                    packages: results
                });
                res.end();
                return;
            }
        })
    },
	
	userAddTrackAircon: function(req, res, next){  //console.log('userAddTrackAircon');  
        
		var userId = mongoose.Types.ObjectId(req.body.user_id);
		var userType = req.body.user_type || '';
        var airconPage = req.body.aircon_page || ''; 
		var airconAnswer = req.body.aircon_answer || '';
		
        if(!userId || !userType || !airconPage || !airconAnswer) {
            res.json({
                error: true,
                message: "Required parameters missing!",
				responseCode: 0
            });
            res.end();
            return;
        }
		
		var track_aircon = {};
		
		User.findOne({_id: userId, user_type:userType}, null, {sort: {created_at: -1}})
		.exec(function(error, user_info){
			if(error) {
				res.json({
					error: true,
					message: "Something went wrong, Please try again later!",
					responseCode: 0
				})
				res.end();
				return
			}else{
				if(!user_info){
					res.json({
						error: true,
						message: "Something went wrong, to fetch user data!",
						responseCode: 0
					});
					res.end();
					return;
				}
				
				//console.log("track_aircon-", track_aircon);
				if(user_info.track_aircon){
					track_aircon =  user_info.track_aircon;
				} else {
					track_aircon =  {};
				}
				
				if(airconPage == 1){
					track_aircon.type_of_aircons = airconAnswer;
				} else if(airconPage == 2){
					track_aircon.indoor_units = airconAnswer;
				} else if(airconPage == 3){
					track_aircon.use_aircon = airconAnswer;
				} else if(airconPage == 4){
					track_aircon.last_service_date = airconAnswer;
				}
				var updateInfo = { track_aircon: track_aircon }
				
				User.findOneAndUpdate({_id: userId}, {"$set": updateInfo}, {new: true}, function(err, doc){
					if(err){
						res.json({
							error: true,
							message: "Something went wrong while add aircons!",
							responseCode: 0
						});
						res.end();
						return;
					}
					// return the information as JSON

					res.json({
						error: false,
						message: 'Aircons updated successfully!',
						userInfo: doc,
						responseCode: 1
					});
					res.end();
					return;
				})
			}
		})
    },
	
	userHomePage: async function  (req, res, next) { //console.log("userHomePage");
	try{	//console.log(req.params)
        var userId = mongoose.Types.ObjectId(req.params.id);
		if (!userId) {
            res.json({
                error: true,
                message: 'Required parameter is missing',
                responseCode: 0
            });
            res.end();
        }
		
		var currentDate = moment().utcOffset(CommonHelper.getSettlementTZMins(timezone)).format('YYYY-MM-DD')
		var serviceInfo = await services.find()
        var User = helper.getModel("user");  
        User.findOne({_id: userId, is_deleted: {'$ne': true}}).sort({_id: 1}).exec(function (err, results) {
            if (err) {
				res.json({
					error: true,
					message: "Something went wrong to fetch user details.",
					mongoose_error: JSON.stringify(err),
					responseCode: 0
				});
				res.end();
				return;
            } else {
				var userInfo = {};
				userInfo._id = results._id;
				userInfo.name = results.name;
				userInfo.track_aircon = results.track_aircon;
				
				var Promocode = helper.getModel("promocode");  

				Promocode.find({active: true, valid_start_date: {'$lte': new Date(currentDate)}, valid_end_date: {'$gte': new Date(currentDate)}}).sort({_id: 1}).exec(function (oErr, oResults) {
					if (err) {
						res.json({
							error: true,
							message: "Something went wrong to fetch offers.",
							mongoose_error: JSON.stringify(err),
							responseCode: 0
						});
						res.end();
						return;
					} else {
						var Banner = helper.getModel("banner");  
						Banner.find({status: true}).sort({_id: 1}).exec(function (bErr, bResults) {
							if (err) {
								res.json({
									error: true,
									message: "Something went wrong to fetch banners.",
									mongoose_error: JSON.stringify(err),
									responseCode: 0
								});
								res.end();
								return;
							} else {
								res.json({
									error: false,
									message: "Success",
									responseCode: 1,
									userInfo: userInfo,
									offers: oResults,
									banners: bResults,
									services:serviceInfo,
									bannerImgUrl: SITE_PATH + "uploads/banner/"
								});
								res.end();
								return;
							}
						})
					}
				})
            }
        })
	}catch(err){
		response.success=false,
		response.message="Internal Server Error",
		response.data =null,
		res.send(500).json(response)
	}
    },
	
	userUpdateEmail: function(req, res, next){  //console.log('userUpdateEmail');  
        try{
		var userId = mongoose.Types.ObjectId(req.body.user_id);
		var userType = req.body.user_type || '';
        var email = req.body.email || ''; 
        if(!userId || !userType || !email) {
            res.json({
                error: true,
                message: "Required parameters missing!",
				responseCode: 0
            });
            res.end();
            return;
        }

        var updateInfo = { email: email }
        var conditions = { _id: userId, user_type: userType };
        User.findOneAndUpdate(conditions, {"$set": updateInfo}, {new: true}, function(err, user){
            if(err || !user){
                res.json({
                    error: true,
                    message: "No account exists for this phone number!",
					responseCode: 0
                });
                res.end();
                return;       
            } else {				
				res.json({
					error: false,
					message: "Your email address updated successfully",
					responseCode: 1
				});
				res.end();
				return;
            }
        });
	}catch(err){
		response.success=false,
		response.message="Internal Server Error",
		response.data =null,
		res.send(500).json(response)
	}
    },
	
	userUpdatePersonalDetails: function(req, res, next){  //console.log('userUpdatePersonalDetails');  
        try{
		var userId = mongoose.Types.ObjectId(req.body.user_id);
		var userType = req.body.user_type || '';
		var name = req.body.name || '';
        var email = req.body.email || ''; 
		var gender = req.body.gender || '';
        if(!userId || !userType || !name || !email || !gender) {
            res.json({
                error: true,
                message: "Required parameters missing!",
				responseCode: 0
            });
            res.end();
            return;
        }

        var updateInfo = { name: name, email: email, gender: gender }
        var conditions = { _id: userId, user_type: userType };
        User.findOneAndUpdate(conditions, {"$set": updateInfo}, {new: true}, function(err, user){
            if(err || !user){
                res.json({
                    error: true,
                    message: "No account exists for this user!",
					responseCode: 0
                });
                res.end();
                return;       
            } else {				
				res.json({
					error: false,
					message: "Your personal details updated successfully",
					responseCode: 1
				});
				res.end();
				return;
            }
        });
	}catch(err){
		response.success=false,
		response.message="Internal Server Error",
		response.data =null,
		res.send(500).json(response)
	}
    },
	
	userGeneralPurposeBTUCalculator: function(req, res, next){  //console.log('userGeneralPurposeBTUCalculator');  
        
		var userId = mongoose.Types.ObjectId(req.body.user_id);
		var userType = req.body.user_type || '';
        var roomWidth = req.body.room_width || ''; 
		var widthDimension = req.body.width_dimension || '';
		var roomLength = req.body.room_length || ''; 
		var lengthDimension = req.body.length_dimension || '';
		var ceilingHeight = req.body.ceiling_height || ''; 
		var heightDimension = req.body.height_dimension || '';
		var insulationCondition = req.body.insulation_condition || '';
		var desiredTemp = req.body.desired_temp || '';
		var tempDimension = req.body.temp_dimension || '';
		
        if(!userId || !userType || !roomWidth || !widthDimension || !roomLength || !lengthDimension || !ceilingHeight || !heightDimension || !insulationCondition || !desiredTemp || !tempDimension) {
            res.json({
                error: true,
                message: "Required parameters missing!",
				responseCode: 0
            });
            res.end();
            return;
        }

        res.json({
			error: false,
			message: "",
			responseCode: 1
		});
		res.end();
		return;
    },
	
	userPeriodWiseBookingDetails: function (req, res, next) { //console.log("userPeriodWiseBookingDetails");
        var userId = mongoose.Types.ObjectId(req.body.user_id) || "";
		var period = req.body.period || "";
		var start = (req.body.start) ? parseInt(req.body.start) : 0;
        var limit = (req.body.limit) ? parseInt(req.body.limit) : 10;
		
		if (!userId) {
            res.json({
                error: true,
                message: 'Required parameter is missing',
                responseCode: 0
            });
            res.end();
        }
		
		var match1 = {$match: {
			user_id: userId,
		}};
		if(period == 'all'){
			var match2 = {$match: {}};
		} else {
			if(period == 'monthly'){
				var start_date = moment().add(-1, 'month').format('YYYY-MM-DD');
				var end_date = moment().add(+1, 'days').format('YYYY-MM-DD');
			} else if(period == 'weekly'){
				var start_date = moment().add(-7, 'days').format('YYYY-MM-DD');
				var end_date = moment().add(+1, 'days').format('YYYY-MM-DD');			
			} else if(period == 'yearly'){
				var start_date = moment().add(-1, 'year').format('YYYY-MM-DD');
				var end_date = moment().add(+1, 'days').format('YYYY-MM-DD');
			} 
			
			var match2 = {$match: {
				"items.time_slot": {
					'$gte': new Date(start_date),
					'$lt': new Date(end_date)
				}
			}};
		}
				
        var Booking = helper.getModel("booking"); 
		Booking.aggregate([
			match1,
			{
				$lookup:
				{
					from: "users",
					localField: "user_id",
					foreignField: "_id",
					as: "user_info"
				}
			},
			{$unwind: {
				"path": "$user_info",
				"preserveNullAndEmptyArrays": true
			}},
			{
				$lookup:
				{
					from: "users",
					localField: "technician_id",
					foreignField: "_id",
					as: "technician_info"
				}
			},
			{$unwind: {
				"path": "$technician_info",
				"preserveNullAndEmptyArrays": true
			}},
			{
				$lookup:
				{
					from: "feedbacks",
					localField: "technician_id",
					foreignField: "technician_id",
					as: "feedback_info"
				} 
			},
			{$unwind: {
				"path": "$feedback_info",
				"preserveNullAndEmptyArrays": true
			}},
			{$group: {
                _id: "$_id", created_at: {$first: '$created_at'}, user_id: {$first: '$user_id'}, user_name: {$first: '$user_name'},
                user_track_aircon: {$first: '$user_info.track_aircon'},technician_id: {$first: '$technician_id'}, technician_name: {$first: '$technician_name'}, technician_phone: {$first: '$technician_info.phone'}, payment_status: {$first: '$payment_status'}, payment_mode: {$first: '$payment_mode'}, booking_status: {$first: '$booking_status'}, amount_paid: {$first: '$amount_paid'}, total_payable_amount: {$first: '$total_payable_amount'}, tip_amount: {$first: '$tip_amount'}, 
				delivery_location: {$first: '$delivery_location'},
                items: {$addToSet: "$items"},
				feedback_rating: { $sum: "$feedback_info.rating" },
				feedback_count: { $sum: 1 }
				
			}},
			{$project:{_id:1, created_at:1, user_id:1, user_name:1, user_track_aircon:1, technician_id:1, technician_name:1, technician_phone:1, payment_status:1, payment_mode:1, booking_status:1, amount_paid:1, total_payable_amount:1, tip_amount:1, delivery_location:1, items:1, technician_rating: { $divide: [ "$feedback_rating", "$feedback_count" ]}}},
			{$unwind: "$items"},
			match2,
			{$sort: {
				_id: 1
			}},
			{$skip: start},
            {$limit: limit}
		])
		.exec(function (err, results) {
            if (err) {
				res.json({
					error: true,
					message: "Something went wrong to fetch booking details.",
					mongoose_error: JSON.stringify(err),
					responseCode: 0
				});
				res.end();
				return;
            } else {
				res.json({
					error: false,
					message: "Success",
					responseCode: 1,
					results: results,
				});
				res.end();
				return;
            }
        })
    },
	
	userDateWiseBookingDetails: function (req, res, next) { //console.log("userDateWiseBookingDetails");
        var userId = mongoose.Types.ObjectId(req.body.user_id) || "";
		var getDate = req.body.date || "";
		var start = (req.body.start) ? parseInt(req.body.start) : 0;
        var limit = (req.body.limit) ? parseInt(req.body.limit) : 10;
		
		if (!userId || !getDate) {
            res.json({
                error: true,
                message: 'Required parameter is missing',
                responseCode: 0
            });
            res.end(); 
        }
		
		var start_date = moment(req.body.date).format('YYYY-MM-DD');
		var end_date = moment(req.body.date).add(+1, 'days').format('YYYY-MM-DD');
		//console.log(start_date, end_date);
		
        var Booking = helper.getModel("booking"); 
		Booking.aggregate([
			{$match: {
				user_id: userId,
			}},
			{$unwind: "$items"},
			{$match: {
				"items.time_slot": {
					'$gte': new Date(start_date),
					'$lt': new Date(end_date)
				}
			}},
			{
				$lookup:
				{
					from: "users",
					localField: "user_id",
					foreignField: "_id",
					as: "user_info"
				}
			},
			{$unwind: {
				"path": "$user_info",
				"preserveNullAndEmptyArrays": true
			}},
			{
				$lookup:
				{
					from: "users",
					localField: "technician_id",
					foreignField: "_id",
					as: "technician_info"
				}
			},
			{$unwind: {
				"path": "$technician_info",
				"preserveNullAndEmptyArrays": true
			}},
			{$group: {
                _id: "$_id", created_at: {$first: '$created_at'}, user_id: {$first: '$user_id'}, user_name: {$first: '$user_name'}, user_track_aircon: {$first: '$user_info.track_aircon'},
                technician_id: {$first: '$technician_id'}, technician_name: {$first: '$technician_name'}, technician_phone: {$first: '$technician_info.phone'}, payment_status: {$first: '$payment_status'}, payment_mode: {$first: '$payment_mode'}, booking_status: {$first: '$booking_status'}, amount_paid: {$first: '$amount_paid'}, total_payable_amount: {$first: '$total_payable_amount'}, tip_amount: {$first: '$tip_amount'},
				delivery_location: {$first: '$delivery_location'},	
                items: {$addToSet: "$items"}
			}},
			{$project:{_id:1, created_at:1, user_id:1, user_name:1, user_track_aircon:1, technician_id:1, technician_name:1, technician_phone:1, payment_status:1, payment_mode:1, booking_status:1, amount_paid:1, total_payable_amount:1, tip_amount:1, delivery_location:1, items:1,}
			},
			{$unwind: "$items"},
			{$sort: {
				_id: 1
			}},
			{$skip: start},
            {$limit: limit}
		])	
		.exec(function (err, results) {
            if (err) {
				res.json({
					error: true,
					message: "Something went wrong to fetch booking details.",
					mongoose_error: JSON.stringify(err),
					responseCode: 0
				});
				res.end();
				return;
            } else {
				res.json({
					error: false,
					message: "Success",
					responseCode: 1,
					results: results,
				});
				res.end();
				return;
            }
        })
    },
	
	userTrackBookingDetails: function (req, res, next) { //console.log("userTrackBookingDetails");
        var userId = mongoose.Types.ObjectId(req.body.id) || "";
		var start = (req.body.start) ? parseInt(req.body.start) : 0;
        var limit = (req.body.limit) ? parseInt(req.body.limit) : 10;
		
		if (!userId) {
            res.json({
                error: true,
                message: 'Required parameter is missing',
                responseCode: 0
            });
            res.end(); 
        }
		
		var start_date = moment(req.body.date).format('YYYY-MM-DD');
		var end_date = moment(req.body.date).add(+1, 'days').format('YYYY-MM-DD');
		//console.log(start_date, end_date);
		
        var Booking = helper.getModel("booking");  
		Booking.aggregate([
			{$match: {
				user_id: userId,
			}},
			{$unwind: "$items"},
			{$match: {
				"items.time_slot": {
					'$gte': new Date(start_date),
					'$lt': new Date(end_date)
				}
			}},
			{
				$lookup:
				{
					from: "users",
					localField: "user_id",
					foreignField: "_id",
					as: "user_info"
				}
			},
			{$unwind: {
				"path": "$user_info",
				"preserveNullAndEmptyArrays": true
			}},
			{
				$lookup:
				{
					from: "users",
					localField: "technician_id",
					foreignField: "_id",
					as: "technician_info"
				}
			},
			{$unwind: {
				"path": "$technician_info",
				"preserveNullAndEmptyArrays": true
			}},
			{$group: {
                _id: "$_id", created_at: {$first: '$created_at'}, user_id: {$first: '$user_id'}, user_name: {$first: '$user_name'}, user_track_aircon: {$first: '$user_info.track_aircon'}, technician_id: {$first: '$technician_id'}, technician_name: {$first: '$technician_name'}, technician_phone: {$first: '$technician_info.phone'}, payment_status: {$first: '$payment_status'}, payment_mode: {$first: '$payment_mode'}, booking_status: {$first: '$booking_status'}, amount_paid: {$first: '$amount_paid'}, total_payable_amount: {$first: '$total_payable_amount'}, tip_amount: {$first: '$tip_amount'}, delivery_location: {$first: '$delivery_location'},
                items: {$addToSet: "$items"}
			}},
			{$project:{_id:1, created_at:1, user_id:1, user_name:1, user_track_aircon:1, technician_id:1, technician_name:1, technician_phone:1, payment_status:1, payment_mode:1, booking_status:1, amount_paid:1, total_payable_amount:1, tip_amount:1, delivery_location:1, items:1 }
			},
			{$sort: {
				_id: 1
			}},
			{$skip: start},
            {$limit: limit}
		])
		.exec(function (err, results) {
            if (err) {
				res.json({
					error: true,
					message: "Something went wrong to fetch booking details.",
					mongoose_error: JSON.stringify(err),
					responseCode: 0
				});
				res.end();
				return;
            } else {
				res.json({
					error: false,
					message: "Success",
					responseCode: 1,
					results: results,
				});
				res.end();
				return;
            }
        })
    },
	
	userSubmitFeedback: function(req, res, next){ //console.log('userSubmitFeedback'); 
	
		//console.log("REQUEST~~~", req.body);
        if (!req.body) {
            res.json({
                error: true,
                message: 'Form data is missing',
                responseCode: 0
            });
            res.end();
        }
		
        var posted_data = {};
        posted_data.user_id = mongoose.Types.ObjectId(req.body.user_id) || "";
        posted_data.user_name = req.body.user_name || "";
		posted_data.technician_id = mongoose.Types.ObjectId(req.body.technician_id) || "";
        posted_data.technician_name = req.body.technician_name || "";
		posted_data.service_id = mongoose.Types.ObjectId(req.body.service_id) || ""; 
        posted_data.booking_id = mongoose.Types.ObjectId(req.body.booking_id) || "";
        posted_data.rating = req.body.rating || "";
		posted_data.feedback_message = req.body.feedback_message || "";
		if (!posted_data.user_id || !posted_data.user_name || !posted_data.technician_id || !posted_data.technician_name || !posted_data.service_id || !posted_data.booking_id || !posted_data.rating || !posted_data.feedback_message) {
            res.json({
                error: true,
                message: "Required parameter is missing",
                responseCode: 0
            });
            res.end();
            return;
        }
		
		var Feedback = helper.getModel('feedback');
        var newFeedback = new Feedback(posted_data);
		
		newFeedback.save(function(errors, dbres) {
			//console.log("errors", errors)
			if(errors){
				res.json({
					error: true,
					message: "Something went wrong, please try again: "+errors,
					responseCode: 0
				});
				res.end();
				return;
			} else {
				// return the information including token as JSON
				res.json({
					error: false,
					message: 'Feedback saved success',
					results: dbres,
					responseCode: 1
				});
				res.end();
				return;
			}
		})
    },
	
	usersChatList: function(req, res, next){	//console.log('usersChatList');
		
		var userId = mongoose.Types.ObjectId(req.params.id);
		if (!userId) {
            res.json({
                error: true,
                message: 'Required parameter is missing',
                responseCode: 0
            });
            res.end();
        }
		
		var Chat = helper.getModel("chat");  
		Chat.aggregate([
			{$match: {
				sender_id: userId,
				type: 'text'
			}},
			{
				$lookup:
				{
					from: "users",
					localField: "receiver_id",
					foreignField: "_id",
					as: "user_info"
				}
			},
			{$unwind: {
				"path": "$user_info",
				"preserveNullAndEmptyArrays": true
			}},
			{$group: {
                _id: "$receiver_id", created_at: {$last: '$created_at'}, timezone_created_at: {$last: '$timezone_created_at'}, chat_id: {$last: '$chat_id'},  sender_id: {$first: '$sender_id'}, receiver_name: {$first: '$user_info.name'}, receiver_photo: {$first: '$user_info.profile_photo'}, message: {$last: '$message'}, type: {$last: '$type'}
			}},
			{$project:{_id:1, created_at:1, timezone_created_at:1, chat_id:1, sender_id:1, receiver_id:1, receiver_name:1, receiver_photo:1, message:1, type:1 }
			},
			{$sort: {
				timezone_created_at: -1
			}}
		])
		.exec(function (err, results) {
            if (err) {
				res.json({
					error: true,
					message: "Something went wrong to fetch user chat list.",
					mongoose_error: JSON.stringify(err),
					responseCode: 0
				});
				res.end();
				return;
            } else {
				res.json({
					error: false,
					message: "Success",
					responseCode: 1,
					results: results,
				});
				res.end();
				return;
            }
        })
	},	
	
	getBookingDetailsById: function (req, res, next) { //console.log("getBookingDetailsById");
		//console.log(req.params)
        var bookingId = mongoose.Types.ObjectId(req.params.id);
		if (!bookingId) {
            res.json({
                error: true,
                message: 'Required parameter is missing',
                responseCode: 0
            });
            res.end();
        }
		
        var Booking = helper.getModel("booking"); 
		Booking.findOne({_id: bookingId}, null, {sort: {created_at: -1}}).exec(function(err, results){	
            if (err) {
				res.json({
					error: true,
					message: "Something went wrong to fetch booking details.",
					mongoose_error: JSON.stringify(err),
					responseCode: 0
				});
				res.end();
				return;
            } else {
                res.json({
                    error: false,
                    message: "Success",
                    responseCode: 1,
                    userInfo: results
                });
                res.end();
                return;
            }
        })
    },
	
	technicianBookingChangeStatus: function (req, res, next) { //console.log("technicianBookingChangeStatus");
		var bookingId = mongoose.Types.ObjectId(req.body.id) || '';
        var bookingStatus = req.body.booking_status || '';

        if(!bookingId || !bookingStatus){
            res.json({
                error: true,
                message: "Required parameters missing!",
				responseCode: 0
            });
            res.end();
            return;
        }
		
		var currentDate = moment().utcOffset(CommonHelper.getSettlementTZMins(timezone)).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
		//console.log(currentDate);
        var updateInfo = { booking_status: bookingStatus, booking_status_date:new Date(currentDate)}
		
		var Booking = helper.getModel("booking"); 
		Booking.findOneAndUpdate({_id: bookingId}, {"$set": updateInfo}, {new: true}, function(err, doc){
			if(err){
				//console.log("error-",err);
				res.json({
					error: true,
					message: "Something went wrong while updating booking status, Please try again later!",
					responseCode: 0
				});
				res.end();
				return;
			}
			// return the information as JSON

			res.json({
				error: false,
				message: 'Booking status updated successfully!',
				userInfo: doc,
				responseCode: 1
			});
			res.end();
			return;
		})
    },
	
	technicianKpiTracker: function (req, res, next) { //console.log("technicianKpiTracker");
        var technicianId = mongoose.Types.ObjectId(req.body.technician_id) || "";
		var trackerType = req.body.tracker_type || "";
		var start = (req.body.start) ? parseInt(req.body.start) : 0;
        var limit = (req.body.limit) ? parseInt(req.body.limit) : 10;
		
		if (!technicianId) {
            res.json({
                error: true,
                message: 'Required parameter is missing',
                responseCode: 0
            });
            res.end();
        }
			
		if(trackerType == 'monthly'){
			var start_date = moment().add(-1, 'month').format('YYYY-MM-DD');
			var end_date = moment().add(+1, 'days').format('YYYY-MM-DD');
		} else if(trackerType == 'quarterly'){
			var start_date = moment().add(-3, 'month').format('YYYY-MM-DD');
			var end_date = moment().add(+1, 'days').format('YYYY-MM-DD');
		} else if(trackerType == 'yearly'){
			var start_date = moment().add(-1, 'year').format('YYYY-MM-DD');
			var end_date = moment().add(+1, 'days').format('YYYY-MM-DD');
		} else {
			var start_date = moment().format('YYYY-MM-DD');
			var end_date = moment().add(+1, 'days').format('YYYY-MM-DD');
		}	
		//console.log(start_date, end_date)
		
        var Feedback = helper.getModel("feedback");  
        Feedback.find({technician_id: technicianId, rating: { $gt: 2.5 }, created_at: {'$gte': new Date(start_date), '$lt': new Date(end_date)}}).sort({_id: -1}).skip(start).limit(limit).exec(function (err, results) {
            if (err) {
				res.json({
					error: true,
					message: "Something went wrong to fetch good feedback.",
					mongoose_error: JSON.stringify(err),
					responseCode: 0
				});
				res.end();
				return;
            } else {
				Feedback.find({technician_id: technicianId, rating: { $lte: 2.5 }, created_at: {'$gte': new Date(start_date), '$lte': new Date(end_date)}}).sort({_id: 1}).exec(function (err, results2) {
					if (err) {
						res.json({
							error: true,
							message: "Something went wrong to fetch complaints.",
							mongoose_error: JSON.stringify(err),
							responseCode: 0
						});
						res.end();
						return;
					} else {
						Feedback.aggregate([
						{ $match: { technician_id: technicianId } },
						{ $group: {_id: "$technician_id", count: { $sum: 1 }, total_rating: {$sum: "$rating" } } }
						]).exec(function (error, t_res) {
							if (error) {
								res.json({
									error: true,
									message: "Something went wrong to fetch rating.",
									mongoose_error: JSON.stringify(err),
									responseCode: 0
								});
								res.end();
								return;
							} else {
								var rating = 0;
								if(t_res.length>0){
									rating = t_res[0].total_rating/t_res[0].count;
								}
								
								res.json({
									error: false,
									message: "Success",
									responseCode: 1,
									good_feedback: results,
									complaints: results2,
									ratings:rating
								});
								res.end();
								return;
							}	
						})
					}
				})
            }
        })
    },
	
	technicianTimeOnJob: function (req, res, next) { //console.log("technicianTimeOnJob");
		//console.log(req.body);
		var technicianId = mongoose.Types.ObjectId(req.body.id) || "";
		var start = (req.body.start) ? parseInt(req.body.start) : 0;
        var limit = (req.body.limit) ? parseInt(req.body.limit) : 10;
		
		if (!technicianId) {
            res.json({
                error: true,
                message: 'Required parameter is missing',
                responseCode: 0
            });
            res.end();
        }
		
		var bookingStatus = ["pending", "leavingforjob"]; 
		
        var Booking = helper.getModel("booking");
		Booking.find({technician_id: technicianId, booking_status: {"$in": bookingStatus}}).sort({_id: 1}).skip(start).limit(limit)
		.exec(function (err, results) {	
            if (err) {
				res.json({
					error: true,
					message: "Something went wrong to fetch time on job bookings.",
					mongoose_error: JSON.stringify(err),
					responseCode: 0
				});
				res.end();
				return;
            } else {
				Booking.find({technician_id: technicianId, booking_status: "jobstarted"}).sort({_id: 1}).skip(start).limit(limit)
				.exec(function (err, results2) {	
					if (err) {
						res.json({
							error: true,
							message: "Something went wrong to fetch ongoing job bookings.",
							mongoose_error: JSON.stringify(err),
							responseCode: 0
						});
						res.end();
						return;
					} else {
						res.json({
							error: false,
							message: "Success",
							responseCode: 1,
							ongoing_services: results2,
							other_services:results
						});
						res.end();
						return;
					}
				})
            }
        })
    },
	
	technicianPeriodWiseBookingDetails: function (req, res, next) { //console.log("technicianPeriodWiseBookingDetails");
        var technicianId = mongoose.Types.ObjectId(req.body.technician_id) || "";
		var period = req.body.period || "";
		var start = (req.body.start) ? parseInt(req.body.start) : 0;
        var limit = (req.body.limit) ? parseInt(req.body.limit) : 10;
		
		if (!technicianId) {
            res.json({
                error: true,
                message: 'Required parameter is missing',
                responseCode: 0
            });
            res.end();
        }
		
		if(period == 'monthly'){
			var start_date = moment().add(-1, 'month').format('YYYY-MM-DD');
			var end_date = moment().add(+1, 'days').format('YYYY-MM-DD');
		} else if(period == 'quarterly'){
			var start_date = moment().add(-3, 'month').format('YYYY-MM-DD');
			var end_date = moment().add(+1, 'days').format('YYYY-MM-DD');
		} else if(period == 'yearly'){
			var start_date = moment().add(-1, 'year').format('YYYY-MM-DD');
			var end_date = moment().add(+1, 'days').format('YYYY-MM-DD');
		} else {
			var start_date = moment().format('YYYY-MM-DD');
			var end_date = moment().add(+1, 'days').format('YYYY-MM-DD');
		}		
		//console.log(start_date, end_date)
		
		var bookingStatus = ["completed"];
		
		var Booking = helper.getModel("booking");  
		Booking.aggregate([
			{$match: {
				technician_id: technicianId,
				booking_status: {"$in": bookingStatus}
			}},
			{
				$lookup:
				{
					from: "users",
					localField: "user_id",
					foreignField: "_id",
					as: "user_info"
				}
			},
			{$unwind: {
				"path": "$user_info",
				"preserveNullAndEmptyArrays": true
			}},
			{$group: {
                _id: "$_id", created_at: {$first: '$created_at'}, user_id: {$first: '$user_id'}, user_name: {$first: '$user_name'}, user_phone: {$first: '$user_info.phone'}, 
                technician_id: {$first: '$technician_id'}, technician_name: {$first: '$technician_name'}, payment_status: {$first: '$payment_status'}, payment_mode: {$first: '$payment_mode'}, booking_status: {$first: '$booking_status'}, amount_paid: {$first: '$amount_paid'}, total_payable_amount: {$first: '$total_payable_amount'}, tip_amount: {$first: '$tip_amount'}, 
				delivery_location: {$first: '$delivery_location'}, user_latitude: {$first: '$user_latitude'},user_longitude: {$first: '$user_longitude'},total_time_duration: {$first: '$total_time_duration'},
                items: {$addToSet: "$items"}
			}},
			{$project:{_id:1, created_at:1, user_id:1, user_name:1, user_phone:1, technician_id:1, technician_name:1, payment_status:1, payment_mode:1, booking_status:1, amount_paid:1, total_payable_amount:1, tip_amount:1, delivery_location:1, items:1, user_latitude:1, user_longitude:1, total_time_duration:1}},
			{$unwind: "$items"},
			{$match: {
				"items.time_slot": {
					'$gte': new Date(start_date),
					'$lt': new Date(end_date)
				}
			}},
			{$sort: {
				_id: 1
			}},
			{$skip: start},
            {$limit: limit}
		])		
		.exec(function (err, results) {
            if (err) {
				res.json({
					error: true,
					message: "Something went wrong to fetch booking details.",
					mongoose_error: JSON.stringify(err),
					responseCode: 0
				});
				res.end();
				return;
            } else {
				res.json({
					error: false,
					message: "Success",
					responseCode: 1,
					results: results,
				});
				res.end();
				return;
            }
        })
    },
	
	technicianDateWiseBookingDetails: function (req, res, next) { //console.log("technicianDateWiseBookingDetails");
        var technicianId = mongoose.Types.ObjectId(req.body.technician_id) || "";
		var getDate = req.body.date || "";
		var start = (req.body.start) ? parseInt(req.body.start) : 0;
        var limit = (req.body.limit) ? parseInt(req.body.limit) : 10;
		
		if (!technicianId || !getDate) {
            res.json({
                error: true,
                message: 'Required parameter is missing',
                responseCode: 0
            });
            res.end(); 
        }
		
		var start_date = moment(req.body.date).format('YYYY-MM-DD');
		var end_date = moment(req.body.date).add(+1, 'days').format('YYYY-MM-DD');
		//console.log(start_date, end_date);
		
		var bookingStatus = ["pending", "leavingforjob", "jobstarted"]; 
		
        var Booking = helper.getModel("booking");  
		Booking.aggregate([
			{$match: {
				technician_id: technicianId,
				booking_status: {"$in": bookingStatus}
			}},
			{
				$lookup:
				{
					from: "users",
					localField: "user_id",
					foreignField: "_id",
					as: "user_info"
				}
			},
			{$unwind: {
				"path": "$user_info",
				"preserveNullAndEmptyArrays": true
			}},
			{$group: {
                _id: "$_id", created_at: {$first: '$created_at'}, user_id: {$first: '$user_id'}, user_name: {$first: '$user_name'},user_phone: {$first: '$user_info.phone'}, 
                technician_id: {$first: '$technician_id'}, technician_name: {$first: '$technician_name'}, payment_status: {$first: '$payment_status'}, payment_mode: {$first: '$payment_mode'}, booking_status: {$first: '$booking_status'}, amount_paid: {$first: '$amount_paid'}, total_payable_amount: {$first: '$total_payable_amount'}, tip_amount: {$first: '$tip_amount'}, 
				delivery_location: {$first: '$delivery_location'}, user_latitude: {$first: '$user_latitude'},user_longitude: {$first: '$user_longitude'},total_time_duration: {$first: '$total_time_duration'},
                items: {$addToSet: "$items"}
			}},
			{$project:{_id:1, created_at:1, user_id:1, user_name:1, user_phone:1, technician_id:1, technician_name:1, payment_status:1, payment_mode:1, booking_status:1, amount_paid:1, total_payable_amount:1, tip_amount:1, delivery_location:1, items:1, user_latitude:1, user_longitude:1, total_time_duration:1}},
			{$unwind: "$items"},
			{$match: {
				"items.time_slot": {
					'$gte': new Date(start_date),
					'$lt': new Date(end_date)
				}
			}},
			{$sort: {
				_id: 1
			}},
			{$skip: start},
            {$limit: limit}
		])
		.exec(function (err, results) {
            if (err) {
				res.json({
					error: true,
					message: "Something went wrong to fetch booking details.",
					mongoose_error: JSON.stringify(err),
					responseCode: 0
				});
				res.end();
				return;
            } else {
				res.json({
					error: false,
					message: "Success",
					responseCode: 1,
					results: results,
				});
				res.end();
				return;
            }
        })
    },
	
	technicianHomePage: function (req, res, next) { //console.log("technicianHomePage");
		 try{
        var technicianId = mongoose.Types.ObjectId(req.params.id) || "";
		
		if (!technicianId) {
            res.json({
                error: true,
                message: 'Required parameter is missing',
                responseCode: 0
            });
            res.end(); 
        }
		
		startDate = moment().format('YYYY-MM-DD');
		endDate = moment().add(+1, 'days').format('YYYY-MM-DD');
		//console.log(startDate, endDate, technicianId)
				
		var Booking = helper.getModel("booking");
		var Feedback = helper.getModel("feedback");
		
		var bookingStatus = ["pending", "leavingforjob", "jobstarted"]; 
		Booking.aggregate([
			{$match: {
				technician_id: technicianId,
				booking_status: {"$in": bookingStatus}
			}},
			{
				$lookup:
				{
					from: "users",
					localField: "user_id",
					foreignField: "_id",
					as: "user_info"
				}
			},
			{$unwind: {
				"path": "$user_info",
				"preserveNullAndEmptyArrays": true
			}},
			{$group: {
                _id: "$_id", created_at: {$first: '$created_at'}, user_id: {$first: '$user_id'}, user_name: {$first: '$user_name'},user_phone: {$first: '$user_info.phone'}, 
                technician_id: {$first: '$technician_id'}, technician_name: {$first: '$technician_name'}, payment_status: {$first: '$payment_status'}, payment_mode: {$first: '$payment_mode'}, booking_status: {$first: '$booking_status'}, amount_paid: {$first: '$amount_paid'}, total_payable_amount: {$first: '$total_payable_amount'}, tip_amount: {$first: '$tip_amount'}, 
				delivery_location: {$first: '$delivery_location'}, user_latitude: {$first: '$user_latitude'},user_longitude: {$first: '$user_longitude'},total_time_duration: {$first: '$total_time_duration'},
                items: {$addToSet: "$items"}
			}},
			{$project:{_id:1, created_at:1, user_id:1, user_name:1, user_phone:1, technician_id:1, technician_name:1, payment_status:1, payment_mode:1, booking_status:1, amount_paid:1, total_payable_amount:1, tip_amount:1, delivery_location:1, items:1, user_latitude:1, user_longitude:1, total_time_duration:1}},
			{$unwind: "$items"},
			{$match: {
				"items.time_slot": {
					'$gte': new Date(startDate),
					'$lt': new Date(endDate)
				}
			}}
		]).exec(function (error, results) {
			if (error) {
				res.json({
					error: true,
					message: "Something went wrong to fetch booking data",
					mongoose_error: JSON.stringify(err),
					responseCode: 0
				});
				res.end();
				return;
            } else {
				//console.log("results-",results)
				var iLength = results.length;
				if (iLength > 0) {
					var incompletedPayment = 0;
					var incompletedPaymentCount = 0;
					var todayCash = 0;
					var ongoingJob = "";
					var duration = "";
					var pendingJob = 0;
					var i = 0;
					each(results, function (result, nextItem) {
						//console.log("cartItem-",cartItem);
						if(result.payment_status == 'pending'){
							incompletedPayment += result.total_payable_amount;
							incompletedPaymentCount += 1;
						}
						
						todayCash += result.amount_paid.cash;
						
						if(result.booking_status == 'jobstarted'){
							ongoingJob = result.items[0].service_name;
							duration = result.items[0].service_duration;
						}
						
						if(result.booking_status == 'pending' || result.booking_status == 'leavingforjob'){
							pendingJob += 1;
						}
						
						if (++i >= iLength) {
							Feedback.aggregate([
							{ $match: { technician_id: technicianId } },
							{ $group: {_id: "$technician_id", count: { $sum: 1 }, total_rating: {$sum: "$rating" } } }
							]).exec(function (error, t_res) {
								var rating = 0;
								var total_reviews = 0;
								if (error) {
									//console.log(error);
									res.json({
										error: false,
										message: 'Success',
										responseCode: 1,
										today_bookings: results,
										payments:{
											'incompleted_count':incompletedPaymentCount,
											'incompleted_amount':incompletedPayment,
											'cash':todayCash
										},
										timeonjob:{
											'ongoing_job':ongoingJob,
											'duration': duration,
											'pending_job':pendingJob
										},
										kpitracker:{
											'rating':0,
											'total_reviews':0
										}
									});
									res.end();
									return;
								} else {
									if(t_res.length>0){
										rating = t_res[0].total_rating/t_res[0].count;
										total_reviews = t_res[0].count;
									}
									
									res.json({
										error: false,
										message: 'Success',
										responseCode: 1,
										today_bookings: results,
										payments:{
											'incompleted_count':incompletedPaymentCount,
											'incompleted_amount':incompletedPayment,
											'cash':todayCash
										},
										timeonjob:{
											'ongoing_job':ongoingJob,
											'duration': duration,
											'pending_job':pendingJob
										},
										kpitracker:{
											'rating':rating,
											'total_reviews':total_reviews
										}
									});
									res.end();
									return;
								}	
							})
						} else {
							nextItem();
						}
					});
				} else {
					res.json({
						error: false,
						message: "Success",
						responseCode: 1,
						today_bookings: 0,
						payments:{
							'incompleted_count':0,
							'incompleted_amount':0,
							'cash':0
						},
						timeonjob:{
							'ongoing_job':0,
							'duration': 0,
							'pending_job':0
						},
						kpitracker:{
							'rating':0,
							'total_reviews':0
						},
					});
					res.end();
					return;
				}
			}	
		})
	}catch(err){
		response.success=false,
		response.message="Internal Server Error",
		response.data =null,
		res.send(500).json(response)
	}
    },
	
	technicianPaymentStatus: function (req, res, next) { //console.log("technicianPaymentStatus");
        var technicianId = mongoose.Types.ObjectId(req.params.id) || "";
		
		if (!technicianId) {
            res.json({
                error: true,
                message: 'Required parameter is missing',
                responseCode: 0
            });
            res.end();
        }
		
		startDate = moment().format('YYYY-MM-DD');
		endDate = moment().add(+1, 'days').format('YYYY-MM-DD');
		
		//console.log(startDate, endDate, technicianId)
				
		var Booking = helper.getModel("booking");
		var Transaction = helper.getModel("transaction");

		Booking.aggregate([
			{$match: {
				technician_id: technicianId,
			}},
			{$unwind: "$items"},
			{$match: {
				"items.time_slot": {
					'$gte': new Date(startDate),
					'$lt': new Date(endDate)
				}
			}},
			{$group: {
                _id: "$_id", created_at: {$first: '$created_at'}, user_id: {$first: '$user_id'}, user_name: {$first: '$user_name'},
                technician_id: {$first: '$technician_id'}, technician_name: {$first: '$technician_name'}, payment_status: {$first: '$payment_status'}, payment_mode: {$first: '$payment_mode'}, booking_status: {$first: '$booking_status'}, amount_paid: {$first: '$amount_paid'}, total_payable_amount: {$first: '$total_payable_amount'}, tip_amount: {$first: '$tip_amount'}, total_time_duration: {$first: '$total_time_duration'},
                items: {$addToSet: "$items"}}}
		]).exec(function (error, results) {
			if (error) {
                res.json({
					error: true,
					message: "Something went wrong to fetch payment status",
					mongoose_error: JSON.stringify(err),
					responseCode: 0
				});
				res.end();
				return;
            } else {
				var iLength = results.length;
				if (iLength > 0) {
					var pendingPayment = 0;
					var receivedCash = 0;
					var companyHo = 0;
					var tip = 0;
					var i = 0;
					each(results, function (result, nextItem) {
						//console.log("cartItem-",cartItem);
						if(result.payment_status == 'pending'){
							pendingPayment += result.total_payable_amount;
						}
						
						receivedCash += result.amount_paid.cash;
						tip += result.tip_amount;
						companyHo += (receivedCash - tip);
						
						if (++i >= iLength) {
							Transaction.aggregate([
								{"$match": {
									"created_at": {
										'$gte': new Date(startDate),
										'$lt': new Date(endDate)
									}
								}},
								{
									$lookup:
									{
										from: "bookings",
										localField: "booking_id",
										foreignField: "_id",
										as: "booking_info"
									}
								},
								{"$unwind": "$booking_info"},
								{"$match": {
									"booking_info.technician_id": technicianId, 
								}},
								{$sort: {_id: 1}}
							])
							.exec(function (t_err, t_res) {
								if (t_err) {
									res.json({
										error: true,
										message: "Something went wrong to fetch transaction data.",
										mongoose_error: JSON.stringify(err),
										responseCode: 0
									});
									res.end();
									return;
								} else {
									res.json({
										error: false,
										message: 'Success',
										responseCode: 1,
										transactions: t_res,
										payment_status:{
											'pending':pendingPayment,
											'received':receivedCash,
											'companyho':companyHo,
											'tip':tip
										}
									});
									res.end();
									return;
								}	
							})
						} else {
							nextItem();
						}
					});
				} else {
					res.json({
						error: false,
						message: "Success",
						responseCode: 1,
						transactions: [],
						payment_status:{
							'pending':0,
							'received':0,
							'companyho':0,
							'tip':0
						}
					});
					res.end();
					return;
				}
			}	
		})
    },
	
	technicianServiceUpdate: function (req, res, next) { //console.log("technician_serviceupdate");
		//console.log(req.body);
        var bookingId = mongoose.Types.ObjectId(req.body.booking_id) || "";
		var itemUniqId = (req.body.item_uniq_id) ? req.body.item_uniq_id : "";
		var serviceName = (req.body.service_name) ? req.body.service_name : "";
		var serviceId = (req.body.service_id) ? mongoose.Types.ObjectId(req.body.service_id) : "";
		var duration = (req.body.duration) ? parseInt(req.body.duration) : "";
		var amount = (req.body.amount) ? req.body.amount : "";
		
		if(!bookingId || !itemUniqId || !serviceName || !serviceId  || !duration || !amount){
            res.json({
                error: true,
                message: "Required parameters missing!",
				responseCode: 0
            });
            res.end();
            return;
        }
		
		var Booking = helper.getModel("booking");
		
		_loadItemInfo(bookingId, itemUniqId, function (err, result) {
			//console.log("result-",result);
			if (err || result.length <= 0) {
				res.json({
					error: true,
					message: "Something went wrong to get booking data.",
					mongoose_error: JSON.stringify(err),
					responseCode: 0
				});
				res.end();
				return;
			} else {
				//console.log(result);
				var technicianId = result[0].technician_id;
				var technicianName = result[0].technician_name;
				var userId = result[0].user_id;
				var userName = result[0].user_name;
				
				var bookingTotal = result[0].booking_total + amount;
				if(result[0].discount_type == 'percentage'){
					discountAmount = (bookingTotal*result[0].discount/100);
				} else {
					discountAmount = result[0].discount;
				}
				var bookingTotalAfterDiscount = bookingTotal - discountAmount;
				var totalPayableAmount = bookingTotalAfterDiscount+result[0].tip_amount+result[0].tax+result[0].service_charge;
				
				
				var start_time = moment(result[0].items.end_time_slot).toDate();
				var end_time = moment(result[0].items.end_time_slot).add(duration, 'm').toDate();			
				
				var stime = moment(start_time).utcOffset(0).format('HH:mm');
				var etime = moment(end_time).utcOffset(0).format('HH:mm');
								
				
				var pData = {};
				pData.item_uniq_id = helper.getUniqueItemId();
				pData.service_id = serviceId;
				pData.service_name = serviceName;
				pData.service_duration = duration;
				pData.service_amount = amount;
				pData.booking_units = 1;
				pData.total_booking_amount = amount;
				pData.time_slot = new Date(start_time);
				pData.end_time_slot = new Date(end_time);
				pData.start_time = stime;
				pData.end_time = etime;
				pData.image = "";
				pData.video = "";
				pData.comment = "";
				pData.service_confirmation = false;
				//console.log(pData);
				
				Booking.updateOne({
					_id: mongoose.Types.ObjectId(bookingId),
				}, {
					$addToSet: {														
						items: { $each: [pData] }   //items: posted_data
					},
					$set: { 
					   booking_total: bookingTotal,
					   discount_amount: discountAmount,
					   booking_total_after_discount: bookingTotalAfterDiscount,
					   total_payable_amount: totalPayableAmount
					}
				},  
				function (errors, dbres) {
					if (errors) {
						res.json({
							error: true,
							message: "Something went wrong to update booking.",
							mongoose_error: JSON.stringify(errors),
							responseCode: 0
						});
						res.end();
						return;
					} else {
						//console.log("dbres", dbres);
						if (dbres && dbres.modifiedCount>0) {
							// Send notification to customer for booking update
							var data = {
								"fromUserId": technicianId,
								"fromUserName": technicianName,
								"toUserId": userId,
								"toUserName": userName,
								"description": "Booking update with added new service",
								"readStatus": false,
								"notificationType": "update_booking",
								"notificationDetails": {
									"booking_id": bookingId,
									"item_uniq_id": pData.item_uniq_id
								},
							}
							_sendNotification(data, function(nErr, nRes, nMsg){
								if(nErr){
									res.json({
										error: true,
										message: nMsg,
										mongoose_error: JSON.stringify(nErr),
										responseCode: 0
									});
									res.end();
									return;
								} else {
									_updateBookingTimeIfAlreadyExist(bookingId, technicianId, start_time, end_time, function (err, result, message) {
										if (err) {
											res.json({
												error: true,
												message: message,
												mongoose_error: JSON.stringify(err),
												responseCode: 0
											});
											res.end();
											return;
										} else {
											res.json({
												error: false,
												message: 'Booking update Success',
												responseCode: 1
											});
											res.end();
											return;	
										}
									});
								}
							})
						} else {
							res.json({
								error: true,
								message: "Something went wrong to update booking.",
								mongoose_error: JSON.stringify(err),
								responseCode: 0
							});
							res.end();
							return;
						}
					}
				});		
			}
		})
    },
	
	userUpdatedServiceConfirmation: function (req, res, next) { //console.log("technician_serviceupdate");
		//console.log(req.body);
        var bookingId = mongoose.Types.ObjectId(req.body.booking_id) || "";
		var itemUniqId = (req.body.item_uniq_id) ? req.body.item_uniq_id : "";
		var serviceConfirmation = (req.body.service_confirmation) ? req.body.service_confirmation : "";
		
		if(!bookingId || !itemUniqId || !serviceConfirmation){
            res.json({
                error: true,
                message: "Required parameters missing!",
				responseCode: 0
            });
            res.end();
            return;
        }
		
		var Booking = helper.getModel("booking");
		
		if(serviceConfirmation == 'confirmed') {
			var set = {"items.$.service_confirmation": serviceConfirmation};			
						
			Booking.update({
				_id: bookingId,
				"items.item_uniq_id": itemUniqId
			}, {
				$set: set
			}).exec(function (err, numAffected) {
				//console.log(err, numAffected);
				if (err) {
					res.json({
						error: true,
						message: "Something went wrong to update service confirmation.",
						mongoose_error: JSON.stringify(err),
						responseCode: 0
					});
					res.end();
					return;
				} else {
					res.json({
						error: false,
						message: 'Booking update Success',
						responseCode: 1
					});
					res.end();
					return;
				}
			});
		} else {
			_updatedServiceCancel(bookingID, itemID, function(err, result, message){
				if(err){
					res.json({
						error: true,
						message: message,
						mongoose_error: JSON.stringify(err),
						responseCode: 0
					});
					res.end();
					return;
				} else {
					res.json({
						error: false,
						message: 'Booking update Success',
						responseCode: 1
					});
					res.end();
					return;
				}
			})
		}
    },
	
	technicianUpdateAvailability: function(req, res, next){  //console.log('sendOtp');  
        
        var technicianId = (req.body.technician_id) ? mongoose.Types.ObjectId(req.body.technician_id) : ""; 
		var availability = (req.body.available) ? req.body.available : false;
        if(!technicianId) {
            res.json({
                error: true,
                message: "Required parameters missing!",
				responseCode: 0
            });
            res.end();
            return;
        }

        var updateInfo = { is_availability: availability }
        var conditions = { _id: technicianId };
        User.findOneAndUpdate(conditions, {"$set": updateInfo}, {new: true}, function(err, user){
            if(err || !user){
                res.json({
                    error: true,
                    message: "Something went wrong, please try again",
					responseCode: 0
                });
                res.end();
                return;       
            } else {
				res.json({
					error: false,
					message: "Updated successfully",
					result:user,
					responseCode: 1
				});
				res.end();
				return;
            }
        });
    },

	uploadProfilePhoto: function(req, res, next){ console.log("uploadProfilePhoto");
	try{
		var post = req.body;
		//console.log(post)
		
		var userId = (post.user_id) ? mongoose.Types.ObjectId(post.user_id) : ""; 
		var userType = (post.user_type) ? post.user_type : "";
		var fileLength = (req.files) ? req.files.length : 0;
        if(!userId || !userType || fileLength <=0) {
            res.json({
                error: true,
                message: "Required parameters missing!",
				responseCode: 0
            });
            res.end();
            return;
        }
		
		if(userType == 'T'){
			var base_folder = path.join(BASE_URL, "public/uploads/technician");
			var site_url = SITE_PATH + "uploads/technician/";
		} else {
			var base_folder = path.join(BASE_URL, "public/uploads/customer");
			var site_url = SITE_PATH + "uploads/customer/";
		}
		
		_uploadFiles(req, base_folder, function (succeeded, failed) {
			if (!succeeded.length) {
				var message = "Something went wrong to upload profile image.";
				var err_msg = JSON.stringify(makeMongooseErrorMsgArray(err));
				cb(false, message, err_msg);
			} else {
				var updateInfo = { profile_photo: succeeded[0] }
				var conditions = { _id: userId };
				User.findOneAndUpdate(conditions, {"$set": updateInfo}, {new: true}, function(err, user){
					if(err || !user){
						res.json({
							error: true,
							message: "Something went wrong to update profile photo "+JSON.stringify(err),
							responseCode: 0
						});
						res.end();
						return;       
					} else {
						res.json({
							error: false,
							message: "Photo updated successfully",
							result:{
								'image_name':succeeded[0],
								'image_path':site_url+succeeded[0]
							},
							responseCode: 1
						});
						res.end();
						return;
					}
				});
			}
		});
	}catch(err){
		response.success=false,
		response.message="Internal Server Error",
		response.data =null,
		res.send(500).json(response)
	}
	}

}; 

	async function stripePayment(data) {
		
		const customer = await stripe.customers.create({ 
			email: data.stripeEmail, 
			source: data.stripeToken, 
			name: data.userName, 
			address: { 
				line1: data.address, 
				line2: data.floor, 
				city: data.location,
				postal_code: data.postal_code
			} 
		})
		
		if (!customer && !customer.id) {
			throw new Error("Something wrong! didn't get customer id from stripe");
		}
		
		
		const charge = await stripe.charges.create({ 
			amount: data.amount,    // Charing Rs 25 
			description: 'Service app', 
			currency: 'USD', 
			customer: customer.id 
		});
			
		return {
			'customer' : customer,
			'charge' : charge
		}
	}

	// Upload files
	var _uploadFiles = function (req, baseFolder, callback) {

		var files = req.files;
		//console.log("files-", files);
		var total_files = files.length;
		var succeeded = [];
		var failed = [];

		var i = 0;
		each(files, function (file, nextItem) {

			var imgExt = path.extname(file.originalname);
			var splitFile = (file.originalname).split('.');
			var fileName = splitFile[0];
			var imgDest = fileName + "_" + new Date().getTime() + imgExt;
			//console.log(file.path, baseFolder, imgDest)
			_moveFile(file.path, path.join(baseFolder, imgDest), function (err) {
				if (err) {
					console.log("Fileupload Error:", err);
				} else {
					succeeded.push(imgDest);
				}

				if (++i >= total_files) {
					callback(succeeded, failed);
				} else {
					nextItem();
				}
			});
		})
	}

	// Move file to server at specific loation
	var _moveFile = function(oldPath, newPath, callback) {

		fs.rename(oldPath, newPath, function (err) {
			if (err == 'EXDEV') {
				var readStream = fs.createReadStream(oldPath);
				var writeStream = fs.createWriteStream(newPath);

				readStream.on('error', callback);
				writeStream.on('error', callback);
				readStream.on('close', function () {
					fs.unlink(oldPath, callback);
				});
				readStream.pipe(writeStream);
			} else {
				callback();
			}
		});

	}

	var _loadItemInfo = function (bookingID, itemID, callback) {
		var Booking = helper.getModel('booking');
		Booking.aggregate([
			{$match: {
				_id: mongoose.Types.ObjectId(bookingID),
			}},
			{$unwind: "$items"},
			{$match: {
					"items.item_uniq_id": itemID
				}}
		]).exec(callback);  
	};

	var _loadBookingInfo = function (bookingID, callback) {
		var Booking = helper.getModel('booking');
		Booking.findOne({_id: bookingId})
		.exec(callback);  
	};

	var _updatedServiceCancel = function (bookingID, itemID, callback) {

		var Booking = helper.getModel('booking');
		Booking.findOneAndUpdate({
			_id: mongoose.Types.ObjectId(bookingID)
		}, 
		{ $pull: { "items": { item_uniq_id: itemID } } },
		{ multi: true },
		function (err, doc) {  
			if (err) {
				var message = "Something went wrong to update service confirmation.";
				var err_msg = JSON.stringify(err);
				cb(err, null, message)
			} else {
				_loadBookingInfo(bookingID, function (oErr, oResult) {
					if (oErr) {
						var message = "Something went wrong to get booking data.";
						var err_msg = JSON.stringify(oErr);
						cb(oErr, null, message)
					} else {
						if (oResult && Object.keys(oResult).length > 0) {
							var bLength = oResult.items.length;
							var sItems = oResult.items;
							i = 0;
							if (bLength > 0) {
								var booking_total = 0;
								var discount = 0;
								var booking_total_after_discount = 0;
								var total_payable_amount = 0;
								var total_time_duration = 0;

								each(sItems, function (sItem, nextItem) {
									//console.log("cartItems-"+i, cartItem);
									booking_total += sItem.total_booking_amount;
									total_time_duration += sItem.service_duration;

									if (++i >= bLength) {
										
										if(oResult.discount_type == 'percentage'){
											discount = (booking_total*oResult.discount/100);
										} else {
											discount = oResult.discount;
										}
										booking_total_after_discount = booking_total - discount;
										total_payable_amount = (booking_total_after_discount + oResult.tip_amount + oResult.tax + oResult.service_charge);
										
										
										Booking.update({
											"_id": mongoose.Types.ObjectId(bookingID),
										}, {
											$set: {
												"booking_total": booking_total,
												"discount_amount": discount,
												"booking_total_after_discount": booking_total_after_discount,
												"total_payable_amount": total_payable_amount,
												"total_time_duration": total_time_duration
											}
										}, function (err, numAffected) {
											//console.log("Transaction id updated", numAffected);
											if (err) {
												var message = "Something went wrong to update booking";
												var err_msg = JSON.stringify(makeMongooseErrorMsgArray(err));
												cb(err, null, message)
											} else {
												cb(null, numAffected, null);
											}
										})
									} else {
										nextItem();
									}
								})
							} else {
								cb(1, null, "Something went wrong to update")
							}
						} else {
							cb(1, null, "Something went wrong to update")
						}
					}
				});
			}
		});
	}

	var _getTechnician = function (callback) {
		var User = helper.getModel('user');
		User.find({user_type: 'T', is_deleted: {'$ne': true}, is_availability: true},{_id:1, name:1}).sort({_id: 1})
		.exec(function (err, results) {
			if (err) {
				var message = "Something went wrong to find updated timeslot for another user.";
				var error = JSON.stringify(err);
				callback(error, null, message)
			} else {
				callback(null, results, null)
			}
		})
	};

	var _getBookingByTechnician = function (technicianId, start_date, end_date, callback) {
		Booking.aggregate([
			{$match: {
				technician_id: mongoose.Types.ObjectId(technicianId),
			}},
			{$unwind: "$items"},
			{$match: {
				"items.time_slot": {
					'$gte': new Date(start_date),
					'$lt': new Date(end_date)
				}
			}},
			{$group: {
				_id: "$_id", user_id: {$first: '$user_id'}, user_name: {$first: '$user_name'}, 
				items: {$addToSet: "$items"}
			}},
			{$sort: {
				_id: 1
			}}
		])
		.exec(function (oErr, o_results) {
			if (oErr) {
				var message = "Something went wrong to find timeslot for another user.";
				var error = JSON.stringify(oErr);
				callback(error, null, message)
			} else {
				callback(null, results, null)
			}
		});		
	};

	var _updateBookingTimeIfAlreadyExist = function (bookingId, technicianId, startDateTime, endDateTime, callback) {
		
		var Booking = helper.getModel("booking");  
		Booking.aggregate([
			{$match: {
				technician_id: mongoose.Types.ObjectId(technicianId),
				_id: {$ne: mongoose.Types.ObjectId(bookingId)}
			}},
			{$unwind: "$items"},
			{$match: {
				$or: [
					{"items.time_slot": {'$gte': new Date(startDateTime), '$lte': new Date(endDateTime)}},
					{"items.end_time_slot": {'$gte': new Date(startDateTime), '$lte': new Date(endDateTime)}},
					{$and: [
							{"items.time_slot": {'$gte': new Date(startDateTime)}},
							{"items.end_time_slot": {'$lte': new Date(endDateTime)}}
						]
					},
					{$and: [
							{"items.time_slot": {'$lte': new Date(startDateTime)}},
							{"items.end_time_slot": {'$gte': new Date(endDateTime)}}
						]
					}
				]
			}},
			{$group: {
				_id: "$_id", created_at: {$first: '$created_at'}, user_id: {$first: '$user_id'}, user_name: {$first: '$user_name'},
				technician_id: {$first: '$technician_id'}, technician_name: {$first: '$technician_name'}, payment_status: {$first: '$payment_status'}, payment_mode: {$first: '$payment_mode'}, booking_status: {$first: '$booking_status'}, amount_paid: {$first: '$amount_paid'}, total_payable_amount: {$first: '$total_payable_amount'}, tip_amount: {$first: '$tip_amount'}, total_time_duration: {$first: '$total_time_duration'},
				items: {$addToSet: "$items"}
			}},
			{$sort: {
				_id: 1
			}}
		])
		.exec(function (err, results) {
			if (err) {
				var message = "Something went wrong to find updated timeslot for another user.";
				var error = JSON.stringify(err);
				callback(error, null, message)
			} else {
				if(results.length>0){
					var stime = moment(endDateTime).utcOffset(0).format('HH:mm');
					
					Booking.updateOne({
						_id: mongoose.Types.ObjectId(results[0]._id),
						"items.item_uniq_id": results[0].items[0].item_uniq_id
					}, {
						$set: { 
						"items.$.time_slot": new Date(endDateTime),
						"items.$.start_time": stime,
						}
					},  
					function (errors, dbres) {
						//console.log("dbres-", dbres)
						if (errors) {
							var message = "Something went wrong to update booking timeslot of another user.";
							var error = JSON.stringify(errors);
							callback(error, null, message)
						} else {
							// Send notification to customer by technician for update booking time
							var data = {
								"fromUserId": results[0].technicianId,
								"fromUserName": results[0].technicianName,
								"toUserId": results[0].userId,
								"toUserName": results[0].userName,
								"description": "Updated booking time by technician",
								"readStatus": false,
								"notificationType": "update_booking_time",
								"notificationDetails": {
									"booking_id": results[0]._id,
									"item_uniq_id": results[0].items[0].item_uniq_id
								},
							}
							_sendNotification(data, function(nErr, nRes, nMsg){
								if(nErr){
									callback(nErr, null, nMsg)
								} else {
									callback(null, true, null)
								}
							})	
						}
					});		
				} else {
					callback(null, true, null)
				}
			}
		})
	};

	var _sendNotification = function (data, callback) {
		
		var Notification = helper.getModel('notification');
		var posted_data = {};
		posted_data.from_user_id = data.fromUserId;
		posted_data.from_user_name = data.fromUserName;
		posted_data.to_user_id = data.toUserId;
		posted_data.to_user_name = data.toUserName;
		posted_data.description = data.description; 
		posted_data.read_status = data.readStatus;
		posted_data.notification_type = data.notificationType;
		posted_data.notification_details = data.notificationDetails;
		
		var newNotification = new Notification(posted_data);
		newNotification.save(function(err, dbres) {
			if(err){
				var message = "Something went wrong to send notification";
				var err_msg = JSON.stringify(makeMongooseErrorMsgArray(errors));
				callback(err, null, message)
			} else {
				// return the information including token as JSON
				callback(null, dbres, null)
			}
		})  
	};