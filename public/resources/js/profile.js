var app = angular.module("obie", []);
app.controller('controller', function ($scope, $http, $window) { 
  $scope.isDashboard = false;
  $scope.isProfile = true;
  $scope.isHistory = false;
  $scope.userIsOnPeriod = false;
  $scope.alertSuccess = false;
  
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
      console.log(response);
      $scope.userIsOnPeriod = response.isOnPeriod;
      if(response.isOnPeriod)
        $scope.currentPeriod = response.currentPeriod;
    });
    
    if($window.location.hash == "#periodSymptomModal") {
      $("#periodSymptomModal").modal();
    }
    else if($window.location.hash == "#prescriptionSymptomModal") {
      $("#prescriptionSymptomModal").modal();
    }
    else if($window.location.hash == "#endPeriodModal") {
      $("#endPeriodModal").modal();
    }
    else if($window.location.hash == "#startPeriodModal") {
      $("#startPeriodModal").modal();
    }
    
    $scope.startPeriod = new Date();
  }
  
  $scope.recordStartPeriod = function() {
    $http({
      method: 'POST',
      url: '/addPeriodStart',
      data: {
        startDate: $scope.startPeriod.toLocaleDateString()
      }
    }).success(function(response) {
      $("#startPeriodModal").modal("hide");
      $scope.userIsOnPeriod = true;
    });
  }
  
  $scope.recordEndPeriod = function() {
    $http({
      method: 'POST',
      url: '/addPeriodEnd',
      data: {
        endDate: $scope.endPeriod.toLocaleDateString()
      }
    }).success(function(response) {
      $("#endPeriodModal").modal("hide");
      $scope.userIsOnPeriod = false;
    });
  }

  $scope.recordPeriodSymptoms = function() {
    $http({
      method: 'POST',
      url: '/addPeriodSymptom',
      data: {
        periodStartDate: $scope.currentPeriod,
        date: $scope.symptomDate,
        cramps: $scope.symptomCramps,
        nausea: $scope.symptomNausea,
        headache: $scope.symptomHeadache,
        flow: $scope.symptomFlow,
        backPain: $scope.symptomBackPain,
        bloating: $scope.symptomBloating,
        notes: $scope.notes
      }
    }).success(function(response) {
      $("#periodSymptomModal").modal('hide');
      $("#alertSuccess").alert();
      $scope.alertSuccess = true;
      $scope.successMessage = "Symptoms saved successfully";
    });
  }
  
  $scope.addPrescription = function() {
    $http({
      method: 'POST',
      url: '/addPrescription',
      data: {
        name: $scope.prescriptionName,
        refills: $scope.prescriptionRefills,
        expiration: $scope.prescriptionExpiration,
        startDate: $scope.prescriptionStart,
        status: $scope.prescriptionStatus,
        notes: $scope.prescriptionNotes
      }
    }).success(function(response) {
      $("#addPrescriptionModal").modal('hide');
      $scope.alertSuccess = true;
      $scope.successMessage = "Prescription saved successfully";
    });
  }
});