(function () {
    var mongoose = require('mongoose');
    var leadSchema = new mongoose.Schema({
        name: {
            type: String,
            trim: true,
            required: [true, 'name is required'] 
        },
        date: {
            type: String,
            trim: true,
            required: [true, 'date is required']
            
        
        },
		whoCreated: {
            type: String,
            trim: true,
            required: [true, 'whoCreated is required']
			
        },
        created_date: { type: Date, default: Date.now }	,
        updated_date: { type: Date, default: Date.now }	

    });
    var leadUser = mongoose.model('leadSource', leadSchema);
	
    module.exports = leadUser;
})();
