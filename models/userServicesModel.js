const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userServicesSchema   = new Schema({
    servicesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'service',
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    numberOfunits: {type: String},
    video: {type: String},
    image: {type: String},
    comments: {type: String},
},
{timestamps: true});


module.exports  = mongoose.model('userServices', userServicesSchema);