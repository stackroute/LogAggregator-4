/*Copyright 2016 Wipro Limited, NIIT Limited

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

This code is written by Sridharan M*/

angular.module('logAggregator').controller('profileMain', ['$scope','$rootScope','$http',
function($scope,$rootScope,$http) {
    $scope.usr = $rootScope.current_user;

    $scope.$on('$viewContentLoaded', function() {
        console.log("Calling from profile function");
        var obj ={"username": $scope.usr.username};

        $http({method: 'Post', url: '/getProfile', data:{data:obj}}).
            success(function(data, status, headers, config) {
            console.log("got the user details");
            console.log(data);
            console.log("got the user details");
            console.log(data[0]["firstName"]);
            $scope.username = $scope.usr.username;
            $scope.firstName = data[0]["firstName"];
            $scope.lastName= data[0]["lastName"];
            $scope.organization = data[0]["organization"];
            $scope.homeAddress = data[0]["homeAddress"];
            $scope.phoneno = data[0]["phoneno"];
            $scope.email = data[0]["email"];
            });
    });


}
]);
