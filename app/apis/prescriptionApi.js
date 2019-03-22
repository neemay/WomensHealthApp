// app/apis/prescriptionApi.js

//include any mongodb models here
var User = require('../models/user');
var Prescription = require('../models/prescription');
var csv=require('csvtojson');

module.exports = function(app) {
  //Function to add a prescription
  app.post('/addPrescription', function(req, res) {
    var newPrescription = new Prescription();
    newPrescription.prescription.email = req.user.user.email;
    newPrescription.prescription.prescriptionId = req.user.user.email + ":" + req.body.name.replace(/ /g, "").trim() + ":" + req.body.startDate;
    newPrescription.prescription.name = req.body.name;
    newPrescription.prescription.refills = req.body.refills;
    newPrescription.prescription.expiration = req.body.expiration;
    newPrescription.prescription.startDate = req.body.startDate;
    newPrescription.prescription.status = req.body.status;
    newPrescription.prescription.notes = req.body.notes;
    newPrescription.save(function(err) {
      if(err)
        throw err;
      res.send({success: true});
    });
  });
  
  app.get('/getPrescriptionList', function(req, res) {
    csv().fromFile('./public/resources/prescription-names.csv')
    .then((jsonObj)=>{
        //console.log(jsonObj);
        res.send({data: jsonObj});
    });
  });
  
  app.get('/getUserPrescriptions', function(req, res) {
    Prescription.find({'prescription.email': req.user.user.email}, function(err, prescriptions) {
      //console.log(prescriptions);
      res.send({success: true, data: prescriptions});
    });
  });
  
  app.post('/updatePrescription', function(req, res) {
    var id = req.user.user.email + ":" + req.body.name.replace(/ /g, "").trim() + ":" + req.body.startDate;
    //console.log(id);
    Prescription.findOne({'prescription.prescriptionId': id}, function(err, prescription) {
      //console.log(prescription);
      if(err)
        throw err;
      prescription.prescription.refills = req.body.refills;
      prescription.prescription.expiration = req.body.expiration;
      prescription.prescription.status = req.body.status;
      prescription.prescription.notes = req.body.notes;
      prescription.save();
      res.send({success: true});
    });
  });
};
