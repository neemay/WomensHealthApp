// config/passport.js

var UserStrategy = require('passport-local').Strategy;
var User = require('../app/models/user');

module.exports = function(passport) {
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });
  
  //Signup function
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
          console.log("Email already exists");
          return done(null, false, req.flash('signupMessage', 'That email is already taken'));
        }
        else {
          var newUser = new User();
          newUser.user.email = email;
          newUser.user.password = newUser.generateHash(password);
          newUser.user.name = req.body.name;
          
          newUser.save(function(err) {
            if(err)
              throw err;
            console.log("Registered new user");
            return done(null, newUser);
          });
        }
      });
    });
  }));
  
  //Login function
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