// app/apis/userApis.js

//include any mongodb models here
var User = require('../../app/models/user');

module.exports = function(app) {

  app.post('/setName', function(req, res) {
    if(!req.user) {
      res.send({success: false});
    }
    User.findOne({'user.email': req.user.user.email}, function(err, user) {
      if(err)
        throw err;
      console.log('Preferred name for: ' + user.user.email + ' set to: '+ req.body.name);
      user.user.name = req.body.name;
      user.save();
      res.send({success: true});
    });
  });

app.get('/getReminderBirthControlDaily', function(req, res) {
    if(!req.user) {
      res.send({success: false});
    }
    User.findOne({'user.email': req.user.user.email}, function(err, user) {
      if(err)
        throw err;
    res.send({success: true, reminderBirthControlDaily: user.user.reminderBirthControlDaily});
  });
});

app.get('/getReminderBirthControlRefill', function(req, res) {
    if(!req.user) {
      res.send({success: false});
    }
    User.findOne({'user.email': req.user.user.email}, function(err, user) {
      if(err)
        throw err;
    res.send({success: true, reminderBirthControlRefill: user.user.reminderBirthControlRefill});
  });
});

app.get('/getReminderBirthControlRenewal', function(req, res) {
    if(!req.user) {
      res.send({success: false});
    }
    User.findOne({'user.email': req.user.user.email}, function(err, user) {
      if(err)
        throw err;
    res.send({success: true, reminderBirthControlRenewal: user.user.reminderBirthControlRenewal});
  });
});

app.get('/getReminderYearlyAppointment', function(req, res) {
    if(!req.user) {
      res.send({success: false});
    }
    User.findOne({'user.email': req.user.user.email}, function(err, user) {
      if(err)
        throw err;
    res.send({success: true, reminderYearlyAppointment: user.user.reminderYearlyAppointment});
  });
});

app.get('/getReminderYearlyAppointmentMonth', function(req, res) {
    if(!req.user) {
      res.send({success: false});
    }
    User.findOne({'user.email': req.user.user.email}, function(err, user) {
      if(err)
        throw err;
    res.send({success: true, reminderYearlyAppointmentMonth: user.user.reminderYearlyAppointmentMonth});
  });
});

app.post('/setReminders', function(req, res) {
  if(!req.user) {
    res.send({success: false});
  }
  User.findOne({'user.email': req.user.user.email}, function(err, user) {
    if(err)
      throw err;
    user.user.reminderBirthControlDaily = req.body.reminderBirthControlDaily;
    user.user.reminderBirthControlRefill = req.body.reminderBirthControlRefill;
    user.user.reminderBirthControlRenewal = req.body.reminderBirthControlRenewal;
    user.user.reminderYearlyAppointment = req.body.reminderYearlyAppointment;
    user.user.reminderYearlyAppointmentMonth = req.body.reminderYearlyAppointmentMonth;

    //console.log(req.body.reminderBirthControlDaily);
    //console.log(req.body.reminderBirthControlRefill);
    //console.log(req.body.reminderBirthControlRenewal);
    //console.log(req.body.reminderYearlyAppointment);
    //console.log(req.body.reminderYearlyAppointmentMonth);

    user.save();
    res.send({success: true});
  });
});

};
