const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let socialSpaceModelNotificationSchema = new Schema({
    description: {
        required: true,
        type: String
    },
    added_by: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    date: {
        required: true,
        type: String
    },
    time: {
        required: true,
        type: String
    },
    location: {
        required: true,
        type: String
    },
    notes: {
        required: true,
        type: String
    },
    title: {
        required: true,
        type: String

    },
    image: {
        required: false,
        type: String
    },
    social_space_status: {
        required: true,
        type: Number,
        default: 0  	 // 1 for I'm in , 2 for no thanks, 0 for nothing
    },
    status: { type: String, enum: ['active', 'deleted'], default: 'active' },
}, { collection: 'socialSpaceNotification', timestamps: true });
module.exports = mongoose.model('socalSpaceNotification', socialSpaceModelNotificationSchema);

