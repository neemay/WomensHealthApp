// config/passport.js
//This file contains the authentication logic for the application
//Authentication uses the open source node package Passport.js

var UserStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');

module.exports = function(passport) {
  //Function to serialize the user
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  //Function to deserialize the user
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  
  //Function to register a new user
  passport.use('local-signup', new UserStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
  }, function(req, email, password, done) {
    process.nextTick(function() {
      User.findOne({'user.email' : email}, function(err, user) {
        if(err)
          return done(err);
        
        if(user) {
          console.log('Email already exists');
          return done(null, false, req.flash('signupMessage', 'That email is already taken'));
        }
        else {
          var newUser = new User();
          newUser.user.email = email;
          newUser.user.password = newUser.generateHash(password);
          newUser.user.name = req.body.name;
          newUser.user.isOnPeriod = false;
          newUser.user.reminderBirthControlDaily = false;
          newUser.user.reminderBirthControlRefill = false;
          newUser.user.reminderBirthControlRenewal = false;
          newUser.user.reminderYearlyAppointment = false;
          newUser.user.reminderYearlyAppointmentMonth = '1';
          
          newUser.save(function(err) {
            if(err) {
              return done(err);
            }
            console.log('Registered new user');
            return done(null, newUser);
          });
        }
      });
    });
  }));
  
  //Function to login a user
  passport.use('local-login', new UserStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  },
  function(req, email, password, done) {
    User.findOne({ 'user.email' :  email }, function(err, user) {
      if (err)
        return done(err);
      if (!user)
        return done(null, false, req.flash('loginMessage', 'No user found.'));
      // if the user is found but the password is wrong
      if (!user.validPassword(password))
        return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
      // all is well, return successful user
      return done(null, user);
    });
  }));
  
};