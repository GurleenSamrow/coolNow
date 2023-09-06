const {upload} = require('../services/multerServices')
module.exports = function (app) {
    const dashboardController = require('../controllers/dashboardApi');



    app.post('/addManualUser', dashboardController.addManualUser);
    app.post('/updateManualUser', dashboardController.updateUser);
    app.get('/GetAllUser', dashboardController.getAllUser);
    app.get('/GetUserDetails', dashboardController.getUserById);
    app.post('/DeleteUser', dashboardController.deleteUser);

    //addTechnician
    app.post('/addTechnician', dashboardController.addTechnician);
    app.post('/updateTechnician', dashboardController.updateTechnician);
    app.get('/GetAllTechnician', dashboardController.getAllTechnician);
    app.get('/GetTechnicianDetails', dashboardController.getTechnicianById);
    app.post('/DeleteTechnician', dashboardController.deleteTechnician);


    //LeadSource...........................
    app.post('/addLeadSource', dashboardController.addLead);
    app.post('/updateLeadSource', dashboardController.updateLead);
    app.get('/GetAllLeadSource', dashboardController.getAllLead);
    app.post('/DeleteLeadSource', dashboardController.deleteLead);
    app.get('/GetLeadSourceDetails', dashboardController.getLeadById);

    //PromoCode.....................................
    app.post('/addPromoCode', dashboardController.addCouponsPromoCode);
    app.post('/updatePromoCode', dashboardController.updateCouponsPromoCode);
    app.get('/GetAllPromoCode', dashboardController.getAllPromoCodeCoupon);
    app.post('/DeletePromoCode', dashboardController.deletePromoCodeCoupon);
    app.get('/GetPromoCodeDetails', dashboardController.getPromocodeById);

    //techTeam...................................................
    app.post('/addTechTeam', dashboardController.addTechTeam);
    app.post('/updateTechTeam', dashboardController.updateTechTeam);
    app.get('/GetAllTechTeam', dashboardController.getAllTechTeam);
    app.post('/DeleteTechTeam', dashboardController.deleteTechTeam);
    app.get('/GetTechTeamDetails', dashboardController.getTechTeamById);

    //AddManualBooking..................................
    app.post('/addManualBooking', dashboardController.manualBooking);
    app.post('/updateManualBooking', dashboardController.updatedManualBooking);
    app.get('/GetAllManualBooking', dashboardController.getAllManualBooking);
    app.post('/deleteManualBooking', dashboardController.deleteManualBooking);
    app.get('/GetManualBookingDetails', dashboardController.getyByIdManualbooking);


//Services..................................
    app.post('/addServices',upload.single('image'),dashboardController.addServices);
    app.post('/updateServices', dashboardController.updatedServices);
    app.get('/GetAllServices', dashboardController.getAllServices);
    app.post('/deleteServices', dashboardController.deleteServices);
    app.get('/GetServicesDetails', dashboardController.getyByIdServices);


    //Banner..................................
    app.post('/addBanner',upload.array('image',10),dashboardController.addBanner);
    app.post('/updatebanner', dashboardController.updatedBanner);
    app.get('/GetAllBanner', dashboardController.getAllBanner);
    app.post('/deleteBanner', dashboardController.deleteBanner);
    app.get('/GetBannerDetails', dashboardController.getyByIdbanner);


    //supplier................................
    app.post('/addSupplier', dashboardController.addSupplier);
    app.post('/updateSupplier', dashboardController.updatedSupplier);
    app.get('/getAllSupplier', dashboardController.getAllSupplier);
    app.post('/deleteSupplier', dashboardController.deleteSupplier);
    app.get('/GetSupplierDetails', dashboardController.getyByIdSupplier);


    //sku
    app.post('/addSku', dashboardController.addSku);
    app.post('/updateSku', dashboardController.updatedSku);
    app.get('/getAllSku', dashboardController.getAllSku);

    //stock
    app.post('/addStock', dashboardController.addStock);
    app.post('/updateStock', dashboardController.updatedStock);
    app.get('/getAllStock', dashboardController.getAllStock);
    app.post('/addStockOut', dashboardController.addStockOut);

    //   vehicle....
    app.post('/addVehicle', dashboardController.addvehicle);
    app.post('/updateVehicle', dashboardController.updatedVehicle);
    app.post('/DeleteVehicle', dashboardController.deleteVehicle);
    app.get('/getAllVehicle', dashboardController.getAllVehicle);
    app.get('/GetVehicleDetails', dashboardController.getyByIdVehicle);

    //   Priorities....
    app.get('/priorities', dashboardController.getAllPriorities);
    app.post('/priorities', dashboardController.addPriorities);
    app.put('/priorities/:_id', dashboardController.updatedPriorities);
    app.delete('/priorities/:_id', dashboardController.deletePriorities);

    //   Zones....
    app.get('/zones', dashboardController.getAllZones);
    app.post('/zones', dashboardController.addZones);
    app.put('/zones/:_id', dashboardController.updatedZones);
    app.delete('/zones/:_id', dashboardController.deleteZones);

    //   Districts....
    app.get('/districts', dashboardController.getAllDistricts);
    app.post('/districts', dashboardController.addDistricts);
  
    // Appointments...
    app.post('/appointments', dashboardController.userAppointments);
    app.post('/appointments/:_id/reschedule', dashboardController.userAppointmentsReschedule);
    app.post('/updateBookingStatus/:_id',dashboardController.updatedBookingStatus);
    app.get('/bookingDetails/:_id', dashboardController.bookingDetails);
    app.get('/getAllbooking', dashboardController.getAllbooking);


    //pacakage

    app.post('/package', dashboardController.addPackage);
    app.put('/package/:_id', dashboardController.updatedPackage);
    app.get('/package', dashboardController.getAllPackage);
    app.get('/package/:_id', dashboardController.getPackageById);
    app.delete('/package/:_id', dashboardController.deletePackage);




};