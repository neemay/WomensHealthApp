// app/models/prescriptionSymptom.js
//Database model for the prescription symptom object

var mongoose = require('mongoose');

var prescriptionSymptomSchema = mongoose.Schema({
  prescriptionSymptom: {
    prescriptionId: String,
    date: String,
    spotting: String,
    nausea: String,
    headache: String,
    soreBreasts: String,
    moodSwings: String,
    notes: String
  }
});

module.exports = mongoose.model('PrescriptionSymptom', prescriptionSymptomSchema);