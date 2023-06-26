
const serviceMode = require('../models/serviceModel');
const moment = require('moment');


function Service() {
    
}
/**
 * @api {post} /api/v1/add/service Add Service
 * @apiVersion 1.0.0
 * @apiName Add Service
 * @apiGroup Services
 * @apiHeader {String} authorization User's authentication token.
 * @apiSuccess {boolean} success=true Request successfully completed.
 *@apiParamExample {json} Request-Example:
 * 
 * {
 *  "title":"first service"
    "description":"first service"
    "price":"10"
    "commision_margin":"11"
    "commision_amount":"123"
    "cost":"123"
 * 	"sub_service": [
    {
        "title":"first service"
        "description":"first service"
    }
 ],
 * 	"user_type": "test@123",
 * }
 * 
 * @apiParamExample {json} Success-Response:
{
    "success": true,
    "message": "Request completed successfully",
    "payload": {
        "data": [
            {
    "success": true,
    "message": "Request completed successfully",
    "payload": {
        "data": [
            {
                "_id": "64893e3d8e2bd2ab18272ca7",
                "title": "first service",
                "description": "first service",
                "price": "10",
                "commision_margin": "11",
                "commision_amount": "123",
                "cost": "123",
                "status": "active",
                "sub_service": [],
                "createdAt": "2023-06-14T04:12:45.267Z",
                "updatedAt": "2023-06-14T04:12:45.267Z",
                "__v": 0
            }
        ]
    }
}
        ]
    }
}
 * @apiError {json} InvalidParamError {message: 'Invalid parameters were passed.',success: false}
 * @apiError {json} AuthenticationTokenNotFound { message: 'Authentication token not provided!' , success: false}
 * @apiError {json} AuthTokenExpiredError { message: 'Session expired. You need to login again.' , success: false, sessionExpired: true}
 */
Service.prototype.Add = (req, res) => {
    if (req.file && req.file.filename) {
        req.body.image = 'uploads/' + req.file.filename;
    }
    serviceModel.create(req.body, (err, data) => {
        if (err) {
                return res.Err(err);   
        } else {            
                return res.apiRes(200, true, 'Request completed successfully.', {data});         

        }
    });
};
Service.prototype.Detail = (req, res) => {

    serviceModel.findById(req.params.id, (err, data) => {
            if (err) {
                return res.Err(err);
            } else {
                
                if (!banner) {
                    return res.apiRes(409, false, 'model not found.');
                } else {
                    return res.apiRes(200, true, 'model Data.', {data});

                }
            }
            
        }).lean();
} 




Service.prototype.Update = (req, res) => {
    var conditions = { _id: req.params.id }
    if(req.body.image && req.body.image==''){
        delete req.body.image;
    }
    serviceModel.update(conditions,req.body, (err, data) => {
        if (err) {
            res.Err(err)
        } else {            
                return res.apiRes(200, true, 'Request completed successfully.', {data});         

        }
    });
};


