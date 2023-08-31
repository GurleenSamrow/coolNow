(function () {
	var mongoose = require('mongoose');

	var packageSchema = new mongoose.Schema({
		package_name: {
			type: String,
			trim: true,
			//required: true
		},
		description: {
			type: String,
			//required: false,
			trim: true
		},
		package_price: {
			type: Number,
			//required: true
		},
		items: {
			type: Array, // list of services 
			//required: true
		},
		package_status: {
			type: Boolean,
			//required: true,
			default: true
		},
		is_deleted: {
			type: Boolean,
			//required: false,
			default: false
		},
		created_at: { type: Date, default: Date.now },
 		updated_at: { type: Date, default: Date.now }
	});

	var Package = mongoose.model('package', packageSchema);

	module.exports = Package;
})();
