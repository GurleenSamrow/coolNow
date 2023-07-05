(function () {
    var mongoose = require('mongoose');
    var userSchema = new mongoose.Schema({
        name: {
            type: String,
            trim: true,
            required: [true, 'name is required'] 
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
		gender: {
            type: String,
            trim: true,
            required: false,
			default: '',
        },
		phone: {
            type: Number,
            trim: true,
            //required: [true, 'phone is required']
        },
        password: {
            type: String,
            trim: true,
            required: [true, 'Password is required']
        },
        user_type: {
            type: String,
            trim: true,
            required: true,
            default: 'C' //'C' for customer, T for technician
        },
		track_aircon: {
			type: mongoose.Schema.Types.Mixed, 
			required: false
		},
		device_token: {
            type: String,
            trim: true,
        },
		device_id: {
            type: String,
            trim: true,
        },
		device_type: {
            type: String,
            trim: true,
        },
		otp: {
            type: String,
            trim: true,
        },
        is_deleted: {
            type: Boolean,
            required: true,
            default: false
        },
		is_availability: {
            type: Boolean,
            default: true
        },
		profile_photo: {
            type: String,
            trim: true,
			required: false,
			default: ''
        },
        address: [{
            unitCode :{  type: String,trim: true},
            houseNumber :{  type: String,trim: true},
            postalCode :{  type: String,trim: true}
           }],
        marketPlace: {
            type: Array,
            trim: true,
            //required: [true, 'MarketPlace is required']
        },
        alias: {
            type: String,
            trim: true,
            //required: [true, 'Alias is required']
        },
        leadSource: {
            type: String,
            trim: true,
            //required: [true, 'LeadSource is required']
        },
        designation: {
            type: String,
            trim: true,
        },
        skill: {
            type: Array,
            //required: [true, 'Alias is required']
        },
        created_date: { type: Date, default: Date.now }	,
        updated_date: { type: Date, default: Date.now }	

    });
    // on every save, add the date
    // userSchema.pre('save', function (next) {
        // // get the current date
        // var currentDate = new Date();

        // // change the updated_at field to current date
        // this.updated_at = currentDate;

        // // if created_at doesn't exist, add to that field
        // if (!this.created_at)
            // this.created_at = currentDate;

        // next();
    // });
    var User = mongoose.model('user', userSchema);
	
    module.exports = User;
})();
