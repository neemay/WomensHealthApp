var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => res.sendFile('public/index.html', {root: __dirname}));

app.get('/getName', function(req, res) {
  var data = "My saved name is Yarden Ne'eman"
  console.log("Sending data...");
  res.send(data);
});

app.get('/login', function(req, res) {
  if(req.query.username == "neemay" && req.query.password == "password") {
    console.log("neemay has logged in");
    res.sendStatus(200);
  }
  else {
    console.log("login error");
    res.sendStatus(400);
  }
});

app.listen(3000, () => console.log('Server listening on port 3000.'));