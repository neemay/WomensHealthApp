//This file contains the code for the server to run
//Necessary node modules
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
//Database connection string
var configDB = require('./config/database.js');
//Establish connection with mongo database
mongoose.connect(configDB.url, { useNewUrlParser: true });


//Express setup
app.set('view engine', 'ejs'); //set up ejs for templating
app.set('views', path.join(__dirname, '/public/views')); //set path for views folder
app.use(express.static(__dirname + '/public')); //set path for static files
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//Passport setup
require('./config/passport')(passport);
app.use(session({
  secret: 'softwaredesignanddocumentation',
  resave: false, 
  saveUninitialized: false 
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

//Routes
require('./app/routes.js')(app, passport);

//API functions
require('./app/apis/periodApi.js')(app);
require('./app/apis/prescriptionApi.js')(app);
require('./app/apis/userApi.js')(app);
require('./app/apis/weightApi.js')(app);

app.listen(port, () => console.log('Server listening on port ' + port));
