const ManualUser = require('../models/user')
const soucreLead = require('../models/dashboardModel/leadSource')
const PromoCode = require('../models/promocode')
const mongoose = require('mongoose');
const techteam = require('../models/dashboardModel/techTeam');
const manualBooking = require('../models/dashboardModel/manualBooking');
const services = require('../models/serviceModel');
const banner = require('../models/dashboardModel/banner');
const supplier = require('../models/dashboardModel/supplier');
const skuModel = require('../models/dashboardModel/sku');
const stockModel = require('../models/dashboardModel/stock');
const stockOutModel = require('../models/stockOut');
const vehicleModel = require('../models/dashboardModel/vehicleModel');

//Add manualUser
module.exports.addManualUser = async (req, res) => {
    try {
        const { name, phone, email, gender, password, marketPlace, alias, leadSource, address, profile_photo } = req.body;
        if (name && email && phone && gender && password && marketPlace && alias && leadSource && address) {
            const dataInfo = await ManualUser.find({ email: email })
            if (dataInfo.length > 0) {
                res.send({ success: false, message: "Email Already Exists", data: null })
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
                    profile_photo: profile_photo,
                    phone: phone
                })
                await manualUser.save()
                res.send({ success: true, message: "User Add Successfully", data: manualUser })
            }
        } else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//updateuser.........................................
