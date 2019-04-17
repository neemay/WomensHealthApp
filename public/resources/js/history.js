var app = angular.module('obie', []);
//Filter to extract the prescription name from the prescriptionId
app.filter('prescFromId', function() {
  return function(x) {
    console.log(x);
    var index = x.indexOf(':') + 1;
    x = x.substr(index);
    index = x.indexOf(':');
    x = x.substr(0, index);
    console.log(x);
    return x.replace(/-/g, ' ');
  };
});
//Filter to extract the period start date from the periodId
app.filter('periodFromId', function() {
  return function(x) {
    console.log(x);
    var index = x.indexOf(':') + 1;
    return x.substr(index);
  };
});
app.controller('controller', function ($scope, $http, $window) {
  //Initialize scope variables
  $scope.isDashboard = false;
  $scope.isProfile = false;
  $scope.isHistory = true;
  $scope.hasUserPeriods = false;
  $scope.hasUserPrescriptions = false;
  $scope.hasUserStats = true;
  $scope.hasWeight = false;
  $scope.hasPrescriptionSymptoms = false;
  $scope.hasPeriodSymptomsDate = false;
  $scope.hasPrescriptionSymptomsDate = false;
  $scope.hasPeriodSymptoms = false;
  $scope.showGeneralStats = true;
  $scope.showWeightStats = false;
  $scope.numPeriods = 0;
  $scope.numPrescriptions = 0;
  $scope.today = new Date();
  $scope.searchDate = $scope.today;

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
    });

    //Get the user's periods
    $http({
      method: 'GET',
      url: '/getUserPeriods'
    }).success(function(response) {
      $scope.userPeriods = response.data;
      $scope.numPeriods = $scope.userPeriods.length;
      if(response.data.length > 0){
        $scope.hasUserPeriods = true;
      }
    });

    //Get the user's prescriptions
    $http({
      method: 'GET',
      url: '/getUserPrescriptions'
    }).success(function(response) {
      $scope.userPrescriptions = response.data;
      $scope.numPrescriptions = $scope.userPrescriptions.length;
      if(response.data.length > 0){
        $scope.hasUserPrescriptions = true;
      }
    });
    $('#generalStatsBtn').button('toggle');
  };

  //Function to get the prescription symptoms by prescription id
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

  //Function to get the period symptoms by period id
  $scope.getPeriodSymptoms = function(id, startDate) {
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
   
  //Function to get any symptoms for a given date
  //Symptoms for both periods and prescriptions are returned
  $scope.searchSymptoms = function() {
    //Get the period symptoms by date
    $http({
      method: 'GET',
      url: '/getPeriodSymptomsByDate',
      params: {
        date: convertDate($scope.searchDate)
      }
    }).success(function(response) {
      if(response.data.length > 0) {
        $scope.periodSymptomsDate = response.data;
        $scope.hasPeriodSymptomsDate = true;
      }
      else
        $scope.hasPeriodSymptomsDate = false;
      $('#dateModal').modal('show');
    });
    
    //Get the prescription symptoms by date
    $http({
      method: 'GET',
      url: '/getPrescriptionSymptomsByDate',
      params: {
        date: convertDate($scope.searchDate)
      }
    }).success(function(response) {
      if(response.data.length > 0) {
        $scope.prescriptionSymptomsDate = response.data;
        $scope.hasPrescriptionSymptomsDate = true;
      }
      else
        $scope.hasPrescriptionSymptomsDate = false;
      $('#dateModal').modal('show');
    });
    
  };
  
  //Function to display the general statistics
  $scope.getGeneralStats = function() {
    $scope.numPeriods = $scope.userPeriods.length;
    $scope.numPrescriptions = $scope.userPrescriptions.length;
    $scope.showGeneralStats = !$scope.showPeriodStats;
    $scope.showWeightStats = false;
    $('#generalStatsBtn').button('toggle');
    $('#weightStatsBtn').button('toggle');
  };

  //Function to get the weight information and display the chart
  //Chart is generated using the open source javascript framework Chartjs
  $scope.getWeightStats = function() {
    $http({
      method: 'GET',
      url: '/getUserWeights'
    }).success(function(response) {
      var data = response.data;
      if(response.data.length > 0) {
        $scope.hasWeight = true;
        var dates = [];
        var chartData = [];
        var maxWeight = 0;
        data.forEach(function(weight) {
          if(parseInt(weight.weight.weightVal) > maxWeight) {
            maxWeight = parseInt(weight.weight.weightVal);
          }
          chartData.push({
            t: new Date(weight.weight.recordDate),
            y: parseInt(weight.weight.weightVal)
          });
          dates.push(new Date(weight.weight.recordDate).toLocaleDateString());
        });
        maxWeight = maxWeight + 10;

        //Create the visualization
        var ctx = $('#weightStats');
        var chart = new Chart(ctx, {
          type: 'line',
          data: {
            labels: dates,
            datasets: [{
              data: chartData,
              borderColor: 'rgb(81, 188, 182)',
              backgroundColor: 'rgba(81, 188, 182, 0.1)',
              pointRadius: 5,
              pointHoverRadius: 5,
              pointBackgroundColor: 'rgb(81, 188, 182)' 
            }]
          },
          options: {
            legend: {
              display: false
            },
            scales: {
              xAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Date Recorded'
                }
              }],
              yAxes: [{
                scaleLabel: {
                  display: true,
                  labelString: 'Weight (lbs)'
                },
                ticks: {
                  suggestedMin: 50,
                  suggestedMax: maxWeight,
                  stepSize: 10
                }
              }]
            }
          }
        });
      } 
      else {
        $scope.hasWeight = false;
      }
      $scope.showGeneralStats = false;
      $scope.showWeightStats = !$scope.showWeightStats;
      $('#generalStatsBtn').button('toggle');
      $('#weightStatsBtn').button('toggle');
    });
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
