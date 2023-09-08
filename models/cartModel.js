const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userCartSchema   = new Schema({
    Services: [{
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    servicesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'service',
    },
    subServicesData: [{
		title:{type: String},
		description:{type: String},
		cost:{type: String},
		image:{type: String},
        numberOfunits:{type: String},
        video: {type: String},
        comment: {type: String},
	}],
}]
   
   
},
{timestamps: true});


module.exports  = mongoose.model('cart', userCartSchema);