var app = angular.module("obie", []);
app.controller('controller', function ($scope, $http, $window) { 
  $scope.isDashboard = false;
  $scope.isProfile = false;
  $scope.isHistory = true;
  
  $scope.logout = function() {
    $http({
      method: 'GET',
      url: '/logout'
    }).success(function(response) {
      $window.location.href = '/';
    });
  }
});