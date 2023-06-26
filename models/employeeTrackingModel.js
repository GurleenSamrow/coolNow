const mongoose        = require('mongoose');
const Schema          = mongoose.Schema;
let eomloyeeTrackingSchema = new Schema({
  date                : {type: Date},
  type                : {type: String, enum: ['0', '1','2'],default:'0'},
  userId              : {type: Schema.Types.ObjectId, ref: 'user'},
  reason              : {type: String},
  message             : {type: String},
  lateHours           : {type:String},
  chekcIntype         : {type:String},
  location            : {
                          lng: {type: Number},
                          lat: {type: Number},
                        },
   }, {collection: 'employeeTracking', timestamps: true});

eomloyeeTrackingSchema.index({ lastLocation: "2dsphere" });
module.exports = mongoose.model('employeeTracking', eomloyeeTrackingSchema);
