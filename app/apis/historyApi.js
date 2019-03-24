// app/apis/historyApi.js

//include any mongodb models here
var Period = require('../../app/models/period');
var User = require('../../app/models/user');
var PeriodSymptom = require('../../app/models/periodSymptom');
var Prescription = require('../../app/models/prescription');

module.exports = function(app) {
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


};
