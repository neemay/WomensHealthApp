var app = angular.module('obie', []);
app.controller('controller', function ($scope, $http, $window) { 
  $scope.isDashboard = true;
  $scope.isProfile = false;
  $scope.isHistory = false;
  $scope.userIsOnPeriod = false;
  $scope.noPeriod = true;
  
  $scope.logout = function() {
    $http({
      method: 'GET',
      url: '/logout'
    }).success(function(response) {
      $window.location.href = '/';
    });
  }
  
  $scope.init = function() {
    $http({
      method: 'GET',
      url: '/getUserName',
    }).success(function(response) {
      $scope.userName = response.name;
    });
	
	$http({
      method: 'GET',
      url: '/getEmail',
    }).success(function(response) {
      $scope.email = response.email;
    });
    
    $http({
      method: 'GET',
      url: '/isOnPeriod',
    }).success(function(response) {
      var today = new Date();
      if(response.isOnPeriod) {
        $scope.userIsOnPeriod = true;
        var current = new Date(response.currentPeriod);
        $scope.daysSince = Math.round(Math.abs(today - current)/(1000*60*60*24)) - 1;
      }
      else {
        if(response.lastPeriod) {
          $scope.noPeriod = false;
          var last = new Date(response.lastPeriod);
          $scope.daysSince = Math.round(Math.abs(today - last)/(1000*60*60*24)) - 1;
        }
      }
    });
  }
});