// app/apis/periodApi.js

//include any mongodb models here
var Weight = require('../../app/models/weight');
var User = require('../../app/models/user');

module.exports = function(app) {

  //Function to add the start date for a user's period
  app.post('/addWeight', function(req, res) {
    var newWeight = new Weight();
    newWeight.weight.email = req.user.user.email;
    newWeight.weight.recordDate = req.body.recordDate;
    newWeight.weight.weightVal = req.body.weightVal;
    newWeight.save(function(err) {
      if(err)
        throw err;
      console.log("Added weight with value " + req.body.weightVal + "from date" + req.body.recordDate);
      res.send({success: true});
    });

  });

  app.get('/getUserWeights', function(req, res) {
    Weight.find({'weight.email': req.user.user.email}, function(err, weights) {
      res.send({success: true, data: weights});
    });
  });


};
