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

This code is written by Prateek Reddy Yammanuru, Shiva Manognya Kandikuppa, Uday Kumar Mydam, Nirup TNL, Sandeep Reddy G, Deepak Kumar
 and updated by Ashish Gupta, Tarun Mohandas, Suriya Prakash, Srinivasa Burli, Jishnu Surendran and Bhairavi Balakrishnan*/

angular.module('logAggregator').controller('authController', ['$scope','$cookies' ,'$http','$rootScope','$location','$window',
'loadConfig',function($scope,$cookies, $http, $rootScope, $location,$window,loadConfig) {
  var EMAIL_REGEXP = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
  var check = false;
  $scope.error_message = '';
  $scope.checkData="";
  if($cookies.get('login')==='true'){
    $location.path('/NginxLogStatistics');
  }

  var result=document.getElementsByClassName('homepage');
  angular.element(result).css('display','none');

  $scope.login = function(username,password){
    $scope.user={
      username:username,
      password:password
    };
    $http.post('/auth/login', $scope.user).then(function(response){
      if(response.data.state == 'success'){
        $rootScope.authenticated = true;
        $rootScope.loginMessage="";
        $window.localStorage["userInfo"] = JSON.stringify(response.data.user);
        $rootScope.current_user = JSON.parse($window.localStorage["userInfo"]);
        // $rootScope.current_user = response.data.user.username;
        // $rootScope.tab = "logListing";
        var result=document.getElementsByClassName('homepage');
        angular.element(result).css('display','block');
        $cookies.put('login','true');
        $scope.$parent.clicked="";
        loadConfig.getdata( function(data) {
          $scope.config = data;
          console.log(data);
          $window.localStorage['config']=$scope.config;
          $rootScope.config = $window.localStorage['config'];
          $window.location.reload();
        });
        $location.path('/aboutus');
      }
      else{
        $scope.error_message = response.data.message;
        $rootScope.loginMessage="Invalid username or password";
      }
    });
  };
  $scope.register = function(){


    if (!$scope.firstName || !$scope.lastName || !$scope.username || !$scope.email || !$scope.password || !$scope.confirmPassword || !$scope.organization){
      $scope.checkData = "*Please fill all the fields";
    }

    if ($scope.password && (""+$scope.password.length)<6){
      $scope.checkData = "Password should be of minimum 6 characters";
    }

    if($scope.email){
      var isMatchRegex = EMAIL_REGEXP.test($scope.email);
      if(isMatchRegex === false){
        $scope.checkData="Invalid email id";
      }
      else{
        check = true;
        $scope.userDetails={
          firstName:$scope.firstName,
          lastName:$scope.lastName,
          username:$scope.username,
          email:$scope.email,
          password:$scope.password,
          organization:$scope.organization
        };
      }
    }

    if(check===true) {
      console.log("fhnnnhnbhn");
      if ($scope.password && $scope.confirmPassword && $scope.password===$scope.confirmPassword){
        $http.post('/auth/signup', $scope.userDetails).success(function(response){
          console.log(response.user+"---------");
          if(response.state === 'success'){
            $rootScope.authenticated = true;
            $rootScope.loginMessage="";
            $window.localStorage["userInfo"] = JSON.stringify(response.user);
            $rootScope.current_user = JSON.parse($window.localStorage["userInfo"]);
            $scope.checkData="";
            var result=document.getElementsByClassName('homepage');
            angular.element(result).css('display','block');
            console.log("ncgfghfgh");
            $cookies.put('login','true');
            $location.path('/serviceConfig');
          }
          else{
            $scope.error_message = data.message;
          }
        });
      }
      else if ($scope.password && $scope.confirmPassword && $scope.password !== $scope.confirmPassword){
        $scope.checkData="Password didn't match";

      }
    }

  };

}]);
