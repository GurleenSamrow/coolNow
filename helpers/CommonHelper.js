var moment = require('moment');
module.exports = {

    getSettlementTZMins(timezone) {
        var tzType = timezone.charAt(0);
        timezone = timezone.substr(1);
        var timezoneArr = timezone.split(":");
        var tzHour = timezoneArr[0];
        var tzMin = timezoneArr[1];
        if (tzType == "-") {
			var sattlementTime = 0 - parseInt((parseInt(tzHour) * 60) + parseInt(tzMin));
        } else {
            var sattlementTime = parseInt((parseInt(tzHour) * 60) + parseInt(tzMin));
        }
        return sattlementTime;
    },
	
    getUTCTimeTZFormat(timestring, settlementTime) {
		//console.log("timestring-", timestring, settlementTime, typeof timestring);
		if(typeof timestring == 'object'){
			var timeSlotWithTZ = timestring;
		} else {
			var timestringUpdated = (timestring.toString()).replace(/\//g, "-");
			var timeSlotWithTZ = moment(timestringUpdated).utcOffset(settlementTime).format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
		}
		//console.log("timeSlotWithTZ-", timeSlotWithTZ);
		
        return timeSlotWithTZ;
    }
	
};





































































































































