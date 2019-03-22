// app/models/prescription.js

var mongoose = require('mongoose');

var prescriptionSchema = mongoose.Schema({
  prescription: {
    email: String,
    prescriptionId: String,
    name: String,
    refills: String,
    expiration: String,
    startDate: String,
    status: Boolean,
    notes: String
  }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);