(function(){
	var mongoose = require('mongoose');

	var feedbackSchema = new mongoose.Schema({
		user_id: {
		  type: mongoose.Schema.Types.ObjectId,
		  required: true
		},
		user_name: {
			type: String,
			trim: true,
			required: [true, 'name is required'] 
		},
		technician_id: {
		  type: mongoose.Schema.Types.ObjectId,
		  required: true
		},
		technician_name: {
			type: String,
			trim: true,
			required: [true, 'name is required'] 
		},
		service_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'service',
			required: true
		},
		booking_id: {
			type: mongoose.Schema.Types.ObjectId,
			//ref: 'booking',
			//required: true
		},
		rating: {
			type: Number,
			required:true
		},
		feedback_message: {
			type: String,
			required:false,
			trim:true
		},
		created_at: { type: Date, default: Date.now }
	});

	var Feedback = mongoose.model('feedback', feedbackSchema);

	module.exports = Feedback;
	
})();