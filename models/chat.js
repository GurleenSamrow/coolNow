(function(){
	var mongoose = require('mongoose');

	var chatSchema = new mongoose.Schema({
		chat_id: {
		  type: Number,
		  required: true
		},
		sender_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			required: true 
		},
		receiver_id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'user',
			required: true
		},
		message: {
			type: String,
			trim: true,
			required: false 
		},
		type: {
			type: String,
			required: true,
			default: 'text'  // text, image, video
		},
		image_url: {
			type: String, 
			required: false,
		},
		video_url: {
			type: String, 
			required: false,
		},
		timezone_created_at:{
			type: Date,
			required: false
		},
		created_at: { type: Date, default: Date.now }
	});

	var Chat = mongoose.model('chat', chatSchema);

	module.exports = Chat;
	
})();