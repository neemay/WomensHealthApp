// app/api.js

//include any mongodb models here
//You can get the user's email by doing the following: req.user.user.email

module.exports = function(app) {
  //Function to get the current user's preferred name
  app.get('/getUserName', function(req, res) {
    if(!req.user) {
      res.send({success: false});
    }
    res.send({success: true, name: req.user.user.name});
  });
   //Function to get the current user's email
  app.get('/getEmail', function(req, res) {
    
    res.send({success: true, email: req.user.user.email});
  });
};