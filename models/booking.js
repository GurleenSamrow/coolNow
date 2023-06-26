(function () {
	var mongoose = require('mongoose');

	var bookingSchema = new mongoose.Schema({
		user_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			required: true
		},
		user_name: {
			type: String,
			required: true
		},
		technician_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			required: false
		},
		technician_name: {
			type: String,
			required: false
		},
		user_latitude: {
			type: String,
			trim: true,
			required: false,
			default: ""
		},
		user_longitude: {
			type: String,
			trim: true,
			required: false,
			default: ""
		},
		booking_total: {
			type: Number,
			required: true,
			default: 0
		},
		promo_code: {
			type: String,
			required: false
		},
		discount: {
			type: Number,
			required: false,
			default: 0
		},
		discount_type: {
			type: String,
			required: false,
			default: 'fixed'
		},
		discount_amount: {
			type: Number,
			required: false,
			default: 0
		},
		booking_total_after_discount: {
			type: Number,
			required: true,
			default: 0
		},
		delivery_location: {
			type: String,
			required: false
		},
		tip_amount: {
			type: Number,
			required: false
		},
		tax: {
			type: Number,
			required: false
		},
		service_charge: {
			type: Number,
			required: false
		},
		total_payable_amount: {
			type: Number,
			required: false
		},
		total_time_duration: {
			type: Number,
			required: false,
			default: 0
		},
		purchased_package: {
			type: mongoose.Schema.Types.Mixed, // "name":"package1", "amount": 400
			required: false
		},
		amount_paid: {
			type: mongoose.Schema.Types.Mixed, // "total_paid" : 65, "cash" : 50, "online" : 5,
			required: false
		},
		payment_status: {
			type: String,
			required: true,
			default: "pending" // pending, complete, partially
		},
		payment_mode: {
			type: String,
			required: false   // cash, online, both
		},
		items: {
			type: [], // booking details     // service_confirmation = false
			required: true
		},
		booking_status: {
			type: String,
			required: true,
			default: 'pending' //"pending", "leavingforjob", "jobstarted", "jobcompleted", "cancelled"
		},
		booking_status_date: { type: Date, default: Date.now },
		timezone_created_at: {
			type: Date,
			required: false
		},
		created_at: { type: Date, default: Date.now },
		updated_at: { type: Date, default: Date.now }
	});

	var Booking = mongoose.model('booking', bookingSchema);
	module.exports = Booking;
})();