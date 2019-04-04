// app/modules/period.js

var mongoose = require('mongoose');

var weightSchema = mongoose.Schema({
  period: {
    email: String,
    recordDate: String,
    weightVal: String,
  }
});

module.exports = mongoose.model('Period', periodSchema);
