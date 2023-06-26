const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let annualLeaveSchema = new Schema({
  startdate: { type: Date },
  enddate: { type: Date },
  totalLeaves: { type: Number },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
}, { collection: 'annualLeave', timestamps: true });

module.exports = mongoose.model('annualLeave', annualLeaveSchema);
