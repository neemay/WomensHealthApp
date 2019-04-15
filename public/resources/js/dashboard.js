var app = angular.module('obie', []);
app.controller('controller', function ($scope, $http, $window) { 
  $scope.isDashboard = true;
  $scope.isProfile = false;
  $scope.isHistory = false;
  $scope.userIsOnPeriod = false;
  $scope.noPeriod = true;
  $scope.activePrescriptions = '';
  
  $scope.logout = function() {
    $http({
      method: 'GET',
      url: '/logout'
    }).success(function() {
      $window.location.href = '/';
    });
  };
  
  $scope.init = function() {
    $http({
      method: 'GET',
      url: '/getUserName'
    }).success(function(response) {
      $scope.userName = response.name;
    });
	
    $http({
      method: 'GET',
      url: '/getEmail'
    }).success(function(response) {
      $scope.email = response.email;
    });
    
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
    
    $http({
      method: 'GET',
      url: '/getActiveUserPrescriptions'
    }).success(function(response) {
      if(response.data.length > 0)
        $scope.activePrescriptions = response.data;
    });
  };
});