// app/modules/period.js
//Database model for the period symptom object

var mongoose = require('mongoose');

var periodSymptomSchema = mongoose.Schema({
  periodSymptom: {
    periodId: String,
    date: String,
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