var express = require('express');
var path = require('path');
var app = express();
//var mongoose = require('mongoose');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/public/views'));
app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.render('pages/index', { title: 'Obie Home' });
});

app.get('/dashboard', function(req, res) {
    res.render('pages/dashboard', { title: 'Obie Dashboard' });
});

app.get('/profile', function(req, res) {
    res.render('pages/profile', { title: 'My Profile' });
});

app.get('/history', function(req, res) {
    res.render('pages/history', { title: 'My History' });
});

//Connect to the Mongo Database
//mongoose.connect('mongodb://localhost/users', { useNewUrlParser: true });

//Set up the database schema
//var Schema = mongoose.Schema;

//Save the whole tweet object in the database for extensibility
//var dbSchema = new Schema({
//  username: String
//});

//Create a model using this schema
//var User = mongoose.model('User', dbSchema);
//module.exports = User;

//app.get('/addToDB', function(req, res) {
//  var new_user = new User({
//    username: "Yarden"
//  });
//  new_user.save(function(err) {
//    if(err) throw err;
//  });
//  console.log("Saved to DB");
//  res.send("wee");
//});

app.listen(3000, () => console.log('Server listening on port 3000.'));