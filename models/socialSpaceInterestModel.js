const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let socialSpaceModelInterestSchema = new Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    socailSpace_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'socalSpaceNotification'
    },
    interest: { type: String, enum: ['Yes', 'No'], default: "" },
    status: { type: String, enum: ['active', 'deleted'], default: 'active' },
}, { collection: 'socalSpaceInterest', timestamps: true });
module.exports = mongoose.model('socalSpaceInterest', socialSpaceModelInterestSchema);


