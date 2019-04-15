var app = angular.module('obie', []);
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
app.filter('periodFromId', function() {
  return function(x) {
    console.log(x);
    var index = x.indexOf(':') + 1;
    return x.substr(index);
  };
});
app.controller('controller', function ($scope, $http, $window) {
  $scope.isDashboard = false;
  $scope.isProfile = false;
  $scope.isHistory = true;
  $scope.hasUserPeriods = false;
  $scope.hasUserPrescriptions = false;
  $scope.hasUserStats = true;
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
      $scope.numPeriods = $scope.userPeriods.length;
      if(response.data.length > 0){
        $scope.hasUserPeriods = true;
      }
    });


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
   
  $scope.searchSymptoms = function() {
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
  
  $scope.getGeneralStats = function() {
    $scope.numPeriods = $scope.userPeriods.length;
    $scope.numPrescriptions = $scope.userPrescriptions.length;
    $scope.showGeneralStats = !$scope.showPeriodStats;
    $scope.showWeightStats = false;
    $('#generalStatsBtn').button('toggle');
    $('#weightStatsBtn').button('toggle');
  };

  $scope.getWeightStats = function() {
    $http({
      method: 'GET',
      url: '/getUserWeights'
    }).success(function(response) {
      var data = response.data;
      var dates = [];
      //var weights = [];
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
      //console.log(chartData);
      //console.log(weights);
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
  return month + '/' + day + '/' + year;
}
