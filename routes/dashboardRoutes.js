
module.exports = function(app) {
	const dashboardController      = require('../controllers/dashboardApi');

	
	
	app.post('/addManualUser',dashboardController.addManualUser);
    app.post('/addLeadSource',dashboardController.addLead);
    app.post('/updateLeadSource',dashboardController.updateLead);
    app.get('/GetAllLeadSource',dashboardController.getAllLead);
	
	
};