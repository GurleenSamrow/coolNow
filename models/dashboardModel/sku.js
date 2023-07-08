const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const skuSchema   = new Schema({
    skuNumber:{type: String},
	name:{type: String},
	supplier: {type: String},
	category: {type: Array},
	description: {type: String},
	cost: {type: String},
    costwithgst: {type: String},
},
{timestamps: true});


module.exports  = mongoose.model('sku', skuSchema);