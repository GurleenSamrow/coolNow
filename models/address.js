(function () {
	var mongoose = require('mongoose');

	var addressSchema = new mongoose.Schema({
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			required: [true, 'user ID is required']
		},
		name: {
			type: String,
			trim: true,
			required: false
		}, 
		phone: {
			type: String,
			trim: true,
			required: false
		}, 
		pincode: {
			type: String,
			trim: true,
			required: true
		}, 
		location: {
			type: String,
			trim: true,
			required: true
		},
		addressType: {
			type: String,
			trim: true,
			required: true
		},
		block_number: {
			type: String,
			trim: true,
			required: true
		},
		street_number: {
			type: String,
			trim: true,
			required: true
		},
		building_name: {
			type: String,
			trim: true,
			required: true
		},
		floor: {
			type: String,
			trim: true,
			required: true
		},
		unit: {
			type: String,
			trim: true,
			required: true
		},
		lat: {
			type: String,
			trim: true,
			required: false
		},
		lng: {
			type: String,
			trim: true,
			required: false
		},
		user_type: {
			type: String,
			trim: true,
			required: true,
			default: 'C' //'C' for customer, T for technician
		},
		status: {
			type: Boolean,
			required: true,
			default: true
		},
		notes: {
			type: String,
			trim: true,
			required: false
		},
		is_primary: {
			type: Boolean,
			required: true,
			default: false
		},
		is_deleted: {
			type: Boolean,
			required: true,
			default: false
		},
		created_at: Date,
		updated_at: Date
	});

	// on every save, add the date
	addressSchema.pre('save', function (next) {
		// get the current date
		var currentDate = new Date();

		// change the updated_at field to current date
		this.updated_at = currentDate;

		// if created_at doesn't exist, add to that field
		if (!this.created_at)
			this.created_at = currentDate;

		next();
	});
	var Address = mongoose.model('address', addressSchema);

	module.exports = Address;
})();