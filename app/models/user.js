// app/models/user.js

var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({
  user: {
    email: String,
    password: String,
    name: String,
    isOnPeriod: Boolean
  }
});

userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.user.password);
}

module.exports = mongoose.model('User', userSchema);