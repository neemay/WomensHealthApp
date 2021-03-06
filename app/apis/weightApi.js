// app/apis/weightApi.js
// This file contains the api functions related to weight

//Models referenced by this file
var Weight = require('../../app/models/weight');

module.exports = function(app) {
  //Endpoint: addWeight
  //Stores the user's weight for a given date
  //If the user has already stored a weight for this date, overwrite it with the new value
  app.post('/addWeight', function(req, res) {
    Weight.findOne({'weight.email': req.user.user.email, 'weight.recordDate': req.body.recordDate}, function(err, weight) {
      if(weight) {
        weight.weight.weightVal = req.body.weightVal;
        weight.save();
        res.sendStatus(200);
      }
      else {
        var newWeight = new Weight();
        newWeight.weight.email = req.user.user.email;
        newWeight.weight.recordDate = req.body.recordDate;
        newWeight.weight.weightVal = req.body.weightVal;
        newWeight.save(function(err) {
          if(err) {
            console.log(err);
            res.sendStatus(500);
          }
          res.sendStatus(200);
        }); 
      }
    });
  });

  //Endpoint: getUserWeights
  //Returns the weights stored for this user
  app.get('/getUserWeights', function(req, res) {
    Weight.find({'weight.email': req.user.user.email}, null, {sort: {'weight.recordDate': 1}}, function(err, weights) {
      res.send({data: weights});
    });
  });


};