Service.prototype.List = (req, res) => {

    //let query = {author: req.decoded._id, type: req.query.type, status: {$ne: 'deleted'}};
    /*if (req.decoded.userRole == 'admin') {
        //query = {type: req.query.type, status: {$ne: 'deleted'}};
    }*/
    let query           = {status: {$ne: 'deleted'}};
    let sortIndex = -1;
    let orderBy = {sort: {createdAt: sortIndex}};

    if (req.body['order'][0]['column'] && req.body['order'][0]['column'] == 0) {
        sortIndex = (req.body['order'][0]['dir'] && req.body['order'][0]['dir'] == 'desc') ? -1 : 1;
        orderBy = {sort: {title: sortIndex}};
    }  else if (req.body['order'][0]['column'] && req.body['order'][0]['column'] == 1) {
        sortIndex = (req.body['order'][0]['dir'] && req.body['order'][0]['dir'] == 'desc') ? -1 : 1;
        orderBy = {sort: {title: sortIndex}};
    } else if (req.body['order'][0]['column'] && req.body['order'][0]['column'] == 2) {
        sortIndex = (req.body['order'][0]['dir'] && req.body['order'][0]['dir'] == 'desc') ? -1 : 1;
        orderBy = {sort: {text: sortIndex}};
    }  else if (req.body['order'][0]['column'] && req.body['order'][0]['column'] == 3) {
        sortIndex = (req.body['order'][0]['dir'] && req.body['order'][0]['dir'] == 'desc') ? -1 : 1;
        orderBy = {sort: {sortOrder: sortIndex}};
    }else if (req.body['order'][0]['column'] && req.body['order'][0]['column'] == 4) {
        sortIndex = (req.body['order'][0]['dir'] && req.body['order'][0]['dir'] == 'desc') ? -1 : 1;
        orderBy = {sort: {createdAt: sortIndex}};
    }

    if (req.body['search']['value'] && req.body['search']['value'] != '') {
        let searchQuery = [
            {'title': {$regex: req.body['search']['value'], $options: 'i'}},
            {'text': {$regex: req.body['search']['value'], $options: 'i'}},
            {'sortOrder': {$regex: req.body['search']['value'], $options: 'i'}}
        ];

        query.$or = searchQuery;
    }

    async.waterfall([
        (callback) => {
            serviceModel.count(query, (error, countdata) => {
                if (error) {
                    callback(error, null)
                } else {
                    callback(null, countdata);
                }
            })
        },
        (countdata, callback) => {
            serviceModel.find(query, null, orderBy, (error, coupons) => {
                if (error) {
                    res.Err(error);
                } else {
                    let data        = [];
                    if (coupons.length > 0) {
                        async.each(coupons, (item, cb) => {
                            let nestedData = [];
                            let image = (item.image)? "<img src='/"+item.image+"' class='brand-image' height='50' width='50'>":'';
                            nestedData.push(image);
                            nestedData.push(item.title);
                            nestedData.push(item.text);
                            nestedData.push(item.sortOrder);
                            nestedData.push(moment(item.createdAt).format('DD MM YYYY'));
                            let action = '<div class="approve-button"><a href="/cms/editbanner/'+ item['_id']+'" class="view">Edit</a>';
                            action += '&nbsp;&nbsp;<a href="javascript:;" data-id="' + item['_id'] + '" data-type="Banner" class="reject" onclick="Adduser.userchangeStatus(this)">Delete</a></div>';
                            nestedData.push(action);
                            data.push(nestedData);
                            cb();

                        }, (err, resullt) => {
                            callback(null, data, countdata)
                        });

                    } else {
                        callback('coupon not found', null)
                    }

                }
            }).limit(parseInt(req.body.length)).skip(parseInt(req.body.start)).lean()
        }

    ], (error, data, countdata) => {
        if (error) {
            return res.json({draw: parseInt(req.body.draw), recordsTotal: 0, recordsFiltered: 0, data: []});
        } else {
            if(data){
                return res.json({draw: parseInt(req.body.draw), recordsTotal: parseInt(countdata), recordsFiltered: parseInt(countdata), data: data});
            }else{
                return res.json({draw: parseInt(req.body.draw), recordsTotal: 0, recordsFiltered: 0, data: []});
            }
           
        }
    });


};

Service.prototype.Delete = (req,res)=>{
    serviceModel.findByIdAndUpdate(req.body.id, {status: 'deleted'}, {new : true}, (err, task) => {
        if (err) {
            res.Err(err);
        } else {
            return res.apiRes(200, true, 'Trail deleted successfully.');
        }
    });

};

/**
 * @api {get} /api/v1/get/service Service list
 * @apiVersion 1.0.0
 * @apiName Service list
 * @apiGroup Services
 * @apiHeader {String} authorization User's authentication token.
 * @apiSuccess {boolean} success=true Request successfully completed.
 * @apiParamExample {json} Success-Response:
{
    "success": true,
    "message": "Request completed successfully",
    "payload": {
        "data": [
            {
    "success": true,
    "message": "Request completed successfully",
    "payload": {
        "data": [
            {
                "_id": "64893e3d8e2bd2ab18272ca7",
                "title": "first service",
                "description": "first service",
                "price": "10",
                "commision_margin": "11",
                "commision_amount": "123",
                "cost": "123",
                "status": "active",
                "sub_service": [],
                "createdAt": "2023-06-14T04:12:45.267Z",
                "updatedAt": "2023-06-14T04:12:45.267Z",
                "__v": 0
            }
        ]
    }
}
        ]
    }
}
 * @apiError {json} InvalidParamError {message: 'Invalid parameters were passed.',success: false}
 * @apiError {json} AuthenticationTokenNotFound { message: 'Authentication token not provided!' , success: false}
 * @apiError {json} AuthTokenExpiredError { message: 'Session expired. You need to login again.' , success: false, sessionExpired: true}
 */

Service.prototype.getService = (req,res)=>{
    serviceModel.find({status: 'active'},(err, data) => {
        if (err) {
            res.Err(err);
        } else {
            return res.apiRes(200, true, 'Request completed successfully', {data});
        }
    });

};


module.exports  = new Service();