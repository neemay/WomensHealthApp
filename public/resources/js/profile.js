var app = angular.module("obie", []);
app.controller('controller', function ($scope, $http, $window) {
  $scope.isDashboard = false;
  $scope.isProfile = true;
  $scope.isHistory = false;
  $scope.userIsOnPeriod = false;
  $scope.alertSuccess = false;
  $scope.editingPrescription = false;
  $scope.symptomSpotting = "None";
  $scope.symptomNausea = "None";
  $scope.symptomHeadache = "None"; 
  $scope.symptomSoreBreasts = "None";
  $scope.symptomMoodSwings = "None";
  $scope.symptomDate = "";
  $scope.symptomCramps = "None";
  $scope.symptomFlow = "None";
  $scope.symptomBackPain = "None";
  $scope.symptomBloating = "None";
  
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
      url: '/getReminderSettings',
    }).success(function(response) {
      $scope.bcDaily = response.reminderBirthControlDaily;
      $scope.bcRefill = response.reminderBirthControlRefill;
      $scope.bcRenewal = response.reminderBirthControlRenewal;
      $scope.apptReminder = response.reminderYearlyAppointment;
      $scope.apptReminderMonth = response.reminderYearlyAppointmentMonth;
    });
    
    $http({
      method: 'GET',
      url: '/getPrescriptionList'
    }).success(function(response) {
      $scope.prescriptionList = response.data;
      $scope.newPrescriptionName = "OTHER";
      $scope.newPrescriptionStatus = "Active";
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
    $scope.endPeriod = new Date();
    $scope.newPrescriptionStart = new Date();
    $scope.newPrescriptionExpiration = new Date();
    $scope.newPrescriptionRefillDate = new Date();
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
      $scope.prescriptionStart = new Date(response.data["0"].prescription.startDate);
      $scope.prescriptionRefills = parseInt(response.data["0"].prescription.refills);
      $scope.prescriptionExpiration = new Date(response.data["0"].prescription.expiration);
      $scope.prescriptionStatus = response.data["0"].prescription.status;
      $scope.prescriptionNotes = response.data["0"].prescription.notes;
      $scope.prescriptionDaysSupply = parseInt(response.data["0"].prescription.daysSupply);
      $scope.prescriptionRefillDate = new Date(response.data["0"].prescription.refillDate);
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
        $scope.prescriptionDaysSupply = parseInt(presc.prescription.daysSupply);
        $scope.prescriptionRefillDate = new Date(prec.prescription.refillDate);
      }
    });
  }
  
  $scope.loadPrescriptionDate = function() {
    $scope.userPrescriptions.forEach(function(presc) {
      if($scope.prescriptionName == presc.prescription.name) {
        $scope.prescriptionStart = new Date(presc.prescription.startDate);
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
      $scope.symptomDate = "";
      $scope.symptomCramps = "None";
      $scope.symptomNausea = "None";
      $scope.symptomHeadache = "None";
      $scope.symptomFlow = "None";
      $scope.symptomBackPain = "None";
      $scope.symptomBloating = "None";
      $scope.notes = "";
      $scope.alertSuccess = true;
      $scope.successMessage = "Symptoms saved successfully";
    });
  }

  $scope.addPrescription = function() {
    console.log("test: "+ $scope.newPrescriptionStatus);
    $http({
      method: 'POST',
      url: '/addPrescription',
      data: {
        name: $scope.newPrescriptionName,
        refills: $scope.newPrescriptionRefills,
        daysSupply: $scope.newPrescriptionDaysSupply,
        refillDate: convertDate($scope.newPrescriptionRefillDate),
        expiration: convertDate($scope.newPrescriptionExpiration),
        startDate: convertDate($scope.newPrescriptionStart),
        status: $scope.newPrescriptionStatus,
        notes: $scope.newPrescriptionNotes
      }
    }).success(function(response) {
      $("#addPrescriptionModal").modal('hide');
      $scope.newPrescriptionName = "OTHER";
      $scope.newPrescriptionRefills = "";
      $scope.newPrescriptionExpiration = new Date();
      $scope.newPrescriptionStart = new Date();
      $scope.newPrescriptionStatus = "Active";
      $scope.newPrescriptionNotes = "";
      $scope.newPrescriptionDaysSupply = "";
      $scope.newPrescriptionRefillDate = new Date();
      $scope.alertSuccess = "true";
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
        daysSupply: $scope.prescriptionDaysSupply,
        refillDate: convertDate($scope.prescriptionRefillDate),
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
  
  $scope.deletePrescription = function() {
    $http({
      method: 'POST',
      url: '/deletePrescription',
      data: {
        name: $scope.prescriptionName,
        startDate: convertDate($scope.prescriptionStart)
      }
    }).success(function(response) {
      $("#updatePrescriptionModal").modal('hide');
      $scope.alertSuccess = true;
      $scope.successMessage = "Prescription deleted successfully";
    });
  }
  
  $scope.recordPrescriptionSymptoms = function() {
    $http({
      method: 'POST',
      url: '/addPrescriptionSymptom',
      data: {
        name: $scope.prescriptionName,
        startDate: convertDate($scope.prescriptionStart),
        date: convertDate($scope.symptomDate),
        spotting: $scope.symptomSpotting,
        nausea: $scope.symptomNausea,
        headache: $scope.symptomHeadache,
        soreBreasts: $scope.symptomSoreBreasts,
        moodSwings: $scope.symptomMoodSwings,
        notes: $scope.notes
      }
    }).success(function(response) {
      $("#prescriptionSymptomModal").modal('hide');
      $scope.prescriptionStart = "";
      $scope.symptomDate = "";
      $scope.symptomSpotting = "None";
      $scope.symptomNausea = "None";
      $scope.symptomHeadache = "None"; 
      $scope.symptomSoreBreasts = "None";
      $scope.symptomMoodSwings = "None";
      $scope.notes = "";
      $scope.alertSuccess = true;
      $scope.successMessage = "Prescription symptoms added successfully";
    });
  }

$scope.changeName = function() {
  $http({
    method: 'POST',
    url: '/setName',
    data: {
      name: $scope.preferredName
    }
  }).success(function(response) {
    console.log("test");
    $("#nameModal").modal('hide');
    $scope.alertSuccess = true;
    $scope.userName = $scope.preferredName;
    $scope.successMessage = "Name changed successfully";
  });
 }

 $scope.updateReminders = function() {
   $http({
     method: 'POST',
     url: '/setReminders',
     data: {
       reminderBirthControlDaily: $scope.bcDaily,
       reminderBirthControlRefill: $scope.bcRefill,
       reminderBirthControlRenewal: $scope.bcRenewal,
       reminderYearlyAppointment: $scope.apptReminder,
       reminderYearlyAppointmentMonth: $scope.apptReminderMonth
     }
   }).success(function(response) {
     $scope.alertSuccess = true;
     $scope.successMessage = "Reminder settings updated successfully";
   });
  }

});

//Function to convert the date object to a string with only
//the current date in YYYY/MM/DD format
function convertDate(date) {
  var day = date.getDate();
  var month = date.getMonth() + 1;
  var year = date.getFullYear();
  return month + "/" + day + "/" + year;
}
