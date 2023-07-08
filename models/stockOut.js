const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const stockOutSchema   = new Schema({
    jobOrder:{type: String},
	receiverName:{type: String},
	jobNature: {type: String},
    issuedBy:{type: String},
    totalMaterialCost:{type: String},
},
{timestamps: true});


module.exports  = mongoose.model('stockOut', stockOutSchema);