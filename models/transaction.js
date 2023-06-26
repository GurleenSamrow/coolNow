(function(){
  var mongoose = require('mongoose');
  var transactionSchema = new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'user',
      required: true
    },
	user_name:{
		type: String,
		required: true
	},
	booking_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'booking',
      required: true
    },
	stripe_email:{
		type: String,
		required: false
	},
	stripe_token:{
		type: String,
		required: false
	},
	stripe_customer_id:{
		type: String,
		required: false
	},
    transaction_id: {
      type: String,
      required: false
    },
	transaction_amount: {
      type: Number,
      required: true
    },
	transaction_currency:{
		type: String,
		required: false,
		default: 'USD'
	},
    transaction_status:{
      type: String,
      required: false
    },
    transaction_mode:{
      type: String,
      required: true,
      default: 'online'
    },
    transaction_details:{
      type: mongoose.Schema.Types.Mixed,
      required: false
    },
	payment_live_mode:{
		type: Boolean,
		required: false
    },
	payment_failure_message:{
		type: String,
		required: false
    },
	payment_failure_code:{
		type: String,
		required: false
    },
	timezone_created_at:{
		type: Date,
		required: false
	},
    created_at: { type: Date, default: Date.now }
  });
  
  var Transaction = mongoose.model('transaction', transactionSchema);
  module.exports = Transaction;
})();
