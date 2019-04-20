// app/apis/userApis.js
// This file contains the api functions related to users

//Models referenced by this file
var User = require('../../app/models/user');
var Prescription = require('../../app/models/prescription');

//Additional node modules required for email capabilities
var nodemailer = require('nodemailer');
var emailcreds = require('../../email-creds.json');
var CronJob = require('cron').CronJob;

//Transporter object for sending emails using given credentials
var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: emailcreds
});

module.exports = function(app) {
  //Call to driver function to set the cron job to send reminder emails
  sendReminderEmails();
  
  //Endpoint: getUserName
  //Returns the user's preferred name
  app.get('/getUserName', function(req, res) {
    if(!req.user) {
      res.sendStatus(500);
    }
    res.send({name: req.user.user.name});
  });

  //Endpoint: getEmail
  //Returns the user's email
  app.get('/getEmail', function(req, res) {
    if(!req.user) {
      res.sendStatus(500);
    }
    res.send({email: req.user.user.email});
  });
  
  //Endpoint: setName
  //Updates the user's preferred name
  app.post('/setName', function(req, res) {
    if(!req.user) {
      res.sendStatus(500);
    }
    User.findOne({'user.email': req.user.user.email}, function(err, user) {
      if(err) {
        console.log(err);
        res.sendStatus(500);
      }
      user.user.name = req.body.name;
      user.save();
      res.sendStatus(200);
    });
  });

  //Endpoint: getReminderSettings
  //Returns the reminder settings for this user
  app.get('/getReminderSettings', function(req, res) {
    if(!req.user) {
      res.sendStatus(500);
    }
    User.findOne({'user.email': req.user.user.email}, function(err, user) {
      if(err) {
        console.log(err);
        res.sendStatus(500);
      }
      res.send({reminderBirthControlDaily: user.user.reminderBirthControlDaily,
        reminderBirthControlRefill: user.user.reminderBirthControlRefill,
        reminderBirthControlRenewal: user.user.reminderBirthControlRenewal,
        reminderYearlyAppointment: user.user.reminderYearlyAppointment,
        reminderYearlyAppointmentMonth: user.user.reminderYearlyAppointmentMonth
      });
    });
  });

  //Endpoint: setReminders
  //Updates the reminder settings for this user with the given values
  app.post('/setReminders', function(req, res) {
    if(!req.user) {
      res.sendStatus(500);
    }
    User.findOne({'user.email': req.user.user.email}, function(err, user) {
      if(err) {
        console.log(err);
        res.sendStatus(500);
      }
      user.user.reminderBirthControlDaily = req.body.reminderBirthControlDaily;
      user.user.reminderBirthControlRefill = req.body.reminderBirthControlRefill;
      user.user.reminderBirthControlRenewal = req.body.reminderBirthControlRenewal;
      user.user.reminderYearlyAppointment = req.body.reminderYearlyAppointment;
      user.user.reminderYearlyAppointmentMonth = req.body.reminderYearlyAppointmentMonth;
      user.save();
      res.sendStatus(200);
    });
  });

};

//Driver function to send reminder emails to users
//Daily, Renewal, and Refill emails are sent daily at 9am
//Yearly appointment emails are sent at 9am on the first of every month
function sendReminderEmails() {
  const job = new CronJob('00 00 13 * * *', function() {
    sendBCDailyEmails();
    sendBCRenewalEmails();
    sendBCRefillEmails();
  });
  const yearly = new CronJob('00 00 13 1 * *', function() {
    sendYearlyEmails();
  });
  job.start();
  yearly.start();
}

//Function to send daily birth control reminder emails
//Only sent to users who have reminderBirthControlDaily set to true
function sendBCDailyEmails() {
  User.find({'user.reminderBirthControlDaily': true}, function(err, users) {
    if(err) {
      console.log(err);
      return;
    }
    users.map(user => {
      console.log('Sending reminder email to: ' + user.user.email);
      transporter.sendMail({
        from: emailcreds.user,
        to: user.user.email,
        subject: user.user.name + ', you have a notification from Obie!',
        html: '<div>Reminder to take your birth control today!</div>'
      }, function (err) {
        if(err) {
          console.log(err);
          return;
        }
      });
    });
  });
}

//Function to send renewal emails
//Only sent to users who have reminderBirthControlRenewal set to true
//Reminder email sent two weeks before any active prescription expiration date
function sendBCRenewalEmails() {
  User.find({'user.reminderBirthControlRenewal': true}, function(err, users) {
    if(err) {
      console.log(err);
      return;
    }
    users.map(user => {
      Prescription.find({'prescription.email': user.user.email, 'prescription.status': 'Active'}, function(err, prescriptions) {
        prescriptions.map(prescription =>  {
          var date = new Date(prescription.prescription.expiration);
          var today = new Date();
          today.setHours(0,0,0,0);
          console.log(Math.round((date-today)/(1000*60*60*24)));
          if(Math.round((date-today)/(1000*60*60*24)) == 14) {
            console.log('Sending reminder email to: ' + user.user.email);
            transporter.sendMail({
              from: emailcreds.user,
              to: user.user.email,
              subject: user.user.name + ', you have a notification from Obie!',
              html: '<div>You prescription is expiring soon! Please follow up with your physician to renew your prescription.</div>'
            }, function (err) {
              if(err) {
                console.log(err);
                return;
              }
            });
          }
        });
      });
    });
  });
}

//Function to send yearly appointment emails
//Only sent to user who have reminderYearlyAppointment set to true
//Only send the email if this month is the month they set the reminder for
function sendYearlyEmails() {
  User.find({'user.reminderYearlyAppointment': true}, function(err, users) {
    if(err) {
      console.log(err);
      return;
    }
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
          if(err) {
            console.log(err);
            return;
          }
        });
      }
    });
  });
}

//Function to send birth control reminder emails
//Only sent to user who have reminderBirthControlRefill set to true
//Emails are sent two weeks before refills for active prescriptions are set to run out
//This is calculated by taking the date of the last refill plus the days supply of the prescription
function sendBCRefillEmails() {
  User.find({'user.reminderBirthControlRefill': true}, function(err, users) {
    if(err) {
      console.log(err);
      return;
    }
    users.map(user => {
      Prescription.find({'prescription.email': user.user.email, 'prescription.status': 'Active'}, function(err, prescriptions) {
        prescriptions.map(prescription =>  {
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
              html: '<div>Looks like you need to refill your prescription soon! Please follow up with your pharmacy to renew your prescription for ' + prescription.prescription.name + '.</div>'
            }, function (err) {
              if(err) {
                console.log(err);
                return;
              }
            });
          }
        });
      });
    });
  });
}