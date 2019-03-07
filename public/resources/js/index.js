var app = angular.module("obie", []);
app.controller('controller', function ($scope, $http) { 
  //Scope variable initialization
  $scope.isDashboard = false;
  $scope.isProfile = false;
  $scope.isHistory = false;
  $scope.passwordError = false;
  
  //Function to trigger account creation
  $scope.createAccount = function() {
    if($scope.createPassowrd != $scope.confirmPassword) {
      $scope.passwordError = true;
    }
  }
});