const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const stockSchema   = new Schema({
    selectSku:{type: String},
	selectQuantity:{type: String},
	date: {type: Date},
},
{timestamps: true});


module.exports  = mongoose.model('stock', stockSchema);