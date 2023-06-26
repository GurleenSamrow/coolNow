
// module.exports = function(app) {
// 	const ServiceController      = require('../controllers/serviceController');
// 	const { uploadSingle }    = require('../helpers/uploader.helper');
// 	//Common 
// 	app.post('/users_logout',require('../controllers/api').logOut);
// 	app.get('/test',require('../controllers/api').test);
	
// 	//Customer API	
// 	app.post('/users_login',require('../controllers/api').usersLogin);
// 	app.post('/users_signup',require('../controllers/api').usersSignup);
// 	app.post('/user_changepassword',require('../controllers/api').userChangePassword);
// 	app.post('/user_sendotp',require('../controllers/api').userSendOtp);
// 	app.post('/user_otpverification',require('../controllers/api').userOtpVerification);
// 	app.post('/user_resendotp',require('../controllers/api').userSendOtp);
// 	app.get('/user_personaldetails/:id', require('../controllers/api').userPersonalDetails);
// 	app.get('/user_address_list/:id', require('../controllers/api').userAddressList); 
// 	app.post('/user_save_address', require('../controllers/api').userSaveAddress);
// 	app.post('/user_notificationList', require('../controllers/api').getNotificationList); 
// 	app.post('/user_addtrackaircon', require('../controllers/api').userAddTrackAircon);
// 	app.get('/user_homepage/:id', require('../controllers/api').userHomePage);
// 	app.post('/user_updateemail', require('../controllers/api').userUpdateEmail);
// 	app.post('/user_updatepersonaldetails', require('../controllers/api').userUpdatePersonalDetails); 
// 	app.post('/user_periodwisebookingdetails',require('../controllers/api').userPeriodWiseBookingDetails);
// 	app.post('/user_datewisebookingdetails',require('../controllers/api').userDateWiseBookingDetails);
// 	app.post('/user_trackbookingdetails',require('../controllers/api').userTrackBookingDetails);
// 	app.post('/user_generalpurposebtucalculator', require('../controllers/api').userGeneralPurposeBTUCalculator);
// 	app.post('/user_acbtucalculator', require('../controllers/api').userAcBTUCalculator);
// 	app.post('/user_submitfeedback', require('../controllers/api').userSubmitFeedback);
// 	app.get('/user_updatedbookingdetails/:id',require('../controllers/api').getBookingDetailsById);
// 	app.post('/user_scheduleappointment',require('../controllers/api').userScheduleAppointment);
// 	app.post('/user_datewiseavailableslots',require('../controllers/api').userDatewiseAvailableSlots);
// 	app.post('/user_monthavailableslotsdays',require('../controllers/api').userMonthAvailableSlotsDays);
// 	app.post('/user_checkpromocode',require('../controllers/api').userCheckPromoCode);
// 	app.post('/user_uploadprofilephoto', require('../controllers/api').uploadProfilePhoto);
// 	app.get('/user_chatlist/:id', require('../controllers/api').usersChatList);
// 	//app.post('/user_payment', require('../controllers/api').userPayment);
	
// 	app.get('/servicelist',require('../controllers/api').getServiceList);
// 	app.get('/packagelist',require('../controllers/api').getPackageList);
	
// 	// Technician API
// 	app.post('/technician_login',require('../controllers/api').technicianLogin);
// 	app.post('/technician_sendotp', require('../controllers/api').userSendOtp);
// 	app.post('/technician_otpverification',require('../controllers/api').userOtpVerification);
// 	app.post('/technician_resendotp',require('../controllers/api').userSendOtp);
// 	app.post('/technician_forgotpassword', require('../controllers/api').userForgotPassword);
// 	app.post('/technician_changepassword', require('../controllers/api').userChangePassword);
// 	app.get('/technician_personaldetails/:id', require('../controllers/api').userPersonalDetails);
// 	app.post('/technician_notificationlist', require('../controllers/api').getNotificationList);
// 	app.post('/technician_feedbacklist', require('../controllers/api').getGoodFeedbackList);
// 	app.post('/technician_complaintlist', require('../controllers/api').getComplaintList);
// 	app.get('/technician_bookingdetails/:id',require('../controllers/api').getBookingDetailsById);
// 	app.post('/technician_leavingforjob',require('../controllers/api').technicianBookingChangeStatus);
// 	app.post('/technician_startjob',require('../controllers/api').technicianBookingChangeStatus);
// 	app.post('/technician_markcompletedjob',require('../controllers/api').technicianBookingChangeStatus);
// 	app.post('/technician_kpitracker',require('../controllers/api').technicianKpiTracker);
// 	app.post('/technician_timeonjob',require('../controllers/api').technicianTimeOnJob);
// 	app.post('/technician_periodwisebookingdetails',require('../controllers/api').technicianPeriodWiseBookingDetails);
// 	app.post('/technician_datewisebookingdetails',require('../controllers/api').technicianDateWiseBookingDetails);
// 	app.get('/technician_homepage/:id',require('../controllers/api').technicianHomePage);
// 	app.get('/technician_paymentstatus/:id',require('../controllers/api').technicianPaymentStatus);
// 	app.post('/technician_serviceupdate',require('../controllers/api').technicianServiceUpdate);
// 	app.post('/technician_updatepersonaldetails', require('../controllers/api').userUpdatePersonalDetails);
// 	app.post('/technician_updateavailability', require('../controllers/api').technicianUpdateAvailability);
// 	app.post('/technician_uploadprofilephoto', require('../controllers/api').uploadProfilePhoto);
// 	app.post('/add/service', ServiceController.Add);
// 	app.get('/get/service', ServiceController.getService);
// };