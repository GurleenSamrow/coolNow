const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const serviceSchema   = new Schema({
    title:{type: String},
	description:{type: String},
	sub_service: [{
		title:{type: String},
		description:{type: String},
		cost:{type: String},
		image:{type: String},
	}],
	price: {type: String},
	commision_margin: {type: String},
	commision_amount: {type: String},
	cost: {type: String},
	icon:{type:String},
    status: {type: String,enum: ['active','deleted'],default:'active'},
},
{timestamps: true});


module.exports  = mongoose.model('service', serviceSchema);