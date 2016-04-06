angular.module('logAggregator').controller('defineDataController', ['$scope', 'defineDataService',
  function($scope, defineDataService) {
    $scope.dimensionList = [];
    $scope.measureList = [];
    $scope.logdataList = [];
    // var handleSuccess = function(response) {
    //   console.log(response.data);
    //   $scope.dimensionList = response.data;
    // };
    //
    // var handleError = function(response) {
    //   $scope.dimensionList = undefined;
    // };

    //defineDataService.getDimensionData(handleSuccess, handleError);
    //defineDataService.getMeasureData(handleSuccess, handleError);

    defineDataService.getDimensionData().then(function(response) {
      var dimArr = response.data;
      if (dimArr.length > 0) {
        for (var i = 0; i < dimArr.length; i++) {
          $scope.dimensionList.push(dimArr[i].dispName);
        }
      }
    });
    defineDataService.getMeasureData().then(function(response) {
      var mArr = response.data;
      if (mArr.length > 0) {
        for (var i = 0; i < mArr.length; i++) {
          $scope.measureList.push(mArr[i].dispName);
        }
      }
    });
    defineDataService.getLogData().then(function(response) {
      $scope.logdataList = response.data;
      //console.log($scope.logdataList)
    });
  }
]);
