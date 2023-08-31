const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', },
    technicianId: { type: mongoose.Schema.Types.ObjectId, ref: 'user',  },
    value: { type: Number }
});

module.exports = mongoose.model('rating', ratingSchema);
