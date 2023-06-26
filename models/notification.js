(function(){
  var mongoose = require('mongoose');
  var notificationSchema = new mongoose.Schema({
    from_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
	from_user_name: {
		type: String,
		trim: true,
		required: [true, 'name is required'] 
	},
    to_user_id: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
	to_user_name: {
		type: String,
		trim: true,
		required: [true, 'name is required'] 
	},
    description: {
		type: String,
		required: true
    },
    read_status: {
		type: Boolean,
		required: true,
		default: false
    },
    notification_type: {
		type: String,
		required: false,
		default: 'message' // booking, update_booking, update_booking_time
    },
	notification_details: {
		type: mongoose.Schema.Types.Mixed,
		required: false,
		default: {}
    },
    created_at: Date
  });
  // on every save, add the date
  notificationSchema.pre('save', function(next) {
    // get the current date
    var currentDate = new Date();

    // if created_at doesn't exist, add to that field
    if (!this.created_at)
      this.created_at = currentDate;

    next();
  });
  
  var Notification = mongoose.model('notification', notificationSchema);
  module.exports = Notification;
})();