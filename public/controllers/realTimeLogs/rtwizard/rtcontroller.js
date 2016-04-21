// var app = angular.module('logAggregator');
//   app.controller('rtcontroller', function($scope, $http) {
//     $http.get('todos.json')
//          .then(function(res){
//             $scope.todos = res.data;
//           });
//   });

var app = angular.module('logAggregator');

app.controller('rtcontroller', function($scope) {
    // app.controller('myController',function($scope){
    $scope.key = [];
    $scope.val = [];
    var ws = new WebSocket("ws://172.23.238.253:7070");
    var isFirstMessage = true;

    ws.onmessage = function(evt) {

        $scope.$apply(function() {
            var received_msg = JSON.parse(evt.data);
            var data = received_msg[2];

            if (isFirstMessage) {

                for (var key in data) {
                    $scope.key.push(key);
                }

                isFirstMessage = false;

            } // if(isFirstMessage) end

            $scope.val.push(data);

        }); //$scope.apply end

    }; //ws.onmessage end

}); //app.controller end
