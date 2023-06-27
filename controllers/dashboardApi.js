const ManualUser = require('../models/dashboardModel/manualUser')
const soucreLead = require('../models/dashboardModel/leadSource')
const PromoCode = require('../models/dashboardModel/promoCode')
const mongoose = require('mongoose');
const promoCode = require('../models/dashboardModel/promoCode');
const techteam = require('../models/dashboardModel/techTeam');
const manualBooking = require('../models/dashboardModel/manualBooking');

//Add manualUser
module.exports.addManualUser = async (req,res) => {
    try {
        const { name, email, gender, password, marketPlace, alias, leadSource, address, profile_photo } = req.body;
        if(name & email & gender & password & marketPlace & alias & leadSource & address & profile_photo){
          const dataInfo = await ManualUser.find({ email: email })
        if (dataInfo.length > 0) {
            res.send({ success: false, message: "Email Already Exists", data: dataInfo })
        } else {
            const manualUser = new ManualUser({
                name: name,
                email: email,
                gender: gender,
                password: password,
                marketPlace: marketPlace,
                alias: alias,
                leadSource: leadSource,
                address: address,
                profile_photo: profile_photo
            })
            await manualUser.save()
            res.send({ success: true, message: "User Add Successfully", data: manualUser })
        }
    }else{
    res.send({ success: false, message: "All Fields Are Required", data: null })
    }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

//addLead Source
module.exports.addLead = async (req,res) => {
    try {
        const { name, date, whoCreated } = req.body;
        if(name && date  && whoCreated){
        const leadUser = new soucreLead({
                name: name,
                date: date,
                whoCreated: whoCreated,
    
            })
            await leadUser.save()
    res.send({ success: true, message: "Lead Add Successfully", data: leadUser })
    }else{
    res.send({ success: false, message: "All Fields Are Required", data: null })
    }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//updateLead Source
module.exports.updateLead = async (req,res) => {
    try {
        const { name, date, whoCreated,_id} = req.body;
        if(name && date  && whoCreated && _id){   
    const leadData = await soucreLead.updateOne(
        { _id: mongoose.Types.ObjectId(_id) },
        { $set: { name: name,
            date: date,
            whoCreated: whoCreated } }
      );
      if(couponData.modifiedCount === 1){
     res.send({ success: true, message: "Lead Updated Successfully", data: null })
      }else{
        res.send({ success: false, message: "Lead Don't Updated", data: null })
      }
    }else{
    res.send({ success: false, message: "All Fields Are Required", data: null })
    }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//list LeadSource.......................................
module.exports.getAllLead = async (req,res) => {
    try {
    const leadData = await soucreLead.find()
    if(leadData.length >0){
        res.send({ success: true, message: "Get All Lead Successfully", data: leadData })
    }else{
        res.send({ success: true, message: "Not Found Lead", data: leadData })
    }
     } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//deleteLeadSource.....................................
module.exports.deleteLead = async (req,res) => {
    try {
        const{_id} =req.body;
    const leadData = await soucreLead.findOneAndDelete({id:_id})
    if(leadData){
        res.send({ success: true, message: "Lead Delete Successfully", data: leadData })
    }else{
        res.send({ success: false, message: "Lead Does'nt Delete", data: null })
    }
     } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

//addCoupon.....................................
module.exports.addCouponsPromoCode = async (req,res) => {
    try {
        const { couponName, code, couponType,discount,amount,startDate,endDate,status} = req.body;
        if(couponName && code  && couponType && discount & amount && startDate && endDate && status){
        const promoCode = new PromoCode({
            couponName: couponName,
            code: code,
            couponType: couponType,
            discount:discount,
            amount:amount,
            startDate:startDate,
            endDate:endDate,
            status:status
      })
            await promoCode.save()
    res.send({ success: true, message: "Promo Code Add Successfully", data: promoCode })
    }else{
    res.send({ success: false, message: "All Fields Are Required", data: null })
    }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//updatedCoupon
module.exports.updateCouponsPromoCode = async (req,res) => {
    try {
        const { couponName, code, couponType,discount,amount,startDate,endDate,status,_id} = req.body;
        if(couponName && code  && couponType && discount & amount && startDate && endDate && status){
    const couponData = await promoCode.updateOne(
        { _id: mongoose.Types.ObjectId(_id) },
        { $set: {  couponName: couponName,
            code: code,
            couponType: couponType,
            discount:discount,
            amount:amount,
            startDate:startDate,
            endDate:endDate,
            status:status} }
      );
      if(couponData.modifiedCount === 1){
     res.send({ success: true, message: "Promo Code Updated Successfully", data: couponData })
      }else{
        res.send({ success: false, message: "Promo Code Don't Updated", data: null })
      }
    }else{
    res.send({ success: false, message: "All Fields Are Required", data: null })
    }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//list LeadSource.......................................
module.exports.getAllPromoCodeCoupon = async (req,res) => {
    try {
    const promoata = await promoCode.find()
    if(promoata.length >0){
        res.send({ success: true, message: "Get All Promo Code Successfully", data: promoata })
    }else{
        res.send({ success: true, message: "Not Found Promo Code", data: null })
    }
     } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//deleteLeadSource.....................................
module.exports.deletePromoCodeCoupon= async (req,res) => {
    try {
        const{_id} =req.body;
    const leadData = await promoCode.findOneAndDelete({id:_id})
    if(leadData){
        res.send({ success: true, message: "Promo Code Delete Successfully", data: leadData })
    }else{
        res.send({ success: false, message: "Promo Cod Does'nt Delete", data: null })
    }
     } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}


//addTechTeam.................................
module.exports.addTechTeam = async (req,res) => {
    try {
        const { memberId, teamNme, Vehicle,selectZone,SelectPriority} = req.body;
        if(memberId && teamNme  && Vehicle && selectZone && SelectPriority){
        const techInfo = new techteam({
            memberId: memberId,
            teamNme: teamNme,
            Vehicle: Vehicle,
            selectZone:selectZone,
            SelectPriority:SelectPriority,
      })
            await techInfo.save()
    res.send({ success: true, message: "Tech Team Add Successfully", data: techInfo })
    }else{
    res.send({ success: false, message: "All Fields Are Required", data: null })
    }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//updatedCoupon
module.exports.updateTechTeam = async (req,res) => {
    try {
        const { memberId, teamNme, Vehicle,selectZone,SelectPriority,_id} = req.body;
        if(memberId && teamNme  && Vehicle && selectZone && SelectPriority){
    const techData = await techteam.updateOne(
        { _id: mongoose.Types.ObjectId(_id) },
        { $set: { 
            memberId: memberId,
            teamNme: teamNme,
            Vehicle: Vehicle,
            selectZone:selectZone,
            SelectPriority:SelectPriority,
        } }
      );
      if(techData.modifiedCount === 1){
     res.send({ success: true, message: "Tech Updated Successfully", data: couponData })
      }else{
        res.send({ success: false, message: "Tech  Don't Updated", data: couponData })
      }
    }else{
    res.send({ success: false, message: "All Fields Are Required", data: null })
    }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

//list TechTeam.......................................
module.exports.getAllTechTeam = async (req,res) => {
    try {
    const techData = await techteam.find()
    if(techData.length >0){
        res.send({ success: true, message: "Get All TechTeam Successfully", data: techData })
    }else{
        res.send({ success: true, message: "Not Found TeachTeam", data: leadData })
    }
     } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//deleteTechTeam.....................................
module.exports.deleteTechTeam = async (req,res) => {
    try {
        const{_id} =req.body;
    const leadData = await techteam.findOneAndDelete({id:_id})
    if(leadData){
        res.send({ success: true, message: "TechTeam Delete Successfully", data: leadData })
    }else{
        res.send({ success: false, message: "TechTeam Does'nt Delete", data: null })
    }
     } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

module.exports.manualBooking = async (req,res) => {
    try {
        const { userName, technician_id, phone,email,date,address,bookingSlot,chooseServices,note} = req.body;
        if(userName && technician_id  && phone && email && date && address && bookingSlot && chooseServices  && note){
        const BookingInfo = new manualBooking({
            userName: userName,
            technician_id: technician_id,
            email:email,
            date:date,
            phone:phone,
            address:address,
            bookingSlot:bookingSlot,
            chooseServices:chooseServices,
            note:note
      })
            await BookingInfo.save()
    res.send({ success: true, message: "Manual Booking  Add Successfully", data: BookingInfo })
    }else{
    res.send({ success: false, message: "All Fields Are Required", data: null })
    }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

//updatedManualBooking
module.exports.updatedManualBooking = async (req,res) => {
    try {
        const { userName, phone,email,date,address,bookingSlot,chooseServices,note,technician_id,_id} = req.body;
        if(userName && technician_id  && phone && email && date && address && bookingSlot && chooseServices && _id && note){
            const manualData = await manualBooking.updateOne(
                { _id: mongoose.Types.ObjectId(_id) },
                { $set: {
            userName: userName,
            technician_id: technician_id,
            email:email,
            date:date,
            phone:phone,
            address:address,
            bookingSlot:bookingSlot,
            chooseServices:chooseServices,
            note:note}
      })
      if(manualData.modifiedCount === 1){
    res.send({ success: true, message: "Manual Booking  Updated Successfully", data: null })
      }else{
        res.send({ success: false, message: "Manual Booking Don't Updated", data: null })
      }
    }else{
    res.send({ success: false, message: "All Fields Are Required", data: null })
    }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}


//list TechTeam.......................................
module.exports.getAllManualBooking = async (req,res) => {
    try {
    const bookingData = await manualBooking.find()
    if(bookingData.length >0){
        res.send({ success: true, message: "Get All ManualBooking Successfully", data: bookingData })
    }else{
        res.send({ success: true, message: "Not Found ManualBooking", data: null })
    }
     } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//deleteTechTeam.....................................
module.exports.deleteManualBooking = async (req,res) => {
    try {
        const{_id} =req.body;
    const leadData = await manualBooking.findOneAndDelete({id:_id})
    if(leadData){
        res.send({ success: true, message: "ManualBooking Delete Successfully", data: leadData })
    }else{
        res.send({ success: false, message: "ManualBooking Does'nt Delete", data: null })
    }
     } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}