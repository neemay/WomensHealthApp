// app/models/prescription.js
//Database model for the prescription object 

var mongoose = require('mongoose');

var prescriptionSchema = mongoose.Schema({
  prescription: {
    email: String,
    prescriptionId: String,
    name: String,
    refills: String,
    daysSupply: String,
    refillDate: String,
    expiration: String,
    startDate: String,
    status: String,
    notes: String
  }
});

module.exports = mongoose.model('Prescription', prescriptionSchema);