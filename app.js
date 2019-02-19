var express = require('express');
var path = require('path');
var app = express();

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

app.listen(3000, () => console.log('Server listening on port 3000.'));