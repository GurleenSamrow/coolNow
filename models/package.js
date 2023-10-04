(function () {
	var mongoose = require('mongoose');

	var packageSchema = new mongoose.Schema({
		package_name: {
			type: String,
			trim: true,
 		},
		description: {
			type: String,
 			trim: true
		},
		type: {
			type: String,
 		},
		subServicesId: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'service.sub_service',
		},
		services_count: {
			type: Number,
 		},
		unit_price: {
			type: Number,
 		},
		package_price: {
			type: Object, 
 		},
		features: {
			type: Array, 
 		},
		package_status: {
			type: Boolean,
 			default: true
		},
		is_deleted: {
			type: Boolean,
 			default: false
		},
		created_at: { type: Date, default: Date.now },
 		updated_at: { type: Date, default: Date.now }
	});

	var Package = mongoose.model('package', packageSchema);

	module.exports = Package;
})();
