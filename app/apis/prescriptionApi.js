// app/apis/prescriptionApi.js

//include any mongodb models here
var Prescription = require('../models/prescription');
var PrescriptionSymptom = require('../models/prescriptionSymptom');
var csv=require('csvtojson');

module.exports = function(app) {
  //Function to add a prescription
  app.post('/addPrescription', function(req, res) {
    var newPrescription = new Prescription();
    newPrescription.prescription.email = req.user.user.email;
    newPrescription.prescription.prescriptionId = req.user.user.email + ':' + req.body.name.replace(/ /g, '').trim() + ':' + req.body.startDate;
    newPrescription.prescription.name = req.body.name;
    newPrescription.prescription.refills = req.body.refills;
    newPrescription.prescription.daysSupply = req.body.daysSupply;
    newPrescription.prescription.refillDate = req.body.refillDate;
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
        res.send({data: jsonObj});
      });
  });

  app.get('/getUserPrescriptions', function(req, res) {
    Prescription.find({'prescription.email': req.user.user.email}, function(err, prescriptions) {
      res.send({success: true, data: prescriptions});
    });
  });


  app.post('/updatePrescription', function(req, res) {
    Prescription.findOne({'prescription.prescriptionId': req.body.id}, function(err, prescription) {
      if(err)
        throw err;
      prescription.prescription.refills = req.body.refills;
      prescription.prescription.daysSupply = req.body.daysSupply;
      prescription.prescription.refillDate = req.body.refillDate;
      prescription.prescription.expiration = req.body.expiration;
      prescription.prescription.status = req.body.status;
      prescription.prescription.notes = req.body.notes;
      prescription.save();
      res.send({success: true});
    });
  });

  app.post('/deletePrescription', function(req, res) {
    Prescription.deleteOne({'prescription.prescriptionId': req.body.id}, function(err) {
      if(err)
        throw err;
      PrescriptionSymptom.deleteMany({'prescriptionSymptom.prescriptionId': req.body.id}, function(err) {
        if(err)
          throw err;
        res.send({success: true});
      });
    });
  });

  app.post('/addPrescriptionSymptom', function(req, res) {
    PrescriptionSymptom.findOne({'prescriptionSymptom.prescriptionId': req.body.id}, function(err, symptom) {
      if(symptom) {
        symptom.prescriptionSymptom.date = req.body.date;
        symptom.prescriptionSymptom.spotting = req.body.spotting;
        symptom.prescriptionSymptom.nausea = req.body.nausea;
        symptom.prescriptionSymptom.headache = req.body.headache;
        symptom.prescriptionSymptom.soreBreasts = req.body.soreBreasts;
        symptom.prescriptionSymptom.moodSwings = req.body.moodSwings;
        symptom.prescriptionSymptom.notes = req.body.notes;
        symptom.save();
        res.send({success: true});
      }
      else {
        var newSymptom = new PrescriptionSymptom();
        newSymptom.prescriptionSymptom.prescriptionId = req.body.id;
        newSymptom.prescriptionSymptom.date = req.body.date;
        newSymptom.prescriptionSymptom.spotting = req.body.spotting;
        newSymptom.prescriptionSymptom.nausea = req.body.nausea;
        newSymptom.prescriptionSymptom.headache = req.body.headache;
        newSymptom.prescriptionSymptom.soreBreasts = req.body.soreBreasts;
        newSymptom.prescriptionSymptom.moodSwings = req.body.moodSwings;
        newSymptom.prescriptionSymptom.notes = req.body.notes;
        newSymptom.save(function(err) {
          if(err)
            throw err;
          res.send({success: true});
        });
      }
    });
  });
  
  app.get('/getPrescriptionSymptomsById', function(req, res) {
    //console.log(req);
    //console.log(req.query.id);
    PrescriptionSymptom.find({'prescriptionSymptom.prescriptionId': req.query.id}, function(err, symptoms) {
      //console.log(symptoms);
      res.send({success: true, data: symptoms});
    });
  });
};
