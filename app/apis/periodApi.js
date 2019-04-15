// app/apis/periodApi.js
// This file contains the api functions related to periods

//Models referenced by this file
var Period = require('../../app/models/period');
var User = require('../../app/models/user');
var PeriodSymptom = require('../../app/models/periodSymptom');

module.exports = function(app) {
  //Endpoint: isOnPeriod
  //Returns whether or not the user is on their period
  //If the user is on their period, return the start date of the current period
  //If the user is not on their period, return the end date of the most recent period
  app.get('/isOnPeriod', function(req, res) {
    var isOnPeriod = false;
    var currentPeriod = null;
    var lastPeriod = null;
    if(!req.user) {
      res.send({success: false});
    }
    User.findOne({'user.email': req.user.user.email}, function(err, user) {
      if(err)
        throw err;
      isOnPeriod = user.user.isOnPeriod;
      if(isOnPeriod) { //return the start date of the current period
        Period.findOne({'period.email': user.user.email, 'period.endDate': null}, function(err, period) {
          if(period)
            currentPeriod = period.period.startDate;
          res.send({success: true, isOnPeriod: isOnPeriod, currentPeriod: currentPeriod});
        });
      }
      else { //return the end date of the most recent period
        Period.findOne({'period.email': user.user.email},null, {sort: {'period.endDate': -1}}, function(err, period){
          if(period) {
            lastPeriod = period.period.endDate;
          }
          res.send({success: true, isOnPeriod: isOnPeriod, lastPeriod: lastPeriod});
        });
      }
    });
  });

  //Endpoint: addPeriodStart
  //Creates a new period object for this user with the given start date and a null end date
  //Updates the user's isOnPeriod state to true
  app.post('/addPeriodStart', function(req, res) {
    var newPeriod = new Period();
    newPeriod.period.periodId = req.user.user.email + ':' + req.body.startDate;
    newPeriod.period.email = req.user.user.email;
    newPeriod.period.startDate = req.body.startDate;
    newPeriod.period.endDate = null;
    newPeriod.save(function(err) {
      if(err)
        throw err;
      User.findOne({'user.email' : req.user.user.email}, function(err, user) {
        user.user.isOnPeriod = true;
        user.save();
      });
      res.send({success: true});
    });

  });

  //Endpoint: addPeriodEnd
  //Finds the period for this user that has a null end date and set its end date
  //Updates the user's isOnPeriod state to false
  app.post('/addPeriodEnd', function(req, res) {
    Period.findOne({'period.email': req.user.user.email, 'period.endDate': null}, function(err, period) {
      if(err)
        throw err;
      period.period.endDate = req.body.endDate;
      period.save();
      User.findOne({'user.email' : req.user.user.email}, function(err, user) {
        user.user.isOnPeriod = false;
        user.save();
      });
      res.send({success: true});
    });
  });

  //Endpoint: addPeriodSymptom
  //Adds a symptom object for this period using the id email:startDate
  //If a period symptom already exists with this id and date, the current symptom gets updates
  app.post('/addPeriodSymptom', function(req, res) {
    var id = req.user.user.email + ':' + req.body.periodStartDate;
    PeriodSymptom.findOne({'periodSymptom.periodId': id, 'periodSymptom.date': req.body.date}, function(err, symptom) {
      if(symptom) {
        symptom.periodSymptom.date = req.body.date;
        symptom.periodSymptom.cramps = req.body.cramps;
        symptom.periodSymptom.nausea = req.body.nausea;
        symptom.periodSymptom.headache = req.body.headache;
        symptom.periodSymptom.flow = req.body.flow;
        symptom.periodSymptom.backPain = req.body.backPain;
        symptom.periodSymptom.bloating = req.body.bloating;
        symptom.periodSymptom.notes = req.body.notes;
        symptom.save();
        res.send({success: true});
      }
      else {
        var newSymptom = new PeriodSymptom();
        newSymptom.periodSymptom.periodId = id;
        newSymptom.periodSymptom.date = req.body.date;
        newSymptom.periodSymptom.cramps = req.body.cramps;
        newSymptom.periodSymptom.nausea = req.body.nausea;
        newSymptom.periodSymptom.headache = req.body.headache;
        newSymptom.periodSymptom.flow = req.body.flow;
        newSymptom.periodSymptom.backPain = req.body.backPain;
        newSymptom.periodSymptom.bloating = req.body.bloating;
        newSymptom.periodSymptom.notes = req.body.notes;
        newSymptom.save(function(err) {
          if(err)
            throw err;
          res.send({success: true});
        });
      }
    });
  });

  //Endpoint: getUserPeriods
  //Returns all of the periods for a given user
  app.get('/getUserPeriods', function(req, res) {
    Period.find({'period.email': req.user.user.email}, function(err, periods) {
      res.send({success: true, data: periods});
    });
  });
  
  //Endpoint: getPeriodSymptomsById
  //Returns all of the symptoms for a period given the periodId
  app.get('/getPeriodSymptomsById', function(req, res) {
    PeriodSymptom.find({'periodSymptom.periodId': req.query.id}, function(err, symptoms) {
      res.send({success: true, data: symptoms});
    });
  });
  
  //Endpoint: getPeriodSymptomsByDate
  //Returns all of the symptoms for a given period for this user given the date
  app.get('/getPeriodSymptomsByDate', function(req, res) {
    var pattern = '.*' + req.user.user.email + '.*';
    PeriodSymptom.find({'periodSymptom.periodId': {$regex: pattern}, 'periodSymptom.date': req.query.date}, function(err, symptoms) {
      res.send({success: true, data: symptoms});
    });
  });
};
