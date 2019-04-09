// app/apis/weightApi.js

//include any mongodb models here
var Weight = require('../../app/models/weight');
var User = require('../../app/models/user');

module.exports = function(app) {

  //Function to add the start date for a user's period
  app.post('/addWeight', function(req, res) {
    Weight.findOne({'weight.email': req.user.user.email, 'weight.recordDate': req.body.recordDate}, function(err, weight) {
      if(weight) {
        weight.weight.weightVal = req.body.weightVal;
        weight.save();
        console.log("Updated weight for " + req.user.user.email);
        res.send({success: true});
      }
      else {
        var newWeight = new Weight();
        newWeight.weight.email = req.user.user.email;
        newWeight.weight.recordDate = req.body.recordDate;
        newWeight.weight.weightVal = req.body.weightVal;
        newWeight.save(function(err) {
          if(err)
            throw err;
          console.log("Added weight for " + req.user.user.email);
          res.send({success: true});
        }); 
      }
    });
  });

  app.get('/getUserWeights', function(req, res) {
    Weight.find({'weight.email': req.user.user.email}, function(err, weights) {
      res.send({success: true, data: weights});
    });
  });


};