module.exports.updateUser = async (req, res) => {
    try {
        const { name, phone, email, gender, marketPlace, alias, leadSource, address, profile_photo, _id } = req.body;
        if (name && email && phone && gender && marketPlace && alias && leadSource && address && profile_photo && _id) {
            const userData = await ManualUser.updateOne(
                { _id: mongoose.Types.ObjectId(_id) },
                {
                    $set: {
                        name: name,
                        email: email,
                        gender: gender,
                        marketPlace: marketPlace,
                        alias: alias,
                        leadSource: leadSource,
                        address: address,
                        profile_photo: profile_photo,
                        phone: phone
                    }
                }
            );
            if (userData.modifiedCount === 1) {
                res.send({ success: true, message: "User Updated Successfully", data: null })
            } else {
                res.send({ success: false, message: "User Don't Updated", data: null })
            }
        } else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//GetUserAll
module.exports.getAllUser = async (req, res) => {
    try {
        const userData = await ManualUser.find()
        if (userData.length > 0) {
            res.send({ success: true, message: "Get All User Successfully", data: userData })
        } else {
            res.send({ success: true, message: "Not Found User", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//DeleteUser
module.exports.deleteUser = async (req, res) => {
    try {
        const { _id } = req.body;
        const userData = await ManualUser.findOneAndDelete({ _id: _id })
        if (userData) {
            res.send({ success: true, message: "User Deleted Successfully", data: userData })
        } else {
            res.send({ success: true, message: "Not Found User", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//getUserById
module.exports.getUserById = async (req, res) => {
    try {
        const { _id } = req.body;
        const userData = await ManualUser.findById({ _id: _id })
        if (userData) {
            res.send({ success: true, message: "Get User Details Successfully", data: userData })
        } else {
            res.send({ success: true, message: "Not Found User", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

//addLead Source
module.exports.addLead = async (req, res) => {
    try {
        const { name, date, whoCreated } = req.body;
        if (name && date && whoCreated) {
            const leadUser = new soucreLead({
                name: name,
                date: date,
                whoCreated: whoCreated,

            })
            await leadUser.save()
            res.send({ success: true, message: "Lead Add Successfully", data: leadUser })
        } else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//updateLead Source
module.exports.updateLead = async (req, res) => {
    try {
        const { name, date, whoCreated, _id } = req.body;
        if (name && date && whoCreated && _id) {
            const leadData = await soucreLead.updateOne(
                { _id: mongoose.Types.ObjectId(_id) },
                {
                    $set: {
                        name: name,
                        date: date,
                        whoCreated: whoCreated
                    }
                }
            );
            if (leadData.modifiedCount === 1) {
                res.send({ success: true, message: "Lead Updated Successfully", data: null })
            } else {
                res.send({ success: false, message: "Lead Don't Updated", data: null })
            }
        } else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//list LeadSource.......................................
module.exports.getAllLead = async (req, res) => {
    try {
        const leadData = await soucreLead.find()
        if (leadData.length > 0) {
            res.send({ success: true, message: "Get All Lead Successfully", data: leadData })
        } else {
            res.send({ success: true, message: "Not Found Lead", data: leadData })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//deleteLeadSource.....................................
module.exports.deleteLead = async (req, res) => {
    try {
        const { _id } = req.body;
        const leadData = await soucreLead.findOneAndDelete({ _id: _id })
        if (leadData) {
            res.send({ success: true, message: "Lead Delete Successfully", data: leadData })
        } else {
            res.send({ success: false, message: "Lead Does'nt Delete", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

//addCoupon.....................................
module.exports.addCouponsPromoCode = async (req, res) => {
    try {
        const { couponName, code, couponType, discount, amount, startDate, endDate, status } = req.body;
        if (couponName && code && couponType && discount & amount && startDate && endDate && status) {
            const promoCode = new PromoCode({
                couponName: couponName,
                code: code,
                couponType: couponType,
                discount: discount,
                amount: amount,
                startDate: startDate,
                endDate: endDate,
                status: status
            })
            await promoCode.save()
            res.send({ success: true, message: "Promo Code Add Successfully", data: promoCode })
        } else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//updatedCoupon
module.exports.updateCouponsPromoCode = async (req, res) => {
    try {
        const { couponName, code, couponType, discount, amount, startDate, endDate, status, _id } = req.body;
        if (couponName && code && couponType && discount & amount && startDate && endDate && status) {
            const couponData = await promoCode.updateOne(
                { _id: mongoose.Types.ObjectId(_id) },
                {
                    $set: {
                        couponName: couponName,
                        code: code,
                        couponType: couponType,
                        discount: discount,
                        amount: amount,
                        startDate: startDate,
                        endDate: endDate,
                        status: status
                    }
                }
            );
            if (couponData.modifiedCount === 1) {
                res.send({ success: true, message: "Promo Code Updated Successfully", data: couponData })
            } else {
                res.send({ success: false, message: "Promo Code Don't Updated", data: null })
            }
        } else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//list LeadSource.......................................
module.exports.getAllPromoCodeCoupon = async (req, res) => {
    try {
        const promoata = await promoCode.find()
        if (promoata.length > 0) {
            res.send({ success: true, message: "Get All Promo Code Successfully", data: promoata })
        } else {
            res.send({ success: true, message: "Not Found Promo Code", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//deleteLeadSource.....................................
module.exports.deletePromoCodeCoupon = async (req, res) => {
    try {
        const { _id } = req.body;
        const leadData = await promoCode.findOneAndDelete({ id: _id })
        if (leadData) {
            res.send({ success: true, message: "Promo Code Delete Successfully", data: leadData })
        } else {
            res.send({ success: false, message: "Promo Cod Does'nt Delete", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}


//addTechTeam.................................
module.exports.addTechTeam = async (req, res) => {
    try {
        const { memberId, teamNme, Vehicle, selectZone, SelectPriority, days } = req.body;
        if (memberId && teamNme && Vehicle && selectZone && SelectPriority && days) {
            const techInfo = new techteam({
                memberId: memberId,
                teamNme: teamNme,
                Vehicle: Vehicle,
                selectZone: selectZone,
                SelectPriority: SelectPriority,
                days: days
            })
            await techInfo.save()
            res.send({ success: true, message: "Tech Team Add Successfully", data: techInfo })
        } else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//updatedCoupon
module.exports.updateTechTeam = async (req, res) => {
    try {
        const { memberId, teamNme, Vehicle, selectZone, SelectPriority, _id, days } = req.body;
        if (memberId && teamNme && Vehicle && selectZone && SelectPriority, days) {
            const techData = await techteam.updateOne(
                { _id: mongoose.Types.ObjectId(_id) },
                {
                    $set: {
                        memberId: memberId,
                        teamNme: teamNme,
                        Vehicle: Vehicle,
                        selectZone: selectZone,
                        SelectPriority: SelectPriority,
                        days: days
                    }
                }
            );
            if (techData.modifiedCount === 1) {
                res.send({ success: true, message: "Tech Updated Successfully", data: couponData })
            } else {
                res.send({ success: false, message: "Tech  Don't Updated", data: couponData })
            }
        } else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

//list TechTeam.......................................
module.exports.getAllTechTeam = async (req, res) => {
    try {
        // const techData = await techteam.find()
        const techData = await techteam.aggregate([
            {
                $match: {
                    _id: { $exists: true } // Optional: Add any additional match conditions here
                }
            },
            {
                $lookup: {
                    from: "users",
                    localField: "memberId",
                    foreignField: "_id",
                    as: "datainfo"
                }
            },
            {
                $unwind: "$datainfo"
            },
            {
                $group: {
                    _id: "$_id",
                    teamNme: { $first: "$teamNme" },
                    days: { $first: "$days" },
                    Vehicle: { $first: "$Vehicle" },
                    datainfo: { $push: "$datainfo.name" }
                }
            }
        ]);
        if (techData.length > 0) {
            res.send({ success: true, message: "Get All TechTeam Successfully", data: techData })
        } else {
            res.send({ success: true, message: "Not Found TeachTeam", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//deleteTechTeam.....................................
module.exports.deleteTechTeam = async (req, res) => {
    try {
        const { _id } = req.body;
        const leadData = await techteam.findOneAndDelete({ id: _id })
        if (leadData) {
            res.send({ success: true, message: "TechTeam Delete Successfully", data: leadData })
        } else {
            res.send({ success: false, message: "TechTeam Does'nt Delete", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

module.exports.manualBooking = async (req, res) => {
    try {
        const { userName, technician_id, phone, email, date, address, bookingSlot, chooseServices, note } = req.body;
        if (userName && technician_id && phone && email && date && address && bookingSlot && chooseServices && note) {
            const BookingInfo = new manualBooking({
                userName: userName,
                technician_id: technician_id,
                email: email,
                date: date,
                phone: phone,
                address: address,
                bookingSlot: bookingSlot,
                chooseServices: chooseServices,
                note: note
            })
            await BookingInfo.save()
            res.send({ success: true, message: "Manual Booking  Add Successfully", data: BookingInfo })
        } else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

//updatedManualBooking
module.exports.updatedManualBooking = async (req, res) => {
    try {
        const { userName, phone, email, date, address, bookingSlot, chooseServices, note, technician_id, _id } = req.body;
        if (userName && technician_id && phone && email && date && address && bookingSlot && chooseServices && _id && note) {
            const manualData = await manualBooking.updateOne(
                { _id: mongoose.Types.ObjectId(_id) },
                {
                    $set: {
                        userName: userName,
                        technician_id: technician_id,
                        email: email,
                        date: date,
                        phone: phone,
                        address: address,
                        bookingSlot: bookingSlot,
                        chooseServices: chooseServices,
                        note: note
                    }
                })
            if (manualData.modifiedCount === 1) {
                res.send({ success: true, message: "Manual Booking  Updated Successfully", data: null })
            } else {
                res.send({ success: false, message: "Manual Booking Don't Updated", data: null })
            }
        } else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}


//list TechTeam.......................................
module.exports.getAllManualBooking = async (req, res) => {
    try {
        const bookingData = await manualBooking.find()
        if (bookingData.length > 0) {
            res.send({ success: true, message: "Get All ManualBooking Successfully", data: bookingData })
        } else {
            res.send({ success: true, message: "Not Found ManualBooking", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//deleteTechTeam.....................................
module.exports.deleteManualBooking = async (req, res) => {
    try {
        const { _id } = req.body;
        const leadData = await manualBooking.findOneAndDelete({ id: _id })
        if (leadData) {
            res.send({ success: true, message: "ManualBooking Delete Successfully", data: leadData })
        } else {
            res.send({ success: false, message: "ManualBooking Does'nt Delete", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}


// //addServices.................
// module.exports.addServices = async (req,res) => {
//     try {
//         const { title, description, sub_service,price,commision_margin,commision_amount,cost,icon,status} = req.body;
//         if(title && description  && sub_service && price && commision_margin && commision_amount && cost && icon  && status){
//         const ServicesInfo = new services({
//             title: title,
//             description: description,
//             sub_service:sub_service,
//             price:price,
//             commision_margin:commision_margin,
//             commision_amount:commision_amount,
//             cost:cost,
//             icon:icon,
//             status:status
//       })
//             await ServicesInfo.save()
//     res.send({ success: true, message: "Service Add Successfully", data: ServicesInfo })
//     }else{
//     res.send({ success: false, message: "All Fields Are Required", data: null })
//     }
//     } catch (err) {
//         res.send({ success: false, message: "Internal Server Error", data: null })
//     }
// }

//updatedServices.....................
module.exports.updatedServices = async (req, res) => {
    try {
        const { title, description, sub_service, price, commision_margin, commision_amount, cost, icon, status, _id } = req.body;
        if (title && description && sub_service && price && commision_margin && commision_amount && cost && icon && status && _id) {
            const servicesData = await services.updateOne(
                { _id: mongoose.Types.ObjectId(_id) },
                {
                    $set: {
                        title: title,
                        description: description,
                        sub_service: sub_service,
                        price: price,
                        commision_margin: commision_margin,
                        commision_amount: commision_amount,
                        cost: cost,
                        icon: icon,
                        status: status
                    }
                })
            if (servicesData.modifiedCount === 1) {
                res.send({ success: true, message: "Service  Updated Successfully", data: null })
            } else {
                res.send({ success: false, message: "Service Don't Updated", data: null })
            }
        } else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        console.log("err", err);
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}


//list services.......................................
module.exports.getAllServices = async (req, res) => {
    try {
        const servicesData = await services.find()
        if (servicesData.length > 0) {
            res.send({ success: true, message: "Get All Services Successfully", data: servicesData })
        } else {
            res.send({ success: true, message: "Not Found Services", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//deleteServices.....................................
module.exports.deleteServices = async (req, res) => {
    try {
        const { _id } = req.body;
        const servicesData = await services.findOneAndDelete({ id: _id })
        if (servicesData) {
            res.send({ success: true, message: "Services Delete Successfully", data: servicesData })
        } else {
            res.send({ success: false, message: "Services Does'nt Delete", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
module.exports.addBanner = async (req, res) => {
    try {
        const { banner_title, banner_description, banner_image, active, scheduleDate, scheduleTime } = req.body;
        if (banner_title && banner_description && banner_image && active, scheduleDate, scheduleTime) {
            const bannerInfo = new banner({
                banner_title: banner_title,
                banner_description: banner_description,
                banner_image: banner_image,
                active: active,
                scheduleDate: scheduleDate,
                scheduleTime: scheduleTime
            })
            await bannerInfo.save()
            res.send({ success: true, message: "Banner Add Successfully", data: bannerInfo })
        } else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//updatedBanner
module.exports.updatedBanner = async (req, res) => {
    try {
        const { banner_title, banner_description, banner_image, active, scheduleDate, scheduleTime, _id } = req.body;
        if (banner_title && banner_description && banner_image && active, scheduleDate, scheduleTime) {
            const bannerData = await banner.updateOne(
                { _id: mongoose.Types.ObjectId(_id) },
                {
                    $set: {
                        banner_title: banner_title,
                        banner_description: banner_description,
                        banner_image: banner_image,
                        active: active,
                        scheduleDate: scheduleDate,
                        scheduleTime: scheduleTime
                    }
                })
            if (bannerData.modifiedCount === 1) {
                res.send({ success: true, message: "Banner Updated Successfully", data: null })
            } else {
                res.send({ success: false, message: "Banner Don't Updated", data: null })
            }
        } else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//addServices.................
module.exports.addServices = async (req, res) => {
    try {
        const { title, description, sub_service, price, commision_margin, commision_amount, cost, icon, status } = req.body;
        if (title && description && sub_service && price && commision_margin && commision_amount && cost && icon && status) {
            const ServicesInfo = new services({
                title: title,
                description: description,
                sub_service: sub_service,
                price: price,
                commision_margin: commision_margin,
                commision_amount: commision_amount,
                cost: cost,
                icon: icon,
                status: status
            })
            await ServicesInfo.save()
            res.send({ success: true, message: "Service Add Successfully", data: ServicesInfo })
        } else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

//list banner.......................................
module.exports.getAllBanner = async (req, res) => {
    try {
        const bannerData = await banner.find()
        if (bannerData.length > 0) {
            res.send({ success: true, message: "Get All Banner Successfully", data: bannerData })
        } else {
            res.send({ success: true, message: "Not Found Banner", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//deletebanner.....................................
module.exports.deleteBanner = async (req, res) => {
    try {
        const { _id } = req.body;
        const deleteData = await banner.findOneAndDelete({ id: _id })
        if (deleteData) {
            res.send({ success: true, message: "Banner Delete Successfully", data: deleteData })
        } else {
            res.send({ success: false, message: "Banner Does'nt Delete", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}


//addSupplier......................
module.exports.addSupplier = async (req, res) => {
    try {
        const { companyName, email, contactPerson, mobileNumber, uenNumber, notes, address } = req.body;
        if (companyName && email && contactPerson && mobileNumber && uenNumber && address && notes) {
            const addSupplier = new supplier({
                companyName: companyName,
                email: email,
                contactPerson: contactPerson,
                mobileNumber: mobileNumber,
                uenNumber: uenNumber,
                address: address,
                notes: notes,
            })
            await addSupplier.save()
            res.send({ success: true, message: "Suppiler Add Successfully", data: addSupplier })
        }
        else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

//updateSupplier.............................
module.exports.updatedSupplier = async (req, res) => {
    try {
        const { companyName, email, contactPerson, mobileNumber, uenNumber, notes, address, _id } = req.body;
        if (companyName && email && contactPerson && mobileNumber && uenNumber && address && notes && _id) {
            const supplierData = await suplier.updateOne(
                { _id: mongoose.Types.ObjectId(_id) },
                {
                    $set: {
                        companyName: companyName,
                        email: email,
                        contactPerson: contactPerson,
                        mobileNumber: mobileNumber,
                        uenNumber: uenNumber,
                        address: address,
                        notes: notes,
                    }
                })
            if (supplierData.modifiedCount === 1) {
                res.send({ success: true, message: "Supplier Updated Successfully", data: null })
            } else {
                res.send({ success: false, message: "Supplier Don't Updated", data: null })
            }
        } else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}


//list Supplier.......................................
module.exports.getAllSupplier = async (req, res) => {
    try {
        const supplierData = await suplier.find()
        if (supplierData.length > 0) {
            res.send({ success: true, message: "Get All Supplier Successfully", data: supplierData })
        } else {
            res.send({ success: true, message: "Not Found Supplier", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

//deletesupplier....................................
module.exports.deleteSupplier = async (req, res) => {
    try {
        const { _id } = req.body;
        const deleteData = await supplier.findOneAndDelete({ id: _id })
        if (deleteData) {
            res.send({ success: true, message: "Supplier Delete Successfully", data: deleteData })
        } else {
            res.send({ success: false, message: "Supplier Does'nt Delete", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//addTechnician
module.exports.addTechnician = async (req, res) => {
    try {
        const { name, phone, email, password, profile_photo, designation, skill } = req.body;
        if (name && email && phone && password && skill && designation && profile_photo) {
            const dataInfo = await ManualUser.find({ email: email })
            if (dataInfo.length > 0) {
                res.send({ success: false, message: "Email Already Exists", data: null })
            } else {
                const technicianData = new ManualUser({
                    name: name,
                    email: email,
                    password: password,
                    designation: designation,
                    skill: skill,
                    profile_photo: profile_photo,
                    phone: phone,
                    user_type: "T"
                })
                await technicianData.save()
                res.send({ success: true, message: "Technician Add Successfully", data: technicianData })
            }
        } else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

//updateTechnician.........................................
module.exports.updateTechnician = async (req, res) => {
    try {
        const { name, phone, email, profile_photo, designation, skill, _id } = req.body;
        if (name && email && phone && skill && designation && profile_photo && _id) {
            const technicianData = await ManualUser.updateOne(
                { _id: mongoose.Types.ObjectId(_id) },
                {
                    $set: {
                        name: name,
                        email: email,
                        designation: designation,
                        skill: skill,
                        profile_photo: profile_photo,
                        phone: phone,
                    }
                }
            );
            if (technicianData.modifiedCount === 1) {
                res.send({ success: true, message: "Technician Updated Successfully", data: null })
            } else {
                res.send({ success: false, message: "Technician Don't Updated", data: null })
            }
        } else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

//getAllTechnician
module.exports.getAllTechnician = async (req, res) => {
    try {
        const technicianData = await ManualUser.find({ user_type: "T" })
        if (technicianData.length > 0) {
            res.send({ success: true, message: "Get All Technician Successfully", data: technicianData })
        } else {
            res.send({ success: true, message: "Not Found Technician", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

//deleteTechnician
module.exports.deleteTechnician = async (req, res) => {
    try {
        const { _id } = req.body;
        const technicianData = await ManualUser.findOneAndDelete({ _id: _id })
        if (technicianData) {
            res.send({ success: true, message: "Technician Deleted Successfully", data: technicianData })
        } else {
            res.send({ success: true, message: "Not Found Technician", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//getByIdTechnician
module.exports.getTechnicianById = async (req, res) => {
    try {
        const { _id } = req.body;
        const technicianData = await ManualUser.findById({ _id: _id })
        if (technicianData) {
            res.send({ success: true, message: "Get Technician Details Successfully", data: technicianData })
        } else {
            res.send({ success: true, message: "Not Found Technician", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

//getLeadById
module.exports.getLeadById = async (req, res) => {
    try {
        const { _id } = req.body;
        const leadData = await soucreLead.findById({ _id: _id })
        if (leadData) {
            res.send({ success: true, message: "Get SourceLead Details Successfully", data: leadData })
        } else {
            res.send({ success: true, message: "Not Found SourceLead", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//getbyIdPromocode...............
module.exports.getPromocodeById = async (req, res) => {
    try {
        const { _id } = req.body;
        const Data = await promoCode.findById({ _id: _id })
        if (Data) {
            res.send({ success: true, message: "Get promoCode Details Successfully", data: Data })
        } else {
            res.send({ success: true, message: "Not Found promoCode", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//getByIdTechTeam...........................
module.exports.getTechTeamById = async (req, res) => {
    try {
        const { _id } = req.body;
        const teamData = await techteam.findById({ _id: _id })
        if (teamData) {
            res.send({ success: true, message: "Get TechTeam Details Successfully", data: teamData })
        } else {
            res.send({ success: true, message: "Not Found TechTeam", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

//getByIdmanualbooking...........................
module.exports.getyByIdManualbooking = async (req, res) => {
    try {
        const { _id } = req.body;
        const bookingData = await manualBooking.findById({ _id: _id })
        if (bookingData) {
            res.send({ success: true, message: "Get manualbooking Details Successfully", data: bookingData })
        } else {
            res.send({ success: true, message: "Not Found manualbooking", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//getByidServices
module.exports.getyByIdServices = async (req, res) => {
    try {
        const { _id } = req.body;
        const servicesData = await services.findById({ _id: _id })
        if (servicesData) {
            res.send({ success: true, message: "Get Services Details Successfully", data: servicesData })
        } else {
            res.send({ success: true, message: "Not Found Services", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//getbyIdBybanner
module.exports.getyByIdbanner = async (req, res) => {
    try {
        const { _id } = req.body;
        const bannerData = await banner.findById({ _id: _id })
        if (bannerData) {
            res.send({ success: true, message: "Get Banner Details Successfully", data: bannerData })
        } else {
            res.send({ success: true, message: "Not Found Banner", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

//getbyIdSupplier
module.exports.getyByIdSupplier = async (req, res) => {
    try {
        const { _id } = req.body;
        const supplierData = await supplier.findById({ _id: _id })
        if (supplierData) {
            res.send({ success: true, message: "Get Supplier Details Successfully", data: supplierData })
        } else {
            res.send({ success: true, message: "Not Found Supplier", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//Add Sku
module.exports.addSku = async (req, res) => {
    try {
        const { skuNumber, name, supplier, category, description, cost, costwithgst } = req.body;
        if (name && skuNumber && supplier && category && description && cost && costwithgst) {
            const sku = new skuModel({
                name: name,
                skuNumber: skuNumber,
                supplier: supplier,
                category: category,
                description: description,
                cost: cost,
                costwithgst: costwithgst,
            })
            await sku.save()
            res.send({ success: true, message: "Sku Add Successfully", data: sku })
        } else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

//updateSku
module.exports.updatedSku = async (req, res) => {
    try {
        const { skuNumber, name, supplier, category, description, cost, costwithgst, _id } = req.body;
        if (name && skuNumber && supplier && category && description && cost && costwithgst) {
            const skuData = await skuModel.updateOne(
                { _id: mongoose.Types.ObjectId(_id) },
                {
                    $set: {
                        name: name,
                        skuNumber: skuNumber,
                        supplier: supplier,
                        category: category,
                        description: description,
                        cost: cost,
                        costwithgst: costwithgst,
                    }
                })
            if (skuData.modifiedCount === 1) {
                res.send({ success: true, message: "Sku Updated Successfully", data: null })
            } else {
                res.send({ success: false, message: "Sku Don't Updated", data: null })
            }
        } else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

//getAllSku..................
module.exports.getAllSku = async (req, res) => {
    try {
        const skuData = await skuModel.find()
        if (skuData.length > 0) {
            res.send({ success: true, message: "Get All Sku Successfully", data: skuData })
        } else {
            res.send({ success: true, message: "Not Found Sku", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

//addStock...............................................
module.exports.addStock = async (req, res) => {
    try {
        const { selectSku, selectQuantity, date } = req.body;
        if (selectSku && selectQuantity && date) {
            const sku = new stockModel({
                selectSku: selectSku,
                selectQuantity: selectQuantity,
                date: date,
            })
            await sku.save()
            res.send({ success: true, message: "Stock Add Successfully", data: sku })
        } else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

//updateSku
module.exports.updatedStock = async (req, res) => {
    try {
        const { selectSku, selectQuantity, date, _id } = req.body;
        if (selectSku && selectQuantity && date, _id) {
            const Stock = await stockModel.updateOne(
                { _id: mongoose.Types.ObjectId(_id) },
                {
                    $set: {
                        selectSku: selectSku,
                        selectQuantity: selectQuantity,
                        date: date,
                    }
                })
            if (Stock.modifiedCount === 1) {
                res.send({ success: true, message: "Stock Updated Successfully", data: null })
            } else {
                res.send({ success: false, message: "Stock Don't Updated", data: null })
            }
        } else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

//getAllStock..................
module.exports.getAllStock = async (req, res) => {
    try {
        const stockData = await stockModel.find()
        if (stockData.length > 0) {
            res.send({ success: true, message: "Get All Stock Successfully", data: stockData })
        } else {
            res.send({ success: true, message: "Not Found Stock", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//addStockout...............................................
module.exports.addStockOut = async (req, res) => {
    try {
        const { jobOrder, receiverName, jobNature, issuedBy, totalMaterialCost } = req.body;
        if (jobOrder && receiverName && jobNature && issuedBy && totalMaterialCost) {
            const skuOut = new stockOutModel({
                jobOrder: jobOrder,
                receiverName: receiverName,
                jobNature: jobNature,
                issuedBy: issuedBy,
                totalMaterialCost: totalMaterialCost
            })
            await skuOut.save()
            res.send({ success: true, message: "StockOut  Add Successfully", data: skuOut })
        } else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

//addVehicle...............................................
module.exports.addvehicle = async (req, res) => {
    try {
        const { vehicleName, vehicleBrand, driver } = req.body;
        if (vehicleName && vehicleBrand && driver) {
            const vehicle = new vehicleModel({
                vehicleName: vehicleName,
                vehicleBrand: vehicleBrand,
                driver: driver,
            })
            await vehicle.save()
            res.send({ success: true, message: "Vehicle Add Successfully", data: vehicle })
        } else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}

// updateVehicle......................

module.exports.updatedVehicle = async (req, res) => {
    try {
        const { vehicleName, vehicleBrand, driver, _id } = req.body;
        if (vehicleName && vehicleBrand && driver, _id) {
            const vehicleUpdate = await vehicleModel.updateOne(
                { _id: mongoose.Types.ObjectId(_id) },
                {
                    $set: {
                        vehicleName: vehicleName,
                        vehicleBrand: vehicleBrand,
                        driver: driver,
                    }
                })
            if (vehicleUpdate.modifiedCount === 1) {
                res.send({ success: true, message: "Vehicle Updated Successfully", data: null })
            } else {
                res.send({ success: false, message: "Vehicle Don't Updated", data: null })
            }
        } else {
            res.send({ success: false, message: "All Fields Are Required", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//deleteVehicle
module.exports.deleteVehicle = async (req, res) => {
    try {
        const { _id } = req.body;
        const deleteData = await vehicleModel.findOneAndDelete({ id: _id })
        if (deleteData) {
            res.send({ success: true, message: "Vehicle Delete Successfully", data: deleteData })
        } else {
            res.send({ success: false, message: "Vehicle Does'nt Delete", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//getAllVehicle
module.exports.getAllVehicle = async (req, res) => {
    try {
        const VehicleData = await vehicleModel.find()
        if (VehicleData.length > 0) {
            res.send({ success: true, message: "Get All Vehicle Successfully", data: VehicleData })
        } else {
            res.send({ success: true, message: "Not Found Vehicle", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}
//getbyIdVehicle
module.exports.getyByIdVehicle = async (req, res) => {
    try {
        const { _id } = req.body;
        const VehicleData = await vehicleModel.findById({ _id: _id })
        if (VehicleData) {
            res.send({ success: true, message: "Get Vehicle Details Successfully", data: VehicleData })
        } else {
            res.send({ success: true, message: "Not Found Vehicle", data: null })
        }
    } catch (err) {
        res.send({ success: false, message: "Internal Server Error", data: null })
    }
}