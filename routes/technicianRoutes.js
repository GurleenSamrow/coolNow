
module.exports = function(app) {
	const ServiceController      = require('../controllers/serviceController');
	const { uploadSingle }    = require('../helpers/uploader.helper');

	
	// Technician API
	app.post('/technician_login',require('../controllers/api').technicianLogin);
	app.post('/technician_sendotp', require('../controllers/api').userSendOtp);
	app.post('/technician_otpverification',require('../controllers/api').userOtpVerification);
	app.post('/technician_resendotp',require('../controllers/api').userSendOtp);
	app.post('/technician_forgotpassword', require('../controllers/api').userForgotPassword);
	app.post('/technician_changepassword', require('../controllers/api').userChangePassword);
	app.get('/technician_personaldetails/:id', require('../controllers/api').userPersonalDetails);
	app.post('/technician_notificationlist', require('../controllers/api').getNotificationList);
	app.post('/technician_feedbacklist', require('../controllers/api').getGoodFeedbackList);
	app.post('/technician_complaintlist', require('../controllers/api').getComplaintList);
	app.get('/technician_bookingdetails/:id',require('../controllers/api').getBookingDetailsById);
	app.post('/technician_leavingforjob',require('../controllers/api').technicianBookingChangeStatus);
	app.post('/technician_startjob',require('../controllers/api').technicianBookingChangeStatus);
	app.post('/technician_markcompletedjob',require('../controllers/api').technicianBookingChangeStatus);
	app.post('/technician_kpitracker',require('../controllers/api').technicianKpiTracker);
	app.post('/technician_timeonjob',require('../controllers/api').technicianTimeOnJob);
	app.post('/technician_periodwisebookingdetails',require('../controllers/api').technicianPeriodWiseBookingDetails);
	app.post('/technician_datewisebookingdetails',require('../controllers/api').technicianDateWiseBookingDetails);
	app.get('/technician_homepage/:id',require('../controllers/api').technicianHomePage);
	app.get('/technician_paymentstatus/:id',require('../controllers/api').technicianPaymentStatus);
	app.post('/technician_serviceupdate',require('../controllers/api').technicianServiceUpdate);
	app.post('/technician_updatepersonaldetails', require('../controllers/api').userUpdatePersonalDetails);
	app.post('/technician_updateavailability', require('../controllers/api').technicianUpdateAvailability);
	app.post('/technician_uploadprofilephoto', require('../controllers/api').uploadProfilePhoto);
	app.post('/add/service', ServiceController.Add);
	app.get('/get/service', ServiceController.getService);
};