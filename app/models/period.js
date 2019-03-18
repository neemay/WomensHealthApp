// app/modules/period.js

var mongoose = require('mongoose');

var periodSchema = mongoose.Schema({
  period: {
    email: String,
    periodId: String,
    startDate: Date,
    endDate: Date
  }
});

module.exports = mongoose.model('Period', periodSchema);