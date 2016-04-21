angular.module('logAggregator').controller('defineDataController', ['$scope','$http', 'defineDataService',
  function($scope,$http, defineDataService) {
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
    $scope.submitDimension=function() {
      dimobj={
        displayName:$scope.displayname,
        fieldname:$scope.dimVal
      }
      console.log("post",dimobj);
      $http({method: 'Post', url: '/dimensions/addDimension',data:{data:dimobj}}).
                success(function(data, status, headers, config) {
                console.log("Successful");
                console.log(data);
                  });
      console.log(dimobj.displayName);
      $scope.dimensionList.push(dimobj.displayName);
    }

    $scope.submitMeasure=function() {
      measobj={
        displaymeasurename:$scope.displaymeasurename,
        measureFieldSelector:$scope.measureFieldSelector,
        measure:$scope.measure,
        measField:$scope.measField,
        measValue:$scope.measValue
      }
      console.log("post",measobj);
      $http({method: 'Post', url: '/measures/addMeasure',data:{data:measobj}}).
                success(function(data, status, headers, config) {
                console.log("Successful");
                console.log(data);
                  });
      $scope.measureList.push(measobj.displaymeasurename);
    }


    $scope.deleteDimension=function(dim) {
      console.log("final array",dimArr);
      for (var i = 0; i < dimArr.length; i++) {
        if(dimArr[i].displayName==="dim")
        {
            dimArr.pop(dimArr[i]);
            console.log("final array",dimArr);
            console.log("deleted object",dimArr[i]);
        }
      }
      console.log("delete",dim);
      // $http({method: 'Post', url: '/dimensions/delete/:id',data:{data:dimobj}}).
      //           success(function(data, status, headers, config) {
      //           console.log("Successful");
      //           console.log(data);
      //             });
      //console.log(dimobj.displayName);
      $scope.dimensionList.pop(dim);
    }

    $scope.deleteMeasure=function(measure) {
      // dimobj={
      //   displayName:$scope.displayname,
      //   fieldname:$scope.dimVal
      // }
      console.log("delete",measure);
      // $http({method: 'Post', url: '/dimensions/delete/:id',data:{data:dimobj}}).
      //           success(function(data, status, headers, config) {
      //           console.log("Successful");
      //           console.log(data);
      //             });
      //console.log(dimobj.displayName);
      $scope.measureList.pop(measure);
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
      return Object.keys(obj);
    }
    $scope.rowSelected = function(obj) {
      if (!obj) {
        return {};
      }
      $scope.selectedRow = obj;
    }
    defineDataService.getDimensionData().then(function(response) {
      dimArr = response.data;
      console.log("array",$scope.dimArr);
      if (dimArr.length > 0) {
        for (var i = 0; i < dimArr.length; i++) {
          $scope.dimensionList.push(dimArr[i].displayName);
        }
      }
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
      $scope.namespaceName=response.data.namespaceName;
      $scope.logdataList = response.data.filedata;
      $scope.cols = Object.keys($scope.logdataList[0]);
      
    });
  }
]);
