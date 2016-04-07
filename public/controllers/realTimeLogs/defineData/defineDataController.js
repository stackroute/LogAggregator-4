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
      console.log("array",dimArr);
      if (dimArr.length > 0) {
        for (var i = 0; i < dimArr.length; i++) {
          //console.log("inside loop", dimArr[i].dispName);
          $scope.dimensionList.push(dimArr[i].displayName);
        }
      }
      //console.log("scope",$scope.dimensionList);
    });
    defineDataService.getMeasureData().then(function(response) {
      var mArr = response.data;
      console.log(mArr);
      if (mArr.length > 0) {
        for (var i = 0; i < mArr.length; i++) {
          $scope.measureList.push(mArr[i].displayName);
        }
      }
    });
    defineDataService.getLogData().then(function(response) {
      $scope.logdataList = response.data;
      //console.log($scope.logdataList);
      $scope.cols = Object.keys($scope.logdataList[0]);

    });
  }
]);
