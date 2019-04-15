var app = angular.module('obie', []);
app.controller('controller', function ($scope, $http, $window) {
  //Initialize scope variables
  $scope.isDashboard = true;
  $scope.isProfile = false;
  $scope.isHistory = false;
  $scope.userIsOnPeriod = false;
  $scope.noPeriod = true;
  $scope.activePrescriptions = '';
  
  //Function to call the logout endpoint
  $scope.logout = function() {
    $http({
      method: 'GET',
      url: '/logout'
    }).success(function() {
      $window.location.href = '/';
    });
  };
  
  //Initialization function
  $scope.init = function() {
    //Get the user's name
    $http({
      method: 'GET',
      url: '/getUserName'
    }).success(function(response) {
      $scope.userName = response.name;
    });
	
    //Get the user's email
    $http({
      method: 'GET',
      url: '/getEmail'
    }).success(function(response) {
      $scope.email = response.email;
    });
    
    //Get the user's period status
    $http({
      method: 'GET',
      url: '/isOnPeriod'
    }).success(function(response) {
      var today = new Date();
      today.setHours(0,0,0,0);
      if(response.isOnPeriod) {
        $scope.userIsOnPeriod = true;
        var current = new Date(response.currentPeriod);
        current.setHours(0,0,0,0);
        $scope.daysSince = Math.round(Math.abs(today - current)/(1000*60*60*24));
      }
      else {
        if(response.lastPeriod) {
          $scope.noPeriod = false;
          var last = new Date(response.lastPeriod);
          last.setHours(0,0,0,0);
          $scope.daysSince = Math.round(Math.abs(today - last)/(1000*60*60*24));
        }
      }
    });
    
    //Get the user's active prescriptions
    $http({
      method: 'GET',
      url: '/getActiveUserPrescriptions'
    }).success(function(response) {
      if(response.data.length > 0)
        $scope.activePrescriptions = response.data;
    });
  };
});