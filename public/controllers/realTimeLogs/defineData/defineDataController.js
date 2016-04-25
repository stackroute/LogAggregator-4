angular.module('logAggregator').controller('defineDataController', ['$scope', '$http', 'defineDataService',
  function($scope, $http, defineDataService) {
    $scope.dimensionList = [];
    $scope.measureList = [];
    $scope.displayDimError = false;
    $scope.displayMeasError = false;
    $scope.namespaceName = "Create namespace";

    $scope.showContent = function($fileContent) {
      $scope.content = $fileContent;
    };

    $scope.hoverIn = function() {
      this.hoverEdit = true;
    };

    $scope.hoverOut = function() {
      this.hoverEdit = false;
    };

    $scope.selectedDim = function(val) {
      if (!val) {
        return;
      }
      $scope.dimVal = val;
    }
    $scope.submitDimension = function() {
      if($scope.addDimForm.$invalid)
      {
        console.log("ERROR");
        return;
      }
      dimobj = {
        displayName: $scope.displayname,
        fieldname: $scope.dimVal,
        namespaceName :$scope.namespaceName
      }
      if ($scope.displayname === $scope.dimVal) {
        $scope.displayDimError = true;
      } else {
        $scope.displayDimError = false;
        console.log("post", dimobj);
        $http({
          method: 'Post',
          url: '/dimensions/addDimension',
          data: {
            data: dimobj
          }
        }).
        success(function(data, status, headers, config) {
          console.log("Successful");
          console.log(data);
        });
        console.log(dimobj.displayName);
        $scope.dimensionList.push(dimobj.displayName);
      }
    }

    $scope.submitMeasure = function() {
      if($scope.addMeasForm.$invalid)
      {
        console.log("ERROR");
        return;
      }
      measobj = {
        displaymeasurename: $scope.displaymeasurename,
        measureFieldSelector: $scope.measureFieldSelector,
        measure: $scope.measure,
        measField: $scope.measField,
        measValue: $scope.measValue,
        namespaceName :$scope.namespaceName
      }
      if ($scope.displaymeasurename === $scope.measureFieldSelector || $scope.displaymeasurename === $scope.measField) {
        $scope.displayMeasError = true;
      } else {
        $scope.displayMeasError = false;
        console.log("post", measobj);
        $http({
          method: 'Post',
          url: '/measures/addMeasure',
          data: {
            data: measobj
          }
        }).
        success(function(data, status, headers, config) {
          console.log("Successful");
          console.log(data);
        });
        $scope.measureList.push(measobj.displaymeasurename);
      }
    }


    $scope.deleteDimension = function(dim) {
      //console.log("final array ", $scope.dimensionList);
      for (var i = 0; i < $scope.dimensionList.length; i++) {
        if ($scope.dimensionList[i] === dim) {
          deleteDim={
            namespaceName :$scope.namespaceName,
            dimName:dim
          }
          $scope.dimensionList.pop($scope.dimensionList[i]);
        }
      }
      $http({method: 'Post', url: '/dimensions/delete',data:{data:deleteDim}}).
                success(function(data, status, headers, config) {
                console.log("Successful");
                console.log(data);
                  });
    }

    $scope.deleteMeasure = function(measure) {
      for (var i = 0; i < $scope.measureList.length; i++) {
        if ($scope.measureList[i] === measure) {
          deletemeasureList={
            namespaceName :$scope.namespaceName,
            measName:measure
          }
          $scope.measureList.pop($scope.measureList[i]);
        }
      }
      $http({method: 'Post', url: '/measures/delete',data:{data:deletemeasureList}}).
                success(function(data, status, headers, config) {
                console.log("Successful");
                console.log(data);
                  });

    }

    $scope.selectedMeas = function(key, val) {
      if (!key) {
        return;
      }
      $scope.measField = key;
      $scope.measValue = val;
    }

    $scope.createMapFromJSON = function(obj) {
      var newObject = {}
      for(var key in obj) {
        if(typeof obj[key] === 'object') {
          Object.keys(obj[key]).map(function(s) {
            newObject[key+'.'+s] = obj[key][s];
          });
        } else {
          newObject[key] = obj[key];
        }
      }
      return newObject;
    };

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
      $scope.selectedRow = $scope.createMapFromJSON(obj);
    }
    //get namespace streaming
    $scope.getData = function() {
      if($scope.namespaceForm.$invalid)
      {
        console.log("ERROR");
        return;
      }
      $('#myModal').modal('hide');
      namespaceObj = {
        name: $scope.namespace,
        description: $scope.desc,
        createdOn: Date.now(),
        source: $scope.source
      }
      console.log("post", namespaceObj);
      $scope.namespaceName = $scope.namespace;
      $scope.cols = [];
      $scope.logdataList = [];
      $scope.dimensionList = [];
      $scope.measureList = [];
      $scope.displayname = "";
      $scope.dimVal = "";
      $scope.displaymeasurename = "";
      $scope.measField = "";
      $scope.measValue = "";
      $scope.selectedRow = {};
      if ($scope.namespace1 === "radioFile") {
        $scope.logdataList = JSON.parse($scope.content);
        $scope.cols = Object.keys($scope.logdataList[0]);
        console.log("data fro uplaod", $scope.logdataList);
      } else {
        var ws = new WebSocket("ws://172.23.238.253:7070");
        var count = 0;
        ws.onmessage = function(evt) {
          $scope.$apply(function() {
            var received_msg = JSON.parse(evt.data);
            var sourceData = received_msg[0];
            if ($scope.source === sourceData && count < 10) {
              var data = received_msg[2];
              count++;
              $scope.logdataList.push(data);
              console.log("lenght",$scope.cols.length);
              if ($scope.cols.length <= 0) {
                for (var key in data) {
                  $scope.cols.push(key);
                }
              }
            }
            if (count >= 10) {
              ws.close();
              ws.onclose = function() {
                console.log("close");
              }
            }
          });
        };
      }
      $http({
        method: 'Post',
        url: '/logdata',
        data: {
          data: namespaceObj
        }
      }).
      success(function(data, status, headers, config) {
        console.log("Successful");
        console.log(data);
      });
    };
  }
]);
