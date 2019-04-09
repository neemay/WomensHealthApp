var app = angular.module("obie", []);
app.controller('controller', function ($scope, $http, $window) {
  $scope.isDashboard = false;
  $scope.isProfile = false;
  $scope.isHistory = true;
  $scope.hasUserPeriods = false;
  $scope.hasUserPrescriptions = false;
  $scope.hasUserStats = true;
  $scope.hasPrescriptionSymptoms = false;
  $scope.hasPeriodSymptoms = false;


  $scope.showGeneralStats = true;
  $scope.showWeightStats = false;


  $scope.numPeriods = 0;
  $scope.numPrescriptions = 0;


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
      if($scope.prescriptionSymptoms.length > 0){
        $scope.hasPrescriptionSymptoms = true;
      } else {
        $scope.hasPrescriptionSymptoms = false;
      }

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
      if($scope.periodSymptoms.length > 0){
        $scope.hasPeriodSymptoms = true;
      } else {
        $scope.hasPeriodSymptoms = false;
      }
    });
  }
   
  $scope.getGeneralStats = function() {
    $scope.numPeriods = $scope.userPeriods.length;
    $scope.numPrescription = $scope.userPrescriptions.length;
    $scope.showGeneralStats = !$scope.showPeriodStats;
    $scope.showWeightStats = false;
  }

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
      var ctx = $("#weightStats");
      var chart = new Chart(ctx, {
        type: "line",
        data: {
          labels: dates,
          datasets: [{
            data: chartData,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgba(75, 192, 192, 0.1)",
            pointRadius: 5,
            pointHoverRadius: 5,
            pointBackgroundColor: "rgb(75, 192, 192)" 
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
                labelString: "Date Recorded"
              }
            }],
            yAxes: [{
              scaleLabel: {
                display: true,
                labelString: "Weight (lbs)"
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
    });
  }


});
