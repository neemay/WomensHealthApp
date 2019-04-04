var app = angular.module('obie', []);
app.controller('controller', function ($scope, $http, $window) { 
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
    else {
      $http({
        method: 'POST',
        url: '/signup',
        data: {
          email: $scope.createEmail,
          password: $scope.createPassword
        }
      }).success(function(response) {
        console.log('success');
        $window.location.href = '/dashboard';
      });
    }  
  };
  
  $scope.login = function() {
    $http({
      method: 'POST',
      url: '/login',
      data: {
        email: $scope.email,
        password: $scope.password
      }
    }).success(function(response) {
      console.log('success');
      $window.location.href = '/dashboard';
    });
  }
  
  $scope.init = function() {
    if($window.location.hash == '#login') {
      $('#loginModal').modal();
    }
    else if($window.location.hash == '#signup') {
      $('#signupModal').modal();
    }
  }
});