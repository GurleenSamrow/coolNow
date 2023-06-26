(function(){
	var path = require('path');
	var crypto = require('crypto');
	function getModel(model){
		var modelFile = path.join(path.dirname(require.main.filename), 'models', model + '.js');
		return require(modelFile);
	}

	function password(pass){
		return crypto.createHash('md5').update(pass).digest('hex');
	}

	function getRandomNumber(range)
	{
		return Math.floor(Math.random() * range);
	}

	function getRandomNum()
	{
		var chars = "0123456789";
		return chars.substr( getRandomNumber(10), 1 );
	}

	function getRandomChar()
	{
		var chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
		return chars.substr( getRandomNumber(26), 1 );
	}

	function randomID(size)
	{
		var str = "";
		for(var i = 0; i < size; i++)
		{
			if(i<3){
				str += getRandomChar();
			}else{
				str += getRandomNum();
			}
			
		}
		return str;
	}
	
	function randomNumericID(size)
	{
		var str = "";
		for(var i = 0; i < size; i++)
		{
			str += getRandomNum();
			
		}
		return str;
	}
	
	function getSiteUrl(){
		return SITE_URL;
//		return "http://52.57.3.29:3000";
	}

	function getUniqueItemId(){
		
		var now = new Date();
		timestamp = now.getFullYear().toString(); // 2011
		var timestamp_month=now.getMonth()+1;
		timestamp += (timestamp_month < 9 ? '0' : '') + timestamp_month.toString(); // JS months are 0-based, so +1 and pad with 0's
		timestamp += ((now.getDate < 10) ? '0' : '') + now.getDate().toString(); // pad with a 0
		timestamp +=now.getHours();
		timestamp +=now.getMinutes();
		timestamp +=now.getSeconds();
		timestamp +=now.getMilliseconds();
		timestamp +=Math.floor(1000 + Math.random() * 9000);
		return "item-"+timestamp;
		
	}
	
	function empty(e) {
		switch (e) {
			case "":
			case 0:
			case "0":
			case null:
			case 'null':
			case 'undefined':
			case undefined:
			case false:
			case typeof this == "undefined":
			  return true;
			default:
			  return false;
		}
	}
	
	function distanceCalc(lat1, lon1, lat2, lon2)  //calcCrow
    {
      var R = 6371; // km
      var dLat = toRad(lat2-lat1);
      var dLon = toRad(lon2-lon1);
      var lat1 = toRad(lat1);
      var lat2 = toRad(lat2);

      var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2); 
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
      var d = R * c;
      return d;
    }

    // Converts numeric degrees to radians
    function toRad(Value) 
    {
        return Value * Math.PI / 180;
    }
	
	
	module.exports = {
		getModel: getModel,
		password: password,
		randomID:randomID,
		randomNumericID:randomNumericID,
		getSiteUrl: getSiteUrl,
		getUniqueItemId:getUniqueItemId,
		empty:empty,
		distanceCalc: distanceCalc
	};
})();
