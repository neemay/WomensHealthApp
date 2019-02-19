var app = angular.module("obie", []);
app.controller('controller', function ($scope, $http) { 
  $scope.isDashboard = false;
  $scope.isProfile = false;
  $scope.isHistory = false;
});