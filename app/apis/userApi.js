// app/apis/userApis.js

//include any mongodb models here
var User = require('../../app/models/user');
var Prescription = require('../../app/models/prescription');
var nodemailer = require('nodemailer');
var emailcreds = require('../../email-creds.json');
var CronJob = require('cron').CronJob;

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: emailcreds
});

module.exports = function(app) {
  //Driver function to set the cron job to send reminder emails
  sendReminderEmails();
  
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

  app.get('/getReminderSettings', function(req, res) {
    if(!req.user) {
      res.send({success: false});
    }
    User.findOne({'user.email': req.user.user.email}, function(err, user) {
      if(err)
        throw err;
      res.send({success: true, 
        reminderBirthControlDaily: user.user.reminderBirthControlDaily,
        reminderBirthControlRefill: user.user.reminderBirthControlRefill,
        reminderBirthControlRenewal: user.user.reminderBirthControlRenewal,
        reminderYearlyAppointment: user.user.reminderYearlyAppointment,
        reminderYearlyAppointmentMonth: user.user.reminderYearlyAppointmentMonth
      });
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
      user.save();
      res.send({success: true});
    });
  });

};

function sendReminderEmails() {
  const job = new CronJob('00 00 09 * * *', function() {
    sendBCDailyEmails();
    sendBCRenewalEmails();
    sendBCRefillEmails();
  });
  //Send the yearly reminder emails at midnight on the first of the month
  const yearly = new CronJob('00 00 09 1 * *', function() {
    sendYearlyEmails();
  });
  job.start();
  yearly.start();
}

function sendBCDailyEmails() {
  User.find({'user.reminderBirthControlDaily': true}, function(err, users) {
    if(err)
      throw err;
    users.map(user => {
      console.log('Sending reminder email to: ' + user.user.email);
      transporter.sendMail({
        from: emailcreds.user,
        to: user.user.email,
        subject: user.user.name + ', you have a notification from Obie!',
        html: '<div>Reminder to take your birth control today!</div>'
      }, function (err) {
        if (err)
          throw err;
      });
    });
  });
}

function sendBCRenewalEmails() {
  User.find({'user.reminderBirthControlRenewal': true}, function(err, users) {
    if(err)
      throw err;
    users.map(user => {
      Prescription.findOne({'prescription.email': user.user.email, 'prescription.status': 'Active'}, function(err, prescription) {
        console.log('test');
        if(prescription) {
          //console.log(prescription.expiration);
          var date = new Date(prescription.prescription.expiration);
          var today = new Date();
          today.setHours(0,0,0,0);
          //console.log(date);
          //console.log(today);
          console.log(Math.round((date-today)/(1000*60*60*24)));
          //Reminder will only be sent two weeks before expiration date
          if(Math.round((date-today)/(1000*60*60*24)) == 14) {
            console.log('Sending reminder email to: ' + user.user.email);
            transporter.sendMail({
              from: emailcreds.user,
              to: user.user.email,
              subject: user.user.name + ', you have a notification from Obie!',
              html: '<div>You prescription is expiring soon! Please follow up with your physician to renew your prescription.</div>'
            }, function (err) {
              if (err)
                throw err;
            });
          }
        }
      });
    });
  });
}

function sendYearlyEmails() {
  User.find({'user.reminderYearlyAppointment': true}, function(err, users) {
    if(err)
      throw err;
    users.map(user => {
      var day = new Date();
      var month = day.getMonth() + 1;
      console.log(month);
      console.log(user.user.reminderYearlyAppointmentMonth);
      if(month == user.user.reminderYearlyAppointmentMonth) {
        console.log('Sending reminder email to: ' + user.user.email);
        transporter.sendMail({
          from: emailcreds.user,
          to: user.user.email,
          subject: user.user.name + ', you have a notification from Obie!',
          html: '<div>This is your reminder to schedule your yearly appointment at the OBGYN.</div>'
        }, function (err) {
          if (err)
            throw err;
        });
      }
    });
  });
}

function sendBCRefillEmails() {
  User.find({'user.reminderBirthControlRefill': true}, function(err, users) {
    if(err)
      throw err;
    users.map(user => {
      Prescription.findOne({'prescription.email': user.user.email, 'prescription.status': 'Active'}, function(err, prescription) {
        if(prescription) {
          var date = new Date(prescription.prescription.refillDate);
          //Take the last refill date, add the number of days the user is supplied
          //This is the date we want to warn 2 weeks before
          date.setDate(date.getDate() + parseInt(prescription.prescription.daysSupply));
          var today = new Date();
          today.setHours(0,0,0,0);
          if(Math.round((date-today)/(1000*60*60*24)) == 14) {
            console.log('Sending reminder email to: ' + user.user.email);
            transporter.sendMail({
              from: emailcreds.user,
              to: user.user.email,
              subject: user.user.name + ', you have a notification from Obie!',
              html: '<div>Looks like you need to refill your prescription soon! Please follow up with your pharmacy to renew your prescription.</div>'
            }, function (err) {
              if (err)
                throw err;
            });
          }
        }
      });
    });
  });
}