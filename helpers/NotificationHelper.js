var nodemailer = require('../node_modules/nodemailer');
var smtpTransport = require('../node_modules/nodemailer-smtp-transport');
var Config = require('../config/config');
module.exports = NotificationHelper = {

	ucfirst : function(string){

		if(!string){
			throw new Error('The string value is required');
		}

		return string.charAt(0).toUpperCase() + string.slice(1);
	},
	
	titleCase : function(string){

		if(!string){
			throw new Error('The string value is required');
		}
 
		return string.replace(/\w\S*/g,function(txt) {return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
	},

	send : function(type,notification,cb){

		return new Promise((resolve,reject) => {

			if(!type || Object.keys(notification).length == 0){
				reject('Invalid data provided : ');
			}else{
				resolve();
			}
		})
		.then(function(response){

			return new Promise((resolve,reject) => {

				switch(type){
					case 'email':
						NotificationHelper.sendEmail(notification,function(error,success){
							if(success){
								resolve(success);
							}else{
								reject('Failed to send email! : ' + error.toString());
							}
						})
						break;
					case 'sms':
						NotificationHelper._sendSMS(notification,function(error,success){
							if(success){
								resolve(success);
							}else{
								reject('Failed to send sms! : ' + error.toString());
							}
						})
						break;
					case 'smsToAll':
						NotificationHelper._sendSMSToAll(notification,function(error,success){
							if(success){
								resolve(success);
							}else{
								reject('Failed to send sms! : ' + error.toString());
							}
						})
						break;	
					default:
						reject('Invalid method is chossen for sending emails!');
						break;
				}
			})
		})
		.then(function(response){
			cb(response);
		})
		.catch(function(error){
			//console.log("\n\n Error in sending notification : ",error);
			cb(false);
		})
	},

	sendEmail : function(emailObj,cb){
		return new Promise((resolve,reject) => {

			if(typeof(emailObj['to']) == 'undefined' || typeof(emailObj['subject']) == 'undefined' || typeof(emailObj['body'])  == 'undefined')
			{
				reject('Invalid data provided for sending email!');
			}else{
				resolve();
			}
		})
		.then(function(response){

			return new Promise((resolve,reject) => {
				
				// validate email addresses
				if((emailObj['to']).match(/^(\s?[^\s,]+@[^\s,]+\.[^\s,]+\s?,)*(\s?[^\s,]+@[^\s,]+\.[^\s,]+)$/g))
				{
					resolve();
				}else{
					reject('Invalid email address provided!')
				}
			})
		})
		.then(function(response){

			return new Promise((resolve,reject) => {

				// create the nodemailer instance

				var transporter = nodemailer.createTransport({
				maxConnections: 3, 
				pool: true,        
                host: Config.SMTPHOST, // hostname
                secureConnection: false, // TLS requires secureConnection to be false
                port: Config.SMTPPORT, // port for secure SMTP
                tls: {
                   ciphers:'SSLv3'
                },
                auth: {
                    user: Config.SMTPUSERNAME,
                    pass: Config.SMTPPASSWORD
                } ,
				connectionTimeout: 10000,
				greetingTimeout: 5000,
				socketTimeout: 5000,
				logger: false,
				debug: false

            });

            // setup e-mail data, even with unicode symbols
				//console.log("emailObjfrom-",emailObj['from'], typeof(emailObj['from']));
				var fromEmail = (typeof(emailObj['from']) == 'undefined')?Config.SMTPFROM:emailObj['from'];
				
			    var mailOptions = {
					from: fromEmail, 
					to: emailObj.to,
					subject: emailObj.subject,
					html: emailObj.body
				}; 
			    //console.log("clients from db  >>> ",emailObj.to);
				
			    transporter.sendMail(mailOptions, function (error, info) {
			        if (error) {
			            cb(error.toString(),null);
			        	//console.log("mail sent error to these clients >>> ",mailOptions.to);
			        	//console.log("mail sent error to >>> ",error);

			        } else {
			        	//console.log("mail sent successfully to these clients >>> ",mailOptions.to);
			            cb(null, true)
			        };
			    });
			})
		})
		.then(function(response){
			cb(null,true);
		})
		.catch(function(error){
			cb(error.toString(),null);
		})
	},

	_sendSMS : function(msgObj,cb){

		return new Promise((resolve,reject) => {
			// check if receiver contact number is entered
			if(
				typeof(msgObj.contact_number) == 'undefined' 
				|| typeof(msgObj.country_code) == 'undefined' 
				|| typeof(msgObj.message) == 'undefined'){
				reject('Invalid data provided to send sms.');
			}else{
				resolve();
			}
		})
		.then(function(response){
			return new Promise((resolve,reject) => {
				// validate the phone number
				var regex = /^[0-9]{10}$/;

				if((msgObj.contact_number).match(regex)){
					resolve();
				}else{
					reject('Invalid contact number provided!');
				}
			})
		})
		.then(function(response){
			return new Promise((resolve,reject) => {
				
				// check country code is provided
				if(msgObj.country_code == ''){
					reject('Invalid country code');
				}else{
					resolve();
				}
			})
		})
		.then(function(response){
			return new Promise((resolve,reject) => {
				
				// validate message field
				if(msgObj.message == ''){
					reject('Empty message sms can not be sent out.');
				}else{
					resolve();
				}
			})
		})
		.then(function(response){
			return new Promise((resolve,reject) => {
				// send sms to the user
				let plivo = require('plivo');
				let client = new plivo.Client('MAMZC0NZM1YTGXNJIWND','Yzg0MmU1YjE3NzMzMmYzZjQ3NjNjMDg0NWIwMTc4');
				 
				
				client.messages.create(
					'+1 608-439-4895',
					msgObj.country_code + msgObj.contact_number,
					msgObj.message 
				).then(function(message_created) {
					//console.log('message created : ',msgObj.country_code + msgObj.contact_number, message_created);
				  	resolve();
				})
				.catch(function(error){
					//console.log('Message error : ',msgObj.country_code + msgObj.contact_number,error);
					reject(error);
				});
				
				resolve();
			})
		})
		.then(function(response){
			cb(null,true);
		})
		.catch(function(error){
			cb(error.toString(),null);
		})
	},
	
	_sendSMSToAll : function(msgObj,cb){

		return new Promise((resolve,reject) => {
			// check if receiver contact number is entered
			if(
				typeof(msgObj.contact_number) == 'undefined' 
				|| typeof(msgObj.message) == 'undefined'){
				reject('Invalid data provided to send sms.');
			}else{
				resolve();
			}
		})
		.then(function(response){
			return new Promise((resolve,reject) => {
				// validate the phone number
				var regex = /^[0-9]{10}$/;

				if((msgObj.contact_number).match(regex)){
					resolve();
				}else{
					reject('Invalid contact number provided!');
				}
			})
		})
		.then(function(response){
			return new Promise((resolve,reject) => {
				
				// validate message field
				if(msgObj.message == ''){
					reject('Empty message sms can not be sent out.');
				}else{
					resolve();
				}
			})
		})
		.then(function(response){
			return new Promise((resolve,reject) => {
				// send sms to the user
				let plivo = require('plivo');
				let client = new plivo.Client('MAMZC0NZM1YTGXNJIWND','Yzg0MmU1YjE3NzMzMmYzZjQ3NjNjMDg0NWIwMTc4');
				 
				
				client.messages.create(
					'+1 608-439-4895',
					msgObj.contact_number,
					msgObj.message
				).then(function(message_created) {
					console.log('message created : ', msgObj.contact_number, message_created);
				  	resolve();
				})
				.catch(function(error){
					console.log('Message error : ',msgObj.contact_number, error);
					reject(error);
				});
				
				resolve();
			})
		})
		.then(function(response){
			cb(null,true);
		})
		.catch(function(error){
			cb(error.toString(),null);
		})
	}
}