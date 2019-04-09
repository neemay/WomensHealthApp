var app = angular.module('obie', []);
app.controller('controller', function ($scope, $http, $window) {
  $scope.isDashboard = false;
  $scope.isProfile = false;
  $scope.isHistory = true;
  $scope.hasUserPeriods = false;
  $scope.hasUserPrescriptions = false;
  $scope.hasUserStats = true;
  $scope.hasPrescriptionSymptoms = false;
  $scope.hasPeriodSymptoms = false;
  $scope.showPeriodStats = false;
  $scope.showPrescriptionStats = false;
  $scope.showWeightStats = false;
  $scope.numPeriods = 0;
  $scope.numPrescriptions = 0;


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
      url: '/getUserName',
    }).success(function(response) {
      $scope.userName = response.name;
    });


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


    $http({
      method: 'GET',
      url: '/getUserPrescriptions'
    }).success(function(response) {
      $scope.userPrescriptions = response.data;
      if(response.data.length){
        $scope.hasUserPrescriptions = true;
      }
    });

  };

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
      if($scope.prescriptionSymptoms.length > 0){
        $scope.hasPrescriptionSymptoms = true;
      } else {
        $scope.hasPrescriptionSymptoms = false;
      }

    });
  };

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
      if($scope.periodSymptoms.length > 0){
        $scope.hasPeriodSymptoms = true;
      } else {
        $scope.hasPeriodSymptoms = false;
      }
    });
  };



  $scope.getPeriodStats = function() {
    $http({
      method: 'GET',
      url: '/getUserPeriods',
    }).success(function(response) {
      $scope.numPeriods = response.data.length;

      $scope.showPeriodStats = !$scope.showPeriodStats;
      $scope.showPrescriptionStats = false;
      $scope.showWeightStats = false;

    });
  };


  $scope.getPrescriptionStats = function() {
    $http({
      method: 'GET',
      url: '/getUserPrescriptions',
    }).success(function(response) {
      $scope.numPrescriptions = response.data.length;

      $scope.showPeriodStats = false;
      $scope.showPrescriptionStats = !$scope.showPrescriptionStats;
      $scope.showWeightStats = false;

    });
  };

  $scope.getWeightStats = function() {
    $scope.showPeriodStats = false;
    $scope.showPrescriptionStats = false;
    $scope.showWeightStats = !$scope.showWeightStats;
  };


});
