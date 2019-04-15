var app = angular.module('obie', []);
app.controller('controller', function ($scope, $http, $window) { 
  //Initialize scope variables
  $scope.isDashboard = false;
  $scope.isProfile = false;
  $scope.isHistory = false;
  
  //Initialization function
  //Check the url for the login or signup hash
  //If a hash is present, open up the associated modal
  $scope.init = function() {
    if($window.location.hash == '#login') {
      $('#loginModal').modal();
    }
    else if($window.location.hash == '#signup') {
      $('#signupModal').modal();
    }
  };
});