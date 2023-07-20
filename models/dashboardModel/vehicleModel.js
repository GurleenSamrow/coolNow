const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const vehiclechema   = new Schema({
    vehicleName:{type: String},
	vehicleBrand:{type: String},
	driver: {type: Array},
},
{timestamps: true});


module.exports  = mongoose.model('vehicle', vehiclechema);