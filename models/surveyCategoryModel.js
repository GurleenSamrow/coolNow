const mongoose = require('mongoose');
const Schema = mongoose.Schema;
let surveyCategorySchema = new Schema({
  name: { type: String },
  addedBY: { type: Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['active', 'deleted'], default: 'active' },
}, { collection: 'surveyCategory', timestamps: true });
module.exports = mongoose.model('surveyCategory', surveyCategorySchema);
