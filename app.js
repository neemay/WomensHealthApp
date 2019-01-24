var express = require('express');
var app = express();

app.use(express.static(__dirname + '/public'));
app.get('/', (req, res) => res.sendFile('public/index.html', {root: __dirname}));

app.listen(3000, () => console.log('Server listening on port 3000.'));