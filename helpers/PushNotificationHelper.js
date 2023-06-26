var PushNotification = require('../node_modules/push-notification');
var path = require('../node_modules/path');
var DeviceType = PushNotification.DeviceType;
//cert: path.resolve('/var/www/html/certs/SwapRetailCerDev.pem'),
//key: path.resolve('/var/www/html/certs/SwapRetailDevPush.pem')
module.exports = {
	getConnection: function (conf) {
		return PushNotification.init({
            apn: {
                cert: path.resolve('/var/www/html/server/certs/pushcert.pem'),
                key: path.resolve('/var/www/html/server/certs/key.pem'),
                production: false
            },
            fcm: {
                apiKey: 'AIzaSyB_GbjmPjT5FjRDDKHpsCz5nawy_HLteUM'
            }
        });
	},

	//Init Function
	send: function (device, token, title, message, badge, payload) {
		var DeviceToNotify = (device == "iphone") ? DeviceType.IOS : DeviceType.ANDROID;
		var sound = "dong.aiff";
		PushNotification.pushSingle(DeviceToNotify, token, title, message, badge, sound, payload);
		PushNotification.push();
	},
	
	sendMultiple: function (tokens, payload) {
		var sound = "dong.aiff";
		
		if (tokens.length > 0) {
			tokens.forEach(function(row) {
				var DeviceToNotify = (row.device == "iphone") ? DeviceType.IOS : DeviceType.ANDROID;
				PushNotification.pushSingle(DeviceToNotify, row.token, row.title, row.message, row.badge, sound, payload);
			});
			
			PushNotification.push();
		}
	},

	//Init Function
	broadcast: function (tokens, title, message, badge, payload) {
		var sound = "dong.aiff";
		
		if (tokens.length > 0) {
			PushNotification.prepare(title, message, badge, sound, payload);
			
			tokens.forEach(function(row) {
				var DeviceToNotify = (row.device == "iphone") ? DeviceType.IOS : DeviceType.ANDROID;
				PushNotification.addTarget(DeviceToNotify, row.token);
			});
			
			PushNotification.push();
		}
	}
};