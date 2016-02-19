
angular.module('logAggregator').controller('serviceConfigController', ['$scope','$http',
function($scope,$http) {
  resetData();
  $scope.serviceTabs=['Git Tab','Nginx Tab','Appgit Tab'];
  $scope.applyUserName = function(userName){
    if(!userName){
      return;
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
      console.log("tttttttttttttttrrrrr");
      $scope.showLogProgress=false;
    });
  };

  $scope.serviceConfig = function(service){
    console.log("called");
    var data;
    if(service=="git"){
      for (var i = 0; i < $scope.gitRepos.length; i++) {
        if($scope.gitRepos[i].selected){
          $scope.gitInfo.repositoryData.push({
            gitUserName : $scope.gitInfo.userName,
            repo : $scope.gitRepos[i].full_name,
            gitRepoId: $scope.gitRepos[i].id
          });
        }
        data=$scope.gitInfo;
      }
    }
    else if(service=="nginx"){
      data=$scope.nginxInfo;
    }
    else if(service=="appgit"){
      data=$scope.appgitInfo;
      console.log(data);
    }
    console.log("enterrrrrrrrrrr");
    $http.post('/serviceConfig/'+service, data)
    .success(function (data, status, headers, config) {
      console.log(data.state,headers,status,config);
      if(data.state=="success"){
resetData();
$scope.passMessage="DB configured successfully";
$scope.pass=true;
console.log("success");
      }
      else{
      resetData();
      $scope.failMessage="Failed to configure DB";
      $scope.fail=true;
    }
    })
    .error(function (data, status, header, config) {
      resetData();
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
$scope.gitInfo.repositoryData=[];
$scope.showLogProgress=false;
$scope.userCorrect=false;
$scope.userName="";
$scope.fail=false;
$scope.pass=false;
}
  $scope.setActiveClass = function(tab) {
    $scope.activeTab = angular.lowercase(tab.split(" ").join(''));
    resetData();
  }

}]);
