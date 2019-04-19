// app/apis/prescriptionApi.js
// This file contains the api functions related to prescriptions

//Models referenced by this file
var Prescription = require('../models/prescription');
var PrescriptionSymptom = require('../models/prescriptionSymptom');
var csv=require('csvtojson');

module.exports = function(app) {
  //Endpoint: addPrescription
  //Adds a new prescription for a user with the given fields using the id email:prescription-name:startDate
  app.post('/addPrescription', function(req, res) {
    var newPrescription = new Prescription();
    newPrescription.prescription.email = req.user.user.email;
    newPrescription.prescription.prescriptionId = req.user.user.email + ':' + req.body.name.replace(/ /g, '-').trim() + ':' + req.body.startDate;
    newPrescription.prescription.name = req.body.name;
    newPrescription.prescription.refills = req.body.refills;
    newPrescription.prescription.daysSupply = req.body.daysSupply;
    newPrescription.prescription.refillDate = req.body.refillDate;
    newPrescription.prescription.expiration = req.body.expiration;
    newPrescription.prescription.startDate = req.body.startDate;
    newPrescription.prescription.status = req.body.status;
    newPrescription.prescription.notes = req.body.notes;
    newPrescription.save(function(err) {
      if(err) {
        console.log(err);
        res.send({success: false});
      }
      res.send({success: true});
    });
  });

  //Endpoint: getPrescriptionList
  //Returns the list of prescriptions that are stored in the prescription-names CSV file as a json object
  app.get('/getPrescriptionList', function(req, res) {
    csv().fromFile('./public/resources/prescription-names.csv')
      .then((jsonObj)=>{
        res.send({data: jsonObj});
      });
  });

  //Endpoint: getUserPrescriptions
  //Returns the list of prescriptions for this user
  app.get('/getUserPrescriptions', function(req, res) {
    Prescription.find({'prescription.email': req.user.user.email}, null, {sort: {'prescription.status': 1}}, function(err, prescriptions) {
      res.send({success: true, data: prescriptions});
    });
  });
  
  //Endpoint: getUserPrescriptions
  //Returns the list of active prescriptions for this user
  app.get('/getActiveUserPrescriptions', function(req, res) {
    Prescription.find({'prescription.email': req.user.user.email, 'prescription.status': 'Active'}, function(err, prescriptions) {
      res.send({success: true, data: prescriptions});
    });
  });

  //Endpoint: updatePrescription
  //Updates the fields for this prescription given its id
  app.post('/updatePrescription', function(req, res) {
    Prescription.findOne({'prescription.prescriptionId': req.body.id}, function(err, prescription) {
      if(err) {
        console.log(err);
        res.send({success: false});
      }
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

  //Endpoint: deletePrescription
  //Deletes a prescription given its id
  //Also deletes and symptoms associated with this prescription
  app.post('/deletePrescription', function(req, res) {
    Prescription.deleteOne({'prescription.prescriptionId': req.body.id}, function(err) {
      if(err) {
        console.log(err);
        res.send({success: false});
      }
      PrescriptionSymptom.deleteMany({'prescriptionSymptom.prescriptionId': req.body.id}, function(err) {
        if(err) {
          console.log(err);
          res.send({success: false});
        }
        res.send({success: true});
      });
    });
  });

  //Endpoint: addPrescriptionSymptoms
  //Adds a symptom object for this prescription
  //If a prescription symptom already exists with this id and date, the current symptom gets updates
  app.post('/addPrescriptionSymptom', function(req, res) {
    PrescriptionSymptom.findOne({'prescriptionSymptom.prescriptionId': req.body.id, 'prescriptionSymptom.date': req.body.date}, function(err, symptom) {
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
          if(err) {
            console.log(err);
            res.send({success: false});
          }
          res.send({success: true});
        });
      }
    });
  });
  
  //Endpoint: getPrescriptionSymptomsById
  //Returns the prescription symptoms for this user given the prescription id
  app.get('/getPrescriptionSymptomsById', function(req, res) {
    PrescriptionSymptom.find({'prescriptionSymptom.prescriptionId': req.query.id}, null, {sort: {'prescriptionSymptom.date': 1}}, function(err, symptoms) {
      res.send({success: true, data: symptoms});
    });
  });
  
  //Endpoint: getPrescriptionSymptomsByDate
  //Returns the prescription symptoms for this user given the date
  app.get('/getPrescriptionSymptomsByDate', function(req, res) {
    var pattern = '.*' + req.user.user.email + '.*';
    PrescriptionSymptom.find({'prescriptionSymptom.prescriptionId': {$regex: pattern}, 'prescriptionSymptom.date': req.query.date}, function(err, symptoms) {
      res.send({success: true, data: symptoms});
    });
  });
};
