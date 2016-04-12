var app = angular.module('logAggregator');
  app.controller('rtcontroller', function($scope, $http) {
    $http.get('todos.json')
         .then(function(res){
            $scope.todos = res.data;
          });
  });
