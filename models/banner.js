(function () {
  var mongoose = require('mongoose');
  var bannerSchema = new mongoose.Schema({
    banner_title: {
      type: String,
      required: true
    },
    banner_description: {
      type: String,
      required: false
    },
    banner_image: {
      type: String,
      required: true
    },
    active: {
      type: Boolean,
      required: true,
      default: true
    },
    created_at: { type: Date, default: Date.now }
  });

  var Banner = mongoose.model('banner', bannerSchema);
  module.exports = Banner;
})();
