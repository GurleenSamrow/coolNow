(function () {
    var mongoose = require('mongoose');
    var leadSchema = new mongoose.Schema({
        teamNme: {
            type: String,
            trim: true,
            required: [true, 'TeamName is required'] 
        },
        member: {
            type: Array,
            trim: true,
            required: [true, 'member is required']
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
        SelectPriority: {
                type: Array,
                trim: true,
                required: [true, 'SelectPriority is required']
                },
        created_date: { type: Date, default: Date.now }	,
        updated_date: { type: Date, default: Date.now }	

    });
    var leadUser = mongoose.model('leadSource', leadSchema);
	
    module.exports = leadUser;
})();
