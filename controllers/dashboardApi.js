const ManualUser = require('../models/dashboardModel/manualUser')
const soucreLead = require('../models/dashboardModel/leadSource')
const mongoose = require('mongoose');
 

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
     res.send({ success: true, message: "Lead Updated Successfully", data: null })
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