const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const zonesSchema   = new Schema({
    name: {type: String},
    zoneId: {type: String},
    district: {
        type: Array,
        trim: true,
    }
},
{timestamps: true});


module.exports  = mongoose.model('zones', zonesSchema);