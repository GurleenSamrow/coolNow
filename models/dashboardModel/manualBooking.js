(function () {
    var mongoose = require('mongoose');
    var leadSchema = new mongoose.Schema({
        userId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'user',
                required: [true, 'UserId is required'] 
        },
        technician_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			required: false
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
            type: string,
            trim: true,
            required: [true, 'Addess is required']
        },
        date: {
            type: string,
            trim: true,
            required: [true, 'date is required']
        },
        bookingSlot: {
            type: string,
            trim: true,
            required: [true, 'bookingSlot is required']
        },
        chooseServices: {
            type: string,
            trim: true,
            required: [true, 'chooseServices is required']
        },
        note: {
            type: string,
            trim: true,
            required: [true, 'Note is required']
        },
        created_date: { type: Date, default: Date.now }	,
        updated_date: { type: Date, default: Date.now }	

    });
    var leadUser = mongoose.model('leadSource', leadSchema);
	
    module.exports = leadUser;
})();
