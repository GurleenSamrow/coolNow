(function () {
    var mongoose = require('mongoose');
    var manualBookingSchema = new mongoose.Schema({
        userName: {
            type: String,
            trim: true,
            required: true
        },
        technician_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			required: true

		},
        email: {
            type: String,
            trim: true,
            lowercase: true,
            validate: {
                validator: function (v) {
                    return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(v);
                },
                message: '{VALUE} is not a valid email id!'
            },
        },
        phone: {
            type: Number,
            trim: true,
            required: [true, 'phone is required']
        },
        address: {
            type: String,
            trim: true,
            required: [true, 'Addess is required']
        },
        date: {
            type: Date,
            trim: true,
            required: [true, 'date is required']
        },
        bookingSlot: {
            type: String,
            trim: true,
            required: [true, 'bookingSlot is required']
        },
        chooseServices: {
            type: String,
            trim: true,
            required: [true, 'choose Services is required']
        },
        note: {
            type: String,
            trim: true,
            required: [true, 'Note is required']
        },
        created_date: { type: Date, default: Date.now }	,
        updated_date: { type: Date, default: Date.now }	

    });
    var manualBooking = mongoose.model('manualBooking', manualBookingSchema);
	
    module.exports = manualBooking;
})();
