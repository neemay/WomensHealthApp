var app = angular.module('obie', []);
app.controller('controller', function ($scope, $http, $window) {
  $scope.isDashboard = false;
  $scope.isProfile = true;
  $scope.isHistory = false;
  $scope.userIsOnPeriod = false;
  $scope.alertSuccess = false;
  $scope.alertError = false;
  $scope.editingPrescription = false;
  $scope.symptomSpottingPresc = 'None';
  $scope.symptomNauseaPresc = 'None';
  $scope.symptomHeadachePresc = 'None';
  $scope.symptomSoreBreastsPresc = 'None';
  $scope.symptomMoodSwingsPresc = 'None';
  $scope.symptomCrampsPeriod = 'None';
  $scope.symptomNauseaPeriod = 'None';
  $scope.symptomHeadachePeriod = 'None';
  $scope.symptomFlowPeriod = 'None';
  $scope.symptomBackPainPeriod = 'None';
  $scope.symptomBloatingPeriod = 'None';
  $scope.weightError = '';
  $scope.nameError = '';
  $scope.newPrescError = '';
  $scope.newPrescriptionRefills = 1;
  $scope.newPrescriptionDaysSupply = 28;
  
  //Initialize all of the dates
  //Timezones mess with the max calendar dates,
  //so force the time of today to be midnight
  $scope.today = new Date();
  $scope.today.setHours(0,0,0,0);
  $scope.symptomDatePeriod = $scope.today;
  $scope.symptomDatePresc = $scope.today;
  $scope.weightDate = $scope.today;
  $scope.startPeriod = $scope.today;
  $scope.endPeriod = $scope.today;
  $scope.newPrescriptionStart = $scope.today;
  $scope.newPrescriptionExpiration = $scope.today;
  $scope.newPrescriptionRefillDate = $scope.today;
  
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
    }).error(function() {
      $scope.alertError = true;
      $scope.errorMessage = 'Something went wrong. Please try again later.';
    });

    $http({
      method: 'GET',
      url: '/getEmail',
    }).success(function(response) {
      $scope.email = response.email;
    }).error(function() {
      $scope.alertError = true;
      $scope.errorMessage = 'Something went wrong. Please try again later.';
    });

    $http({
      method: 'GET',
      url: '/isOnPeriod',
    }).success(function(response) {
      console.log(response);
      $scope.userIsOnPeriod = response.isOnPeriod;
      if(response.isOnPeriod) {
        $scope.currentPeriod = response.currentPeriod;
        $scope.minDateEnd = new Date($scope.currentPeriod);
        $scope.minDateEnd.setDate($scope.minDateEnd.getDate() + 1);
        $scope.minDateEnd.setHours(0,0,0,0);
      }
      else {
        $scope.lastPeriod = response.lastPeriod;
        $scope.minDateStart = new Date($scope.lastPeriod);
        $scope.minDateStart.setDate($scope.minDateStart.getDate() + 1);
        $scope.minDateStart.setHours(0,0,0,0);
      }
    }).error(function() {
      $scope.alertError = true;
      $scope.errorMessage = 'Something went wrong. Please try again later.';
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
    }).error(function() {
      $scope.alertError = true;
      $scope.errorMessage = 'Something went wrong. Please try again later.';
    });
    
    $scope.getUserPrescriptions();
    
    $http({
      method: 'GET',
      url: '/getPrescriptionList'
    }).success(function(response) {
      $scope.prescriptionList = response.data;
      $scope.newPrescriptionName = 'OTHER';
      $scope.newPrescriptionStatus = 'Active';
    }).error(function() {
      $scope.alertError = true;
      $scope.errorMessage = 'Something went wrong. Please try again later.';
    });

    if($window.location.hash == '#periodSymptomModal') {
      $('#periodSymptomModal').modal();
    }
    else if($window.location.hash == '#prescriptionSymptomModal') {
      $('#prescriptionSymptomModal').modal();
    }
    else if($window.location.hash == '#endPeriodModal') {
      $('#endPeriodModal').modal();
    }
    else if($window.location.hash == '#startPeriodModal') {
      $('#startPeriodModal').modal();
    }   
  };

  $scope.recordStartPeriod = function() {
    if($scope.startPeriod == null)
      return;
    $http({
      method: 'POST',
      url: '/addPeriodStart',
      data: {
        startDate: convertDate($scope.startPeriod)
      }
    }).success(function() {
      $('#startPeriodModal').modal('hide');
      $scope.userIsOnPeriod = true;
      $scope.currentPeriod = convertDate($scope.startPeriod);
      $scope.minDateEnd = new Date($scope.currentPeriod);
      $scope.minDateEnd.setDate($scope.minDateEnd.getDate() + 1);
      $scope.minDateEnd.setHours(0,0,0,0);
      $scope.startPeriod = $scope.today;
    }).error(function() {
      $('#startPeriodModal').modal('hide');
      $scope.alertError = true;
      $scope.errorMessage = 'Something went wrong. Please try again later.';
    });
  };

  $scope.recordEndPeriod = function() {
    if($scope.endPeriod == null)
      return;
    $http({
      method: 'POST',
      url: '/addPeriodEnd',
      data: {
        endDate: convertDate($scope.endPeriod)
      }
    }).success(function() {
      $('#endPeriodModal').modal('hide');
      $scope.userIsOnPeriod = false;
      $scope.lastPeriod = convertDate($scope.endPeriod);
      $scope.minDateStart = new Date($scope.lastPeriod);
      $scope.minDateStart.setDate($scope.minDateStart.getDate() + 1);
      $scope.minDateStart.setHours(0,0,0,0);
      $scope.endPeriod = $scope.today;
    }).error(function() {
      $('#endPeriodModal').modal('hide');
      $scope.alertError = true;
      $scope.errorMessage = 'Something went wrong. Please try again later.';
    });
  };

  $scope.getUserPrescriptions = function() {
    $scope.editingPrescription = true;
    $http({
      method: 'GET',
      url: '/getUserPrescriptions'
    }).success(function(response) {
      $scope.userPrescriptions = null;
      if(response.data.length > 0) {
        $scope.userPrescriptions = response.data;
        $scope.prescription = $scope.userPrescriptions[0];
        $scope.prescriptionSympt = $scope.userPrescriptions[0];
        $scope.prescriptionName = response.data['0'].prescription.name;
        $scope.prescriptionStart = new Date(response.data['0'].prescription.startDate);
        $scope.prescriptionRefills = parseInt(response.data['0'].prescription.refills);
        $scope.prescriptionExpiration = new Date(response.data['0'].prescription.expiration);
        $scope.prescriptionStatus = response.data['0'].prescription.status;
        $scope.prescriptionNotes = response.data['0'].prescription.notes;
        $scope.prescriptionDaysSupply = parseInt(response.data['0'].prescription.daysSupply);
        $scope.prescriptionRefillDate = new Date(response.data['0'].prescription.refillDate);
      }
    }).error(function() {
      $scope.alertError = true;
      $scope.errorMessage = 'Something went wrong. Please try again later.';
    });
  };

  $scope.loadPrescription = function() {
    $scope.userPrescriptions.forEach(function(presc) {
      if($scope.prescription.prescription.prescriptionId == presc.prescription.prescriptionId) {
        $scope.prescriptionName = presc.prescription.name;
        $scope.prescriptionRefills = parseInt(presc.prescription.refills);
        $scope.prescriptionExpiration = new Date(presc.prescription.expiration);
        $scope.prescriptionStart = new Date(presc.prescription.startDate);
        $scope.prescriptionStatus = presc.prescription.status;
        $scope.prescriptionNotes = presc.prescription.notes;
        $scope.prescriptionDaysSupply = parseInt(presc.prescription.daysSupply);
        $scope.prescriptionRefillDate = new Date(presc.prescription.refillDate);
      }
    });
  };
  
  $scope.loadPrescriptionDate = function() {
    $scope.userPrescriptions.forEach(function(presc) {
      if($scope.prescription.prescription.prescriptionId == presc.prescription.prescriptionId) {
        $scope.prescriptionStart = new Date(presc.prescription.startDate);
      }
    });
  };
  
  $scope.recordPeriodSymptoms = function() {
    if($scope.symptomDatePeriod == null)
      return;
    $http({
      method: 'POST',
      url: '/addPeriodSymptom',
      data: {
        periodStartDate: $scope.currentPeriod,
        date: convertDate($scope.symptomDatePeriod),
        cramps: $scope.symptomCrampsPeriod,
        nausea: $scope.symptomNauseaPeriod,
        headache: $scope.symptomHeadachePeriod,
        flow: $scope.symptomFlowPeriod,
        backPain: $scope.symptomBackPainPeriod,
        bloating: $scope.symptomBloatingPeriod,
        notes: $scope.notesPeriod
      }
    }).success(function() {
      $('#periodSymptomModal').modal('hide');
      $scope.symptomDatePeriod = $scope.today;
      $scope.symptomCrampsPeriod = 'None';
      $scope.symptomNauseaPeriod = 'None';
      $scope.symptomHeadachePeriod = 'None';
      $scope.symptomFlowPeriod = 'None';
      $scope.symptomBackPainPeriod = 'None';
      $scope.symptomBloatingPeriod = 'None';
      $scope.notesPeriod = '';
      $scope.alertSuccess = true;
      $scope.successMessage = 'Symptoms saved successfully';
    }).error(function() {
      $('#periodSymptomModal').modal('hide');
      $scope.alertError = true;
      $scope.errorMessage = 'Something went wrong. Please try again later.';
    });
  };

  $scope.addPrescription = function() {
    var exists = false;
    if($scope.userPrescriptions) {
      $scope.userPrescriptions.forEach(function(presc) {
        if(presc.prescription.status == 'Active') {
          if($scope.newPrescriptionName == presc.prescription.name) {
            $scope.newPrescError = 'You already have an active prescription of this kind. Please edit the active prescription directly or set its status to inactive before adding a new prescription.';
            exists = true;
          }
        }
        else {
          if($scope.newPrescriptionName == presc.prescription.name && convertDate($scope.newPrescriptionStart) == presc.prescription.startDate) {
            $scope.newPrescError = 'You cannot add a prescription with the same name and start date as an already existing prescription.';
            exists = true;
          }
        }
      });
    }
    if(exists)
      return;
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
    }).success(function() {
      $('#addPrescriptionModal').modal('hide');
      $scope.newPrescriptionName = 'OTHER';
      $scope.newPrescriptionRefills = 1;
      $scope.newPrescriptionExpiration = $scope.today;
      $scope.newPrescriptionStart = $scope.today;
      $scope.newPrescriptionStatus = 'Active';
      $scope.newPrescriptionNotes = '';
      $scope.newPrescriptionDaysSupply = 28;
      $scope.newPrescriptionRefillDate = $scope.today;
      $scope.alertSuccess = 'true';
      $scope.successMessage = 'Prescription saved successfully';
      $scope.newPrescError = '';
      $scope.getUserPrescriptions();
    }).error(function() {
      $('#addPrescriptionModal').modal('hide');
      $scope.alertError = true;
      $scope.newPrescError = '';
      $scope.errorMessage = 'Something went wrong. Please try again later.';
    });
  };

  $scope.updatePrescription = function() {
    $http({
      method: 'POST',
      url: '/updatePrescription',
      data: {
        id: $scope.prescription.prescription.prescriptionId,
        name: $scope.prescriptionName,
        refills: $scope.prescriptionRefills,
        daysSupply: $scope.prescriptionDaysSupply,
        refillDate: convertDate($scope.prescriptionRefillDate),
        expiration: convertDate($scope.prescriptionExpiration),
        startDate: convertDate($scope.prescriptionStart),
        status: $scope.prescriptionStatus,
        notes: $scope.prescriptionNotes
      }
    }).success(function() {
      $('#updatePrescriptionModal').modal('hide');
      $scope.alertSuccess = true;
      $scope.successMessage = 'Prescription updated successfully';
    }).error(function() {
      $('#updatePrescriptionModal').modal('hide');
      $scope.alertError = true;
      $scope.errorMessage = 'Something went wrong. Please try again later.';
    });
  };
  
  $scope.confirmDelete = function() {
    $('#updatePrescriptionModal').modal('hide');
    $('#confirmDeleteModal').modal('show');
  };
  
  $scope.nevermind = function() {
    $('#confirmDeleteModal').modal('hide');
    $('#updatePrescriptionModal').modal('show');
  };
  
  $scope.deletePrescription = function() {
    $http({
      method: 'POST',
      url: '/deletePrescription',
      data: {
        id: $scope.prescription.prescription.prescriptionId
      }
    }).success(function() {
      $('#confirmDeleteModal').modal('hide');
      $scope.alertSuccess = true;
      $scope.successMessage = 'Prescription deleted successfully';
      $scope.getUserPrescriptions();
    }).error(function() {
      $('#confirmDeleteModal').modal('hide');
      $scope.alertError = true;
      $scope.errorMessage = 'Something went wrong. Please try again later.';
    });
  };
  
  $scope.recordPrescriptionSymptoms = function() {
    if($scope.symptomDatePresc == null)
      return;
    $http({
      method: 'POST',
      url: '/addPrescriptionSymptom',
      data: {
        id: $scope.prescriptionSympt.prescription.prescriptionId,
        date: convertDate($scope.symptomDatePresc),
        spotting: $scope.symptomSpottingPresc,
        nausea: $scope.symptomNauseaPresc,
        headache: $scope.symptomHeadachePresc,
        soreBreasts: $scope.symptomSoreBreastsPresc,
        moodSwings: $scope.symptomMoodSwingsPresc,
        notes: $scope.notesPresc
      }
    }).success(function() {
      $('#prescriptionSymptomModal').modal('hide');
      $scope.prescriptionStart = '';
      $scope.symptomDatePresc = $scope.today;
      $scope.symptomSpottingPresc = 'None';
      $scope.symptomNauseaPresc = 'None';
      $scope.symptomHeadachePresc = 'None'; 
      $scope.symptomSoreBreastsPresc = 'None';
      $scope.symptomMoodSwingsPresc = 'None';
      $scope.notesPresc = '';
      $scope.alertSuccess = true;
      $scope.successMessage = 'Prescription symptoms added successfully';
    }).error(function() {
      $('#prescriptionSymptomModal').modal('hide');
      $scope.alertError = true;
      $scope.errorMessage = 'Something went wrong. Please try again later.';
    });
  };

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
    }).success(function() {
      $scope.alertSuccess = true;
      $scope.successMessage = 'Reminder settings updated successfully';
    }).error(function() {
      $scope.alertError = true;
      $scope.errorMessage = 'Something went wrong. Please try again later.';
    });
  };
 
  $scope.addWeight = function() {
    if($scope.weightVal == '') {
      $scope.weightError = 'Please enter a valid weight';
      return;
    }
    else if($scope.weightVal < 50 || $scope.weightVal > 900) {
      $scope.weightError = 'Please enter a weight between 50 and 900 pounds.';
      return;
    }
    $http({
      method: 'POST',
      url: '/addWeight',
      data: {
        recordDate: convertDate($scope.weightDate),
        weightVal: $scope.weightVal
      }
    }).success(function() {
      $('#addWeightModal').modal('hide');
      $scope.alertSuccess = true;
      $scope.successMessage = 'Weight added successfully';
      $scope.weightVal = '';
      $scope.weightDate = $scope.today;
    }).error(function() {
      $('#addWeightModal').modal('hide');
      $scope.alertError = true;
      $scope.errorMessage = 'Something went wrong. Please try again later.';
    });
    $scope.weightError = '';
  };

  $scope.changeName = function() {
    if($scope.preferredName == null || $scope.preferredName == '') {
      $scope.nameError = 'Please enter a name.';
      return;
    }
    $http({
      method: 'POST',
      url: '/setName',
      data: {
        name: $scope.preferredName
      }
    }).success(function() {
      $('#nameModal').modal('hide');
      $scope.alertSuccess = true;
      $scope.userName = $scope.preferredName;
      $scope.successMessage = 'Name changed successfully';
    }).error(function() {
      $('#nameModal').modal('hide');
      $scope.alertError = true;
      $scope.errorMessage = 'Something went wrong. Please try again later.';
    });
    $scope.nameError = '';
  };
  
  $scope.dismissSuccess = function() {
    $scope.alertSuccess = false;
  };
  
  $scope.dismissError = function() {
    $scope.alertError = false;
  };
});

//Function to convert the date object to a string with only
//the current date in YYYY/MM/DD format
function convertDate(date) {
  var day = ('0' + date.getDate()).slice(-2);
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var year = date.getFullYear();
  return month + '/' + day + '/' + year;
}
