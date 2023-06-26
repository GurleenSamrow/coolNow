(function () {
	var mongoose = require('mongoose');

	var addressSchema = new mongoose.Schema({
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			required: [true, 'user ID is required']
		},
		phone: {
			type: String,
			trim: true,
			required: false
		},  
		address: {
			type: String,
			trim: true,
			required: true
		},
		addressType: {
			type: String,
			trim: true,
			required: true
		},
		city: {
			type: String,
			trim: true,
			required: true
		},
		pincode: {
			type: String,
			trim: true,
			required: true
		},
		lat: {
			type: String,
			trim: true,
			required: true
		},
		lng: {
			type: String,
			trim: true,
			required: true
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