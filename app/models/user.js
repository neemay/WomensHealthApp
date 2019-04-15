// app/models/user.js
//Database model for the user object 

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  user: {
    email: String,
    password: String,
    name: String,
    isOnPeriod: Boolean,
    reminderBirthControlDaily: Boolean,
    reminderBirthControlRefill: Boolean,
    reminderBirthControlRenewal: Boolean,
    reminderYearlyAppointment: Boolean,
    reminderYearlyAppointmentMonth: String
  }
});

//Function to generate the hash for a user's password
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

//Function to validate the user's input with their saved password
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.user.password);
};

module.exports = mongoose.model('User', userSchema);
