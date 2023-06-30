const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const supplierSchema   = new Schema({
    companyName:{type: String},
	contactPerson:{type: String},
	mobileNumber: {type: String},
	uenNumber: {type: String},
	email: {type: String},
	address: {type: String},
    notes: {type: String},
},
{timestamps: true});


module.exports  = mongoose.model('supplier', supplierSchema);