var app = angular.module("obie", []);
app.controller('controller', function ($scope, $http, $window) { 
  $scope.isDashboard = false;
  $scope.isProfile = true;
  $scope.isHistory = false;
  
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
  }

  $scope.init = function() {
    if($window.location.hash == "#periodModal") {
      $("#periodModal").modal();
    }
    else if($window.location.hash == "#prescriptionSymptomModal") {
      $("#prescriptionSymptomModal").modal();
    }
  }

});