const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const districtSchema   = new Schema({
    postal_district: {type: String},
    postal_sectors: {
        type: Array,
        trim: true,
    },
    locations: {
        type: Array,
        trim: true,
    }
},
{timestamps: true});


module.exports  = mongoose.model('districts', districtSchema);