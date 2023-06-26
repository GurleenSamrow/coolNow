(function () {
	var mongoose = require('mongoose');

	var serviceSchema = new mongoose.Schema({
		name: {
			type: String,
			trim: true,
			required: true
		},
		sku: {
			type: String, 
			trim: true,
			required: false,
		},
		description: {
			type: String,
			required: false,
			trim: true
		},
		service_period: {
			type: String,
			required: false
		},
		amount: {
			type: String,
			required: false
		},
		status: {
			type: Boolean,
			required: true,
			default: true
		},
		is_deleted: {
			type: Boolean,
			required: true,
			default: false
		},
		created_at: { type: Date, default: Date.now }	
	});

	var Service = mongoose.model('service', serviceSchema);

	module.exports = Service;
})();
