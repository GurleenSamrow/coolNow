(function(){
	var mongoose = require('mongoose');

	var feedbackSchema = new mongoose.Schema({
		user_id: {
		  type: mongoose.Schema.Types.ObjectId,
		  required: true
		},
		team_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true
		},
 		technician_ids: {
			type: Array,
			required: true
		},
		booking_id: {
			type: mongoose.Schema.Types.ObjectId,
			required: true
		},
		technician_attitude: {
			type: Number,
			required:true
		},
		overall_workmanship: {
			type: Number,
			required:true
		},
		job_cleaniness: {
			type: Number,
			required:true
		},
		avg_rating: {
			type: Number,
			required:true
		},
		kpi_factor: {
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