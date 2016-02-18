
angular.module('logAggregator').controller('serviceConfigController', ['$scope','$http',
function($scope,$http) {
$scope.gitInfo={};
$scope.nginxInfo={};
$scope.appgitInfo={};
$scope.gitRepos={};
$scope.gitInfo.dbDetails={};
$scope.nginxInfo.dbDetails={};
$scope.appgitInfo.dbDetails={};
$scope.gitInfo.gitauthSets=[];
$scope.gitInfo.repositoryData=[];
  $scope.applyUserName = function(userName){
    $scope.gitInfo.userName=userName;
  $http({
       method: 'GET',
       url: 'https://api.github.com/orgs/'+userName+'/repos',
    }).success(function(data){
       $scope.gitRepos=data;
       $scope.userCorrect=true;
   }).error(function(){
       alert("error");
   });
};

$scope.serviceConfig = function(service){
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
}
  $http.post('/serviceConfig/'+service, data)
            .success(function (data, status, headers, config) {
if(data.status=="success"){

}
            })
            .error(function (data, status, header, config) {
console.log("error");
            });
};
}]);
