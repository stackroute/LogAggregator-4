angular.module('logAggregator').controller('defineDataController', ['$scope', 'defineDataService',
  function($scope, defineDataService) {
    $scope.dimensionList = [];
    $scope.measureList = [];

    $scope.hoverIn = function() {
      this.hoverEdit = true;
    };

    $scope.hoverOut = function() {
      this.hoverEdit = false;
    };

    $scope.selectedDim = function(val) {
      if (!val) {
        return ;
      }
      $scope.dimVal = val;
    }

    $scope.selectedMeas = function(key,val) {
      if (!key) {
        return ;
      }
      $scope.measField = key;
      $scope.measValue = val;
    }

    $scope.getKeys = function(obj) {
      if (!obj) {
        return [];
      }
      //console.log(Object.keys(obj));
      return Object.keys(obj);
    }
    $scope.rowSelected = function(obj) {
      if (!obj) {
        return {};
      }
      $scope.selectedRow = obj;
    }
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
      $scope.cols = Object.keys($scope.logdataList[0]);

    });
  }
]);
