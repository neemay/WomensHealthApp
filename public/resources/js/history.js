var app = angular.module("obie", []);
app.controller('controller', function ($scope, $http, $window) {
  $scope.isDashboard = false;
  $scope.isProfile = false;
  $scope.isHistory = true;
  $scope.hasUserPeriods = false;
  $scope.hasUserPrescriptions = false;
  $scope.hasUserStats = false;


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
    
//	$http({
//      method: 'GET',
//      url: '/getEmail',
//    }).success(function(response) {
//      $scope.email = response.email;
//    });

    $http({
      method: 'GET',
      url: '/getUserPeriods'
    }).success(function(response) {
      $scope.userPeriods = response.data;
      if(response.data.length > 0){
        $scope.hasUserPeriods = true;
      }
      //$scope.hasUserPeriods = true;
    });

//    $http({
//      method: 'GET',
//      url: '/getPrescriptionList'
//    }).success(function(response) {
//      $scope.prescriptionList = response.data;
//      $scope.newPrescriptionName = "OTHER";
//    });

//    $http({
//      method: 'GET',
//      url: '/getUserPeriods'
//    }).success(function(response) {
//      $scope.periodsList = response.data;
//    });

    $http({
      method: 'GET',
      url: '/getUserPrescriptions'
    }).success(function(response) {
      $scope.userPrescriptions = response.data;
      if(response.data.length){
        $scope.hasUserPrescriptions = true;
      }
    });

//    $http({
//      method: 'GET',
//      url: '/getUserPeriods'
//    }).success(function(response) {
//      $scope.userPeriods = response.data;
//      if(response.data.length){
//        $scope.hasUserPeriods = true;
//      }
//    });

  }
  
  $scope.getPrescriptionSymptoms = function(id, name) {
    $http({
      method: 'GET',
      url: '/getPrescriptionSymptomsById',
      params: {
        id: id
      }
    }).success(function(response) {
      $scope.prescriptionSymptoms = response.data;
      $scope.prescriptionName = name;
    });
  }
  
  $scope.getPeriodSymptoms = function(id, startDate) {
    //console.log(id);
    $http({
      method: 'GET',
      url: '/getPeriodSymptomsById',
      params: {
        id: id
      }
    }).success(function(response) {
      $scope.periodSymptoms = response.data;
      $scope.periodStart = startDate;
    });
  }




});
