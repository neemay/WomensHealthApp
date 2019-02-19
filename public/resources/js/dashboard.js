var app = angular.module("obie", []);
app.controller('controller', function ($scope, $http) { 
  $scope.isDashboard = true;
  $scope.isProfile = false;
  $scope.isHistory = false;
});