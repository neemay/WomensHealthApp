// app/apis/periodApi.js

//include any mongodb models here
var Period = require('../../app/models/period');
var User = require('../../app/models/user');
var PeriodSymptom = require('../../app/models/periodSymptom');

//You can get the user's email by doing the following: req.user.user.email

module.exports = function(app) {
  //Function to get the current user's preferred name
  app.get('/getUserName', function(req, res) {
    if(!req.user) {
      res.send({success: false});
    }
    res.send({success: true, name: req.user.user.name});
  });
  
  //Function to get the current user's email
  app.get('/getEmail', function(req, res) {
    if(!req.user) {
      res.send({success: false});
    }
    res.send({success: true, email: req.user.user.email});
  });
  
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
        Period.findOne({'period.endDate': null}, function(err, period) {
          if(period)
            currentPeriod = period.period.startDate;
          res.send({success: true, isOnPeriod: isOnPeriod, currentPeriod: currentPeriod});
        });
      }
      else { //return the end date of the most recent period
        var currentDate = new Date();
        Period.findOne({'period.email': user.user.email},null, {sort: {'period.endDate': -1}}, function(err, period){
          if(period) {
            lastPeriod = period.period.endDate;
            console.log("lastPeriod: " + lastPeriod);
          }
          res.send({success: true, isOnPeriod: isOnPeriod, lastPeriod: lastPeriod});
        });
      }
    });
  });
  
  //Function to add the start date for a user's period
  app.post('/addPeriodStart', function(req, res) {
    var newPeriod = new Period();
    newPeriod.period.periodId = req.user.user.email + ":" + req.body.startDate;
    newPeriod.period.email = req.user.user.email;
    newPeriod.period.startDate = req.body.startDate;
    newPeriod.period.endDate = null;
    newPeriod.save(function(err) {
      if(err)
        throw err;
      console.log("Added period with start date " + req.body.startDate);
      User.findOne({'user.email' : req.user.user.email}, function(err, user) {
        user.user.isOnPeriod = true;
        user.save();
      });
      res.send({success: true});
    });
    
  });
  
  //Function to add the end date for a user's period
  app.post('/addPeriodEnd', function(req, res) {
    Period.findOne({'period.endDate': null}, function(err, period) {
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
  
  //Function to add period symptoms
  app.post('/addPeriodSymptom', function(req, res) {
    var newSymptom = new PeriodSymptom();
    newSymptom.periodSymptom.periodId = req.user.user.email + ":" + req.body.periodStartDate.substr(0, 10);
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
    
  });
};