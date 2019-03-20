// app/apis/prescriptionApi.js

//include any mongodb models here
var User = require('../../app/models/user');
var Prescription = require('../../app/models/prescription');

module.exports = function(app) {
  //Function to add a prescription
  app.post('/addPrescription', function(req, res) {
    var newPrescription = new Prescription();
    newPrescription.prescription.prescriptionId = req.user.user.email + req.body.name.trim().replace(" ", "");
    newPrescription.prescription.name = req.body.name;
    newPrescription.prescription.refills = req.body.refills;
    newPrescription.prescription.expiration = req.body.expiration.substr(0, 10);
    newPrescription.prescription.startDate = req.body.startDate.substr(0, 10);
    newPrescription.prescription.status = req.body.status;
    newPrescription.prescription.notes = req.body.notes;
    newPrescription.save(function(err) {
      if(err)
        throw err;
      res.send({success: true});
    });
  });
};
