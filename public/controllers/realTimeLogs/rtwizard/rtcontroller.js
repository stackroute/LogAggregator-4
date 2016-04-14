var app = angular.module('logAggregator');
  app.controller('rtcontroller', function($scope, $http) {
    $http.get('todos.json')
         .then(function(res){
            $scope.todos = res.data;
          });
  });

// angular.module('',[]);
// var ws  = new Websocket("ws://172.23.238.253:9090");
// ws.onopen = function(){
//
// };
//
// function listener(data){
//   var msgobject = data;
// }
