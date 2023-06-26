(function(){
  var mongoose = require('mongoose');
  var promocodeSchema = new mongoose.Schema({
    code_name: {
      type: String,
      required: true
    },
	title: {
      type: String,  
      required: true 
    },
	description: {
      type: String,  
      required: false 
    },
	discount_type: {
      type: String,  // fixed, percentage
      required: true 
    },
	discount_amount: {
      type: Number,
      required: true
    },
    valid_start_date: {
      type: Date,
      required: false
    },
	valid_end_date: {
      type: Date,
      required: false
    },
    active:{
      type: Boolean,
      required: true,
	  default: true
    },
    created_at: { type: Date, default: Date.now }
  });
  
  var Promocode = mongoose.model('promocode', promocodeSchema);
  module.exports = Promocode;
})();
