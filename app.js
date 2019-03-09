var express = require('express');
var path = require('path');
var app = express();
var port = process.env.PORT || 3000;
var mongoose = require('mongoose');
var passport = require('passport');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var cookieParser = require('cookie-parser');
//database connection
var configDB = require('./config/database.js');
mongoose.connect(configDB.url);


//express setup
app.set('view engine', 'ejs'); //set up ejs for templating
app.set('views', path.join(__dirname, '/public/views')); //set path for views folder
app.use(express.static(__dirname + '/public')); //set path for static files
app.use(bodyParser());
app.use(cookieParser());

//passport setup
require('./config/passport')(passport);
app.use(session({secret: 'softwaredesignanddocumentation'}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//routes
require('./app/routes.js')(app, passport);
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

app.listen(port, () => console.log('Server listening on port 3000.'));