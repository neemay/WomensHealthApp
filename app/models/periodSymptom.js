// app/modules/period.js

var mongoose = require('mongoose');

var periodSymptomSchema = mongoose.Schema({
  periodSymptom: {
    periodId: String,
    date: Date,
    cramps: String,
    nausea: String,
    headache: String,
    flow: String,
    backPain: String,
    bloating: String,
    notes: String
  }
});

module.exports = mongoose.model('PeriodSymptom', periodSymptomSchema);