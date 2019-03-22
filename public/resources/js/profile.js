var app = angular.module("obie", []);
app.controller('controller', function ($scope, $http, $window) { 
  $scope.isDashboard = false;
  $scope.isProfile = true;
  $scope.isHistory = false;
  $scope.userIsOnPeriod = false;
  $scope.alertSuccess = false;
  $scope.editingPrescription = false;
  
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
    
    $http({
      method: 'GET',
      url: '/getPrescriptionList'
    }).success(function(response) {
      $scope.prescriptionList = response.data;
      $scope.prescriptionName = "OTHER";
    });
    
//    $http({
//      method: 'GET',
//      url: '/getUserPrescriptions'
//    }).success(function(response) {
//      $scope.userPrescriptions = response.data;
//    });
    
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
        startDate: convertDate($scope.startPeriod)
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
        endDate: convertDate($scope.endPeriod)
      }
    }).success(function(response) {
      $("#endPeriodModal").modal("hide");
      $scope.userIsOnPeriod = false;
    });
  }

  $scope.getUserPrescriptions = function() {
    $scope.editingPrescription = true;
    $http({
      method: 'GET',
      url: '/getUserPrescriptions'
    }).success(function(response) {
      $scope.userPrescriptions = response.data;
      $scope.prescriptionName = response.data["0"].prescription.name;
      console.log(response.data["0"].prescription.startDate);
      $scope.prescriptionStart = new Date(response.data["0"].prescription.startDate);
      $scope.prescriptionRefills = parseInt(response.data["0"].prescription.refills);
      $scope.prescriptionExpiration = new Date(response.data["0"].prescription.expiration);
      $scope.prescriptionStatus = response.data["0"].prescription.status;
      $scope.prescriptionNotes = response.data["0"].prescription.notes;
    });
  }
  
  $scope.loadPrescription = function() {
    $scope.userPrescriptions.forEach(function(presc) {
      if($scope.prescriptionName == presc.prescription.name) {
        $scope.prescriptionRefills = parseInt(presc.prescription.refills);
        $scope.prescriptionExpiration = new Date(presc.prescription.expiration);
        $scope.prescriptionStart = new Date(presc.prescription.startDate);
        $scope.prescriptionStatus = presc.prescription.status;
        $scope.prescriptionNotes = presc.prescription.notes;
      }
    });
  }
  
  $scope.recordPeriodSymptoms = function() {
    $http({
      method: 'POST',
      url: '/addPeriodSymptom',
      data: {
        periodStartDate: $scope.currentPeriod,
        date: convertDate($scope.symptomDate),
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
        expiration: convertDate($scope.prescriptionExpiration),
        startDate: convertDate($scope.prescriptionStart),
        status: $scope.prescriptionStatus,
        notes: $scope.prescriptionNotes
      }
    }).success(function(response) {
      $("#addPrescriptionModal").modal('hide');
      $scope.prescriptionName = "",
      $scope.prescriptionRefills = "",
      $scope.prescriptionExpiration = "",
      $scope.prescriptionStart = "",
      $scope.prescriptionStatus = "",
      $scope.prescriptionNotes = ""
      $scope.alertSuccess = true;
      $scope.successMessage = "Prescription saved successfully";
    });
  }
  
  $scope.updatePrescription = function() {
    $http({
      method: 'POST',
      url: '/updatePrescription',
      data: {
      name: $scope.prescriptionName,
        refills: $scope.prescriptionRefills,
        expiration: convertDate($scope.prescriptionExpiration),
        startDate: convertDate($scope.prescriptionStart),
        status: $scope.prescriptionStatus,
        notes: $scope.prescriptionNotes
      }
    }).success(function(response) {
      $("#updatePrescriptionModal").modal('hide');
      $scope.alertSuccess = true;
      $scope.successMessage = "Prescription updated successfully";
    });
  }
});

//Function to convert the date object to a string with only
//the current date in YYYY/MM/DD format
function convertDate(date) {
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  return year + "/" + month + "/" + day;
}