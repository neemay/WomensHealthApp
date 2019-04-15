// app/modules/period.js
//Database model for the weight object

var mongoose = require('mongoose');

var weightSchema = mongoose.Schema({
  weight: {
    email: String,
    recordDate: String,
    weightVal: String,
  }
});

module.exports = mongoose.model('Weight', weightSchema);
