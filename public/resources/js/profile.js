var app = angular.module('obie', []);
app.controller('controller', function ($scope, $http, $window) {
  //Initialize scope variables
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
  
  //Function to call the logout endpoint
  $scope.logout = function() {
    $http({
      method: 'GET',
      url: '/logout'
    }).success(function() {
      $window.location.href = '/';
    });
  };

  //Initialization function
  $scope.init = function() {
    //Get the user's name
    $http({
      method: 'GET',
      url: '/getUserName',
    }).success(function(response) {
      $scope.userName = response.name;
    }).error(function() {
      $scope.alertError = true;
      $scope.errorMessage = 'Something went wrong. Please try again later.';
    });

    //Get the user's email
    $http({
      method: 'GET',
      url: '/getEmail',
    }).success(function(response) {
      $scope.email = response.email;
    }).error(function() {
      $scope.alertError = true;
      $scope.errorMessage = 'Something went wrong. Please try again later.';
    });

    //Get the user's period status
    $http({
      method: 'GET',
      url: '/isOnPeriod',
    }).success(function(response) {
      $scope.userIsOnPeriod = response.isOnPeriod;
      if(response.isOnPeriod) {
        $scope.currentPeriod = new Date(response.currentPeriod);
        $scope.minDateEnd = $scope.currentPeriod;
        $scope.minDateEnd.setDate($scope.minDateEnd.getDate() + 1);
        $scope.minDateEnd.setHours(0,0,0,0);
      }
      else {
        $scope.lastPeriod = new Date(response.lastPeriod);
        $scope.minDateStart = $scope.lastPeriod;
        $scope.minDateStart.setDate($scope.minDateStart.getDate() + 1);
        $scope.minDateStart.setHours(0,0,0,0);
      }
    }).error(function() {
      $scope.alertError = true;
      $scope.errorMessage = 'Something went wrong. Please try again later.';
    });

    //Get the user's reminder settings
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
    
    //Get the user's prescriptions
    $scope.getUserPrescriptions();
    $scope.getActivePrescriptions();
    
    //Get the prescription list
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

    //CHeck the url for a hash and open the associated modal if present
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
    else if($window.location.hash == '#addPrescriptionModal') {
      $('#addPrescriptionModal').modal();
    }
  };

  //Function to call the addPeriodStart endpoint
  //On success, sets the date so a user cannot set the end of their period
  //before the start date
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
      $scope.currentPeriod = $scope.startPeriod;
      $scope.minDateEnd = new Date($scope.currentPeriod);
      $scope.minDateEnd.setDate($scope.minDateEnd.getDate() + 1);
      $scope.minDateEnd.setHours(0,0,0,0);
      $scope.startPeriod = $scope.today;
      $scope.alertSuccess = true;
      $scope.successMessage = 'Period start date saved successfully';
    }).error(function() {
      $('#startPeriodModal').modal('hide');
      $scope.alertError = true;
      $scope.errorMessage = 'Something went wrong. Please try again later.';
    });
  };

  //Function to call the addPeriodEnd endpoint
  //On success, sets the date so a user cannot set the start of the
  //next period before the end of this one
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
      $scope.lastPeriod = $scope.endPeriod;
      $scope.minDateStart = new Date($scope.lastPeriod);
      $scope.minDateStart.setDate($scope.minDateStart.getDate() + 1);
      $scope.minDateStart.setHours(0,0,0,0);
      $scope.endPeriod = $scope.today;
      $scope.alertSuccess = true;
      $scope.successMessage = 'Period end date saved successfully';
    }).error(function() {
      $('#endPeriodModal').modal('hide');
      $scope.alertError = true;
      $scope.errorMessage = 'Something went wrong. Please try again later.';
    });
  };

  //Function to call the getUserPrescriptions endpoint
  //On success, gets the list of user prescriptions and sets the default
  //variables to the first prescription in the list
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

  //Function to get the active prescriptions for this user
  $scope.getActivePrescriptions = function() {
    $http({
      method: 'GET',
      url: '/getActiveUserPrescriptions'
    }).success(function(response) {
      $scope.activePrescriptions = null;
      if(response.data.length > 0) {
        $scope.activePrescriptions = response.data;
        $scope.prescriptionSympt = $scope.activePrescriptions[0];
      }
      
    }).error(function() {
      $scope.alertError = true;
      $scope.errorMessage = 'Something went wrong. Please try again later.';
    });
  };
  
  //Function to load the selected prescription information from the list of prescriptions
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
  
  //Function to load the start date for a prescription given its id
  $scope.loadPrescriptionDate = function() {
    $scope.userPrescriptions.forEach(function(presc) {
      if($scope.prescription.prescription.prescriptionId == presc.prescription.prescriptionId) {
        $scope.prescriptionStart = new Date(presc.prescription.startDate);
      }
    });
  };
  
  //Function to call the addPeriodSymptom endpoint and add a period symptom
  //On success, resets all of the symptom variables
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

  //Function to call the addPrescription endpoint
  //Checks that the user is not adding the same prescription as a prescription that is already active
  //Checks that the user is not adding the same prescription and start date as an inactive prescription
  //On success, resets the prescription variables
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
      $scope.getActivePrescriptions();
    }).error(function() {
      $('#addPrescriptionModal').modal('hide');
      $scope.alertError = true;
      $scope.newPrescError = '';
      $scope.errorMessage = 'Something went wrong. Please try again later.';
    });
  };

  //Function to call the updatePrescription endpoint and update a prescription
  $scope.updatePrescription = function() {
    $scope.dismissAlerts();
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
      $scope.getActivePrescriptions();
    }).error(function() {
      $('#updatePrescriptionModal').modal('hide');
      $scope.alertError = true;
      $scope.errorMessage = 'Something went wrong. Please try again later.';
    });
  };
  
  //Function to display the delete confirmation modal
  $scope.confirmDelete = function() {
    $scope.dismissAlerts();
    $('#updatePrescriptionModal').modal('hide');
    $('#confirmDeleteModal').modal('show');
  };
  
  //Function to display the update modal if delete is not confirmed
  $scope.nevermind = function() {
    $('#confirmDeleteModal').modal('hide');
    $('#updatePrescriptionModal').modal('show');
  };
  
  //Function to call the deletePrescription endpoint and delete a prescription
  //On success, getUserPrescriptions is called to update the prescription list
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
      $scope.getActivePrescriptions();
    }).error(function() {
      $('#confirmDeleteModal').modal('hide');
      $scope.alertError = true;
      $scope.errorMessage = 'Something went wrong. Please try again later.';
    });
  };
  
  //Function to call addPrescriptionSymptom and add a prescription symptom
  //On success, resets the prescription symptoms variables
  $scope.recordPrescriptionSymptoms = function() {
    $scope.dismissAlerts();
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

  //Function to call the setReminders endpoint and update the user's reminder settings
  $scope.updateReminders = function() {
    $scope.dismissAlerts();
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
 
  //Function to call the addWeight endpoint and add the weight for this user
  //Checks that the weight value is not empty and between 50 and 900 pounds
  //On success, resets the weight variables
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

  //Function to call the setName endpoint and update the user's preferred name
  //Checks that the name is not empty
  //On success, updates the user's name in the profile page
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
  
  //Function to dismiss the success and error alerts
  $scope.dismissAlerts = function() {
    $scope.alertSuccess = false;
    $scope.alertError = false;
  };
});

//Function to convert the date object to a string with only
//the current date in YYYY/MM/DD format
function convertDate(date) {
  var day = ('0' + date.getDate()).slice(-2);
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var year = date.getFullYear();
  return year + '/' + month + '/' + day;
}
