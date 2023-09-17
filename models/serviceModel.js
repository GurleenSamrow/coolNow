const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const serviceSchema   = new Schema({
    title: {type: String},
	description: {type: String},
	image: {type: String},
	banner_image: {type: String},
	price: {type: String},
	duration: {type: String},
	price_2: {type: String},
	duration_2: {type: String},
	cost: {type: String},
	commision_margin: {type: String},
	commision_amount: {type: String},
	sub_service: [{
		title:{type: String},
		description:{type: String},
		image:{type: String},
		price: {type: String},
		duration: {type: String},
		price_2: {type: String},
		duration_2: {type: String},
		cost:{type: String},
	}],
	status: {type: String,enum: ['active', 'inactive'], default: 'active'},
},
{timestamps: true});

module.exports  = mongoose.model('service', serviceSchema);