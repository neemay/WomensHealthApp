// app/modules/period.js

var mongoose = require('mongoose');

var periodSchema = mongoose.Schema({
  period: {
    email: String,
    periodId: String,
    startDate: String,
    endDate: String
  }
});

module.exports = mongoose.model('Period', periodSchema);