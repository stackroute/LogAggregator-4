angular.module('logAggregator').factory('defineDataService', ['$http',
  function($http) {
    return {
      getDimensionData: function() {
        return $http({
          method: "get",
          url: "/dimensions"
        });
      },
      getMeasureData: function() {
        return $http({
          method: "get",
          url: "/measures"
        });
      },
      getLogData: function() {
        return $http({
          method: "get",
          url: "/logdata"
        });
      }
    }
  }
]);
