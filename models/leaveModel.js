const mongoose        = require('mongoose');
const Schema          = mongoose.Schema;
let leaveSchema = new Schema({
  startdate           : {type: Date},
  enddate             : {type: Date},
  reason              : {type: String},
  userId              : {type: Schema.Types.ObjectId, ref: 'user'},
  document            : [],
  status              : {type: String, enum: ['0', '1'],default:'0'},
  leavestatus : {type: String, enum: ['active', 'deleted'],default:'active'},
}, {collection: 'leaves', timestamps: true});

module.exports = mongoose.model('leaves', leaveSchema);
