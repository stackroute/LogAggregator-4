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

angular.module('logAggregator').controller('profileEdit', ['$scope','$rootScope','$http',
function($scope,$rootScope,$http) {
$scope.usr = $rootScope.current_user;

$scope.editProfile =  function() {
    console.log("Calling from profile function");
    //var obj ={"username": $scope.usr.username};
    $scope.submitted = true;
    var obj = {};
    obj["username"]=$rootScope.current_user;
    obj["data_set"]={};
    if($scope.firstName !== undefined && $scope.firstName!== "")
    {
      obj["data_set"]["firstName"] = $scope.firstName;
    }
    if($scope.lastName !== undefined && $scope.lastName !== "")
    {
      obj["data_set"]["lastName"] = $scope.lastName;
    }
    if($scope.organization !== undefined && $scope.organization !== "")
    {
      obj["data_set"]["organization"] = $scope.organization;
    }
    if($scope.homeAddress !== undefined && $scope.homeAddress !== "")
    {
      obj["data_set"]["homeAddress"] = $scope.homeAddress;
    }
    if($scope.phoneno !== undefined && $scope.phoneno !== "")
    {
      obj["data_set"]["phoneno"] = $scope.phoneno;
    }
    console.log(obj);

    $http({method: 'Post', url: '/getProfile/edit', data:{data:obj}}).
        success(function(data, status, headers, config) {
        console.log(data);
        });
    }
  }
]);
