angular.module('logAggregator').factory('defineDataService', ['$http',
  function($http) {
    return {
      getDimensionData : function() {
        return  $http({
          method: "get",
           url: "/dimensions"
        });
      },
      getMeasureData : function() {
        return  $http({
          method: "get",
           url: "/measures"
        });
      },
      getLogData : function() {
        return  $http({
          method: "get",
           url: "/logdata"
        });
      }
    }
    // return {
    //   getDimensionData: function(handleSuccess, handleError) {
    //     var request = $http({
    //       method: "get",
    //       url: "/dimensions"
    //     });
    //     request.then(function(data) {
    //       //console.log('DDDATA: ' + JSON.stringify(data));
    //       handleSuccess(data);
    //     }, function(data) {
    //       handleError(data);
    //     });
    //   },
    //   getMeasureData: function(handleSuccess, handleError) {
    //     var request = $http({
    //       method: "get",
    //       url: "/measures"
    //     });
    //     request.then(function(data) {
    //       handleSuccess(data);
    //     }, function(data) {
    //       handleError(data);
    //     });
    //   }
    // }
  }
]);
