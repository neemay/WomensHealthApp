// app/models/prescription.js

var mongoose = require('mongoose');

var prescriptionSchema = mongoose.Schema({
  prescription: {
    prescriptionId: String,
    name: String,
    refills: String,
    expiration: Date,
    startDate: Date,
    status: Boolean,
    notes: String
  }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);