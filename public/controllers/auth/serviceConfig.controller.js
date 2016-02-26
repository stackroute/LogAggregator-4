
angular.module('logAggregator').controller('serviceConfigController', ['$scope','$http', '$state','$location','$window',
function($scope,$http,$state,$location,$window) {
  resetData();
  $scope.serviceTabs=['Git Tab','Nginx Tab','Appgit Tab'];
  $state.go('serviceConfig.gittab');
  $scope.activeTab = "gittab";
  $scope.applyUserName = function(userName,f){
    if(!userName){
      return;
    }
    if(f){
      $scope.disable=true;
    }
    $scope.showLogProgress=true;
    $scope.gitInfo.userName=userName;
    $http({
      method: 'GET',
      url: 'https://api.github.com/orgs/'+userName+'/repos',
    }).success(function(data){
      $scope.gitRepos=data;
      $scope.userCorrect=true;
      $scope.showLogProgress=false;
    }).error(function(){
      $scope.fail=true;
      console.log("error");
      $scope.showLogProgress=false;
    });
  };

  $scope.serviceConfigGitRepos = function(){
    $scope.gitInfo.accountData={};
    $scope.gitInfo.accountData.repos=[];
      $scope.gitInfo.accountData.gitAccountname=$scope.gitInfo.userName;
      for (var i = 0; i < $scope.gitRepos.length; i++) {
        if($scope.gitRepos[i].selected){
          $scope.gitInfo.accountData.repos.push({
            repo : $scope.gitRepos[i].full_name,
            gitRepoId: $scope.gitRepos[i].id
          });
        }
      }
    $http.post('/serviceConfig/git/repos', $scope.gitInfo.accountData)
    .success(function (data, status, headers, config) {
      console.log(data.state,headers,status,config);
      if(data.state=="success"){
        resetData();
        $scope.passMessage="Git account configured successfully!!";
        $scope.pass=true;
        $location.path('serviceConfig/gittab');
      }
      else{
        $scope.failMessage="Failed to configure Git account!!";
        $scope.fail=true;
      }
    })
    .error(function () {
      $scope.failMessage="Failed to configure Git account!!";
      $scope.fail=true;
      console.log("error");
    });
  }

$scope.deleteRepo = function(repoName){
  if($window.confirm("Are you want to delete the Repo?")){
    $http.post('/serviceConfig/git/deleteRepo', {gitAccountname:repoName})
    .success(function (data, status, headers, config) {
      console.log(data.state,headers,status,config);
      if(data.state=="success"){
        $scope.passMessage="Git account deleted successfully!!";
        $scope.pass=true;
        $scope.getServiceConfig("gittab");
        $location.path('serviceConfig/gittab');
      }
      else{
        $scope.failMessage="Failed to delete Git account!!";
        $scope.fail=true;
      }
    })
    .error(function () {
      $scope.failMessage="Failed to delete Git account!!";
      $scope.fail=true;
      console.log("error");
    });
  }
};

$scope.serviceConfigGitDB = function(){
  $http.post('/serviceConfig/git/DB', $scope.gitInfo.dbDetails)
  .success(function (data, status, headers, config) {
    console.log(data.state,headers,status,config);
    if(data.state=="success"){
      resetData();
      $scope.passMessage="Git database configured successfully!!";
      $scope.pass=true;
      $location.path('serviceConfig/gittab');
    }
    else{
      $scope.failMessage="Failed to configure Git database!!";
      $scope.fail=true;
    }
  })
  .error(function () {
    $scope.failMessage="Failed to configure Git database!!";
    $scope.fail=true;
    console.log("error");
  });
}

$scope.serviceConfigGitAuthO = function(){
  $http.post('/serviceConfig/git/authO',
  {gitHost:$scope.gitInfo.gitHost,gitauthSets:$scope.gitInfo.gitauthSets})
  .success(function (data, status, headers, config) {
    console.log(data.state,headers,status,config);
    if(data.state=="success"){
      resetData();
      $scope.passMessage="Git authO configured successfully";
      $scope.pass=true;
      $scope.getServiceConfig("gittab");
      $location.path('serviceConfig/gittab');
    }
    else{
      $scope.failMessage="Failed to configure Git authO!!";
      $scope.fail=true;
    }
  })
  .error(function () {
    $scope.failMessage="Failed to configure Git authO!!";
    $scope.fail=true;
    console.log("error");
  });
}

  $scope.serviceConfig = function(service){
    var data;
    if(service=="nginx"){
      data=$scope.nginxInfo;
    }
    else if(service=="appgit"){
      data=$scope.appgitInfo;
    }
    $http.post('/serviceConfig/'+service, data)
    .success(function (data, status, headers, config) {
      console.log(data.state,headers,status,config);
      if(data.state=="success"){
        resetData();
        $scope.passMessage="DB configured successfully";
        $scope.pass=true;
        $location.path('serviceConfig/'+service+'tab');
      }
      else{
        $scope.failMessage="Failed to configure DB";
        $scope.fail=true;
      }
    })
    .error(function (data, status, header, config) {
      $scope.failMessage="Failed to configure DB";
      $scope.fail=true;
      console.log("error");
    });
  };

  function resetData(){
    $scope.gitInfo={};
    $scope.nginxInfo={};
    $scope.appgitInfo={};
    $scope.gitRepos={};
    $scope.gitInfo.dbDetails={};
    $scope.nginxInfo.dbDetails={};
    $scope.appgitInfo.dbDetails={};
    $scope.gitInfo.gitauthSets=[];
    $scope.gitInfo.repositoryData={};
    $scope.gitInfo.accountData={};
    $scope.gitInfo.accountData.repos=[];
    $scope.gitInfo.repositoryData.repos=[];
    $scope.showLogProgress=false;
    $scope.userCorrect=false;
    $scope.gitInfo.userName="";
    $scope.fail=false;
    $scope.pass=false;
    $scope.disable=false;
  }

$scope.reset=resetData;
  $scope.setActiveClass = function(tab) {
    console.log(tab,"tab");
    $scope.activeTab = angular.lowercase(tab.split(" ").join(''));
    console.log($scope.activeTab,"active tab");
    resetData();
  }
$scope.getServiceConfig = function(tab){
  var service;
  if(tab=="appgittab"){
    service="appgit";
  }
  else if(tab=="nginxtab"){
    service="nginx";
  }
  else if(tab=="gittab"){
    service="git";
  }
  $http.get('/serviceConfig/json/'+service)
  .success(function (res) {
    console.log(res);
    if(res.state=="success"){
      console.log(res.data);
      if($scope.activeTab=="appgittab"){
        $scope.appgitInfo=res.data;
      }
      else if($scope.activeTab=="nginxtab"){
        $scope.nginxInfo=res.data;
      }
      else if($scope.activeTab=="gittab"){
        $scope.gitInfo=res.data;
      }
    }
    else{
      resetData();
    }
  })
  .error(function (data) {
    console.log("error");
  });
}
}]);
