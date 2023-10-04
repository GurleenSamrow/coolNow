const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userCartSchema   = new Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
    },
    servicesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'service',
    },
    subServicesId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'service.sub_service',
    },
    packageId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'package',
    },
    title: {
        type: String
    },
    price: {
        type: String
    },
    price_2: {
        type: String
    },
    numberOfunits: {
        type: String
    },
    image: {
        type: String
    },
    video: {
        type: String
    },
    comments: {
        type: String
    }
},
{timestamps: true});


module.exports  = mongoose.model('cart', userCartSchema);