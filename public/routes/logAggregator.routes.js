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

angular.module('logAggregator').config(function($stateProvider, $urlRouterProvider){
  $urlRouterProvider.otherwise('/login');
  $stateProvider
  .state('login',{
    url: '/login',
    templateUrl : 'views/auth/auth.view.html',
    controller : 'authController'
  })
  .state('serviceConfig',{
    url: '/serviceConfig',
    templateUrl : 'views/auth/serviceConfig.view.html',
    controller : 'serviceConfigController'
  })
  .state('serviceConfig.gittab',{
    url: '/gittab',
    templateUrl : 'views/auth/gitServiceConfig.html'
  })
  .state('serviceConfig.gittabedit',{
    url: '/gittabedit',
    templateUrl : 'views/auth/gitServiceConfigEdit.html'
  })
  .state('serviceConfig.gittabdbedit',{
    url: '/gittabdbedit',
    templateUrl : 'views/auth/gitServiceConfigDbEdit.html'
  })
  .state('serviceConfig.gittabAuthOedit',{
    url: '/gittabAuthOedit',
    templateUrl : 'views/auth/gitServiceConfigAuthOEdit.html'
  })
  .state('serviceConfig.nginxtab',{
    url: '/nginxtab',
    templateUrl : 'views/auth/nginxServiceConfig.html'
  })
  .state('serviceConfig.nginxtabedit',{
    url: '/nginxtabedit',
    templateUrl : 'views/auth/nginxServiceConfigEdit.html'
  })
  .state('serviceConfig.appgittab',{
    url: '/appgittab',
    templateUrl : 'views/auth/appgitServiceConfig.html'
  })
  .state('serviceConfig.appgittabedit',{
    url: '/appgittabedit',
    templateUrl : 'views/auth/appgitServiceConfigEdit.html'
  })
  .state('changePassword',{
    url: '/changePassword',
    templateUrl : 'views/auth/changePassword.view.html',
    controller : 'changePasswordController'
  })
  .state('aboutus',{
    url: '/aboutus',
    templateUrl : 'views/auth/aboutus.view.html',
    controller: 'aboutusController'
  })
  .state('errorhandler',{
    url: '/errorhandler',
    templateUrl : 'views/auth/error.view.html',
    controller : 'errorHandlerController'
  })
  .state('NginxLogStatistics',{
    url: '/NginxLogStatistics',
    templateUrl: 'views/nginx/NginxLogStatisticsTabs/NginxLogStatisticsTabs.html',
    controller : 'NginxLogStatisticsController'
  })
  .state('GitLogStatistics',{
    url: '/GitLogStatistics',
    templateUrl: 'views/gitLog/mainPage/mainPage.view.html',
    controller : 'myController'
  })
  .state('dashboardWizard',{
    url: '/dashboardWizard',
    templateUrl: 'views/gitLog/dashboardWizard/dashboardWizard.html',
    controller : 'wizardController'
  })
  .state('profile',{
    url: '/profile',
    templateUrl: 'views/gitLog/profile/profile.view.html',
    controller : 'profileMain'
  })
  .state('profileEdit',{
    url: '/profileEdit',
    templateUrl: 'views/gitLog/profileEdit/profileEdit.view.html',
    controller : 'profileEdit'
  })
  .state('NginxLogStatistics.useragent',{
    url: '/useragent',
    templateUrl : 'views/nginx/userAgent/userAgent.view.html',
    controller : 'userAgentController'
  })
  .state('NginxLogStatistics.loglisting',{
    url: '/loglisting',
    templateUrl : 'views/nginx/logListing/logListing.view.html',
    controller : 'logController'
  })
  .state('NginxLogStatistics.trafficrate',{
    url: '/trafficrate',
    templateUrl : 'views/nginx/trafficRate/trafficRate.view.html',
    controller : 'trafficRateController'
  })
  .state('AptLogStatistics',{
    url: '/AptLogStatistics',
    templateUrl: 'views/aptCache/AptLogStatisticsTabs/AptLogStatisticsTabs.html',
    controller : 'AptLogStatisticsController'
  })
  .state('AptLogStatistics.requestrate',{
    url: '/requestrate',
    templateUrl : 'views/aptCache/logRate/allLogs.html',
    controller: 'logRateController'
  })
  .state('AptLogStatistics.packageanalytics',{
    url: '/packageanalytics',
    templateUrl : 'views/aptCache/packageAnalytics/packageAnalytics.html',
    controller: 'packageAnalyticsController'
  })
  .state('AptLogStatistics.datarate',{
    url: '/datarate',
    templateUrl : 'views/aptCache/dataRate/allData.html',
    controller: 'dataRateController'
  })
  .state('AptLogStatistics.packagerepository',{
    url: '/packagerepository',
    templateUrl : 'views/aptCache/packageRepository/packageRepository.html',
    controller: 'repositoryController'
  })
  .state('AptLogStatistics.packagecount',{
    url: '/packagecount',
    templateUrl : 'views/aptCache/packageCount/packageCount.html',
    controller: 'packageCountController'
  })
  .state('defineData',{
    url: '/defineData',
    templateUrl : 'views/realTimeLogs/defineData/defineData.html',
    controller: 'defineDataController'
  });
});
