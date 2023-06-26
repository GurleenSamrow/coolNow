(function () {
    var mongoose = require('mongoose');
    var userSchema = new mongoose.Schema({
        name: {
            type: String,
            trim: true,
            //required: [true, 'name is required'] 
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
            //required: true,
		
        },
		phone: {
            type: Number,
            trim: true,
            //required: [true, 'phone is required']
        },
        password: {
            type: String,
            trim: true,
            //required: [true, 'Password is required']
        },
        marketPlace: {
            type: String,
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
		address: [{
         unitCode :{  type: String,trim: true},
         houseNumber :{  type: String,trim: true},
         postalCode :{  type: String,trim: true}
        }],
        is_deleted: {
            type: Boolean,
            required: true,
            default: false
        },
		
		profile_photo: {
            type: String,
            trim: true,
			required: false,
			default: ''
        },
        created_date: { type: Date, default: Date.now }	,
        updated_date: { type: Date, default: Date.now }	

    });
    var ManualUser = mongoose.model('ManualUser', userSchema);
	
    module.exports = ManualUser;
})();
