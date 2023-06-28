const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const serviceSchema   = new Schema({
    title:{type: String,required: true},
	description:{type: String,required: true},
	sub_service: [{
		title:{type: String,required: true},
		description:{type: String,required: true},
	}],
	price: {type: String},
	commision_margin: {type: String},
	commision_amount: {type: String},
	cost: {type: String},
    icon: {type: String},
    status: {type: String,enum: ['active','deleted'],default:'active'},
},
{timestamps: true});


module.exports  = mongoose.model('services', serviceSchema);