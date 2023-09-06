const {upload} = require('../services/multerServices')
module.exports = function(app) {
	const ServiceController      = require('../controllers/serviceController');
	const { uploadSingle }    = require('../helpers/uploader.helper');
	
	//Common 
	app.post('/users_logout',require('../controllers/api').logOut);
	app.get('/test',require('../controllers/api').test);
	
	//Customer API	
	app.post('/userSignupOtp',require('../controllers/api').SignupUserSendOtp);
	app.post('/users_login',require('../controllers/api').usersLogin);
	app.post('/users_signup',require('../controllers/api').usersSignup);
	app.post('/user_changepassword',require('../controllers/api').userChangePassword);
	app.post('/user_sendotp',require('../controllers/api').userSendOtp);
	app.post('/user_otpverification',require('../controllers/api').userOtpVerification);
	app.post('/user_resendotp',require('../controllers/api').userSendOtp);
	app.get('/user_personaldetails/:id', require('../controllers/api').userPersonalDetails);
	app.get('/user_address_list/:id', require('../controllers/api').userAddressList); 
	app.post('/user_save_address', require('../controllers/api').userSaveAddress);
	app.post('/user_notificationList', require('../controllers/api').getNotificationList); 
	app.post('/user_addtrackaircon', require('../controllers/api').userAddTrackAircon);
	app.get('/user_homepage/:id', require('../controllers/api').userHomePage);
	app.post('/user_updateemail', require('../controllers/api').userUpdateEmail);
	app.post('/user_updatepersonaldetails', require('../controllers/api').userUpdatePersonalDetails); 
	app.post('/user_periodwisebookingdetails',require('../controllers/api').userPeriodWiseBookingDetails);
	app.post('/user_datewisebookingdetails',require('../controllers/api').userDateWiseBookingDetails);
	app.post('/user_trackbookingdetails',require('../controllers/api').userTrackBookingDetails);
	app.post('/user_generalpurposebtucalculator', require('../controllers/api').userGeneralPurposeBTUCalculator);
	app.post('/user_acbtucalculator', require('../controllers/api').userAcBTUCalculator);
	app.post('/user_submitfeedback', require('../controllers/api').userSubmitFeedback);
	app.get('/user_updatedbookingdetails/:id',require('../controllers/api').getBookingDetailsById);
	app.post('/user_scheduleappointment',require('../controllers/api').userScheduleAppointment);
	app.post('/user_datewiseavailableslots',require('../controllers/api').userDatewiseAvailableSlots);
	app.post('/user_monthavailableslotsdays',require('../controllers/api').userMonthAvailableSlotsDays);
	app.post('/user_checkpromocode',require('../controllers/api').userCheckPromoCode);
	app.post('/user_uploadprofilephoto',upload.single('image'),require('../controllers/api').uploadProfilePhoto);
	app.get('/user_chatlist/:id', require('../controllers/api').usersChatList);
	//app.post('/user_payment', require('../controllers/api').userPayment);
	
	app.get('/servicelist',require('../controllers/api').getServiceList);
	app.get('/packagelist',require('../controllers/api').getPackageList);
//NewRoutes
	app.post('/userServices',upload.single('image'),require('../controllers/api').selectServices);
	app.delete('/userDeleteServices',require('../controllers/api').deleteServices);
	app.post('/addRatting',require('../controllers/api').addRatting);
	app.get('/getRatting/:technicianId',require('../controllers/api').getRatting);
	app.get('/technicianHomepage/:userId',require('../controllers/api').homepageDetails);
	app.post('/addCart',require('../controllers/api').addCartServices);
	app.get('/getCart/:userId',require('../controllers/api').getCart);
    app.delete('/removeTocart/:_id',require('../controllers/api').removeCart);
	app.post('/updateCart',require('../controllers/api').updateCart);
	app.post('/userChatList',require('../controllers/api').userChatList);
	app.post('/uploadVideo', upload.fields([{ name: 'image' }, { name: 'video' }]),require('../controllers/api').uploadImage)
}; 