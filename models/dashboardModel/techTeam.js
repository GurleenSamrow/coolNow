(function () {
    var mongoose = require('mongoose');
    var leadSchema = new mongoose.Schema({
        memberId: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'user',
            required: [true, ' memberId is required'] 
        }],
        teamNme: {
            type: String,
            trim: true,
            required: [true, 'TeamName is required'] 
        },
        days: {
            type: Array,
            trim: true,
            required: [true, 'Days is required'] 
        },

        Vehicle: {
            type: String,
            trim: true,
            required: [true, 'Vehicle is required']
        },
        selectZone: {
            type: Array,
            trim: true,
            required: [true, 'selectZone is required']
        },
        SelectPriority: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'priority',
            required: [true, 'SelectPriority is required']
        }],
        created_date: { type: Date, default: Date.now }	,
        updated_date: { type: Date, default: Date.now }	

    });
    var leadUser = mongoose.model('techTeam', leadSchema);
	
    module.exports = leadUser;
})();
