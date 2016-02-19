var app = angular.module('logAggregator');

app.controller('myController', function($scope, $http) {
    $scope.toggle_list = function(){
      $('.left-nav-div').slideToggle();
    }

    var obj={};

    var json_param1 ={                                                           //RT-U
                      "primaryGroupByField" : "repo",
                      "secondaryGroupByField": {"name":"commitYear","values":[2014,2015,2016,2017]},
                      "aggregator": {
                        "function": "top",
                        "argument": 5
                      },
                      "filters": [
                          {"name":"committer.name", "values":["abhinavtdgp","Arul","Brian White","Rich Trott","Roman Reiss"]}
                        ]
    }

    var json_param2 ={                                             //RU-T
      "primaryGroupByField" : "repo",
      "secondaryGroupByField": {"name":"committer.name","values":["abhinavtdgp","Arul","Brian White","Rich Trott","Roman Reiss"]},
      "aggregator": {
        "function": "top",
        "argument": 5
      },
      "filters": [
        {"name":"commitYear", "values":[2015,2016]},
        {"name":"commitMonth", "values":[0,1,2,3,4,5,6,7,8,9,10,11]}
        ]
    }

    var json_param3={                                              //TR-U
      "primaryGroupByField" : "commitYear",
      "secondaryGroupByField": {"name":"repo","values":["node","LogAggregator-Git"]},
      "aggregator": {
        "function": "top",
        "argument": 5
      },
      "filters": [
          {"name":"committer.name", "values":["abhinavtdgp","Arul","Brian White","Rich Trott","Roman Reiss"]}
        ]
    }

    var json_param4={                                              //TU-R
      "primaryGroupByField" : "commitYear",
      "secondaryGroupByField":{"name":"committer.name", "values":["abhinavtdgp","Arul","Brian White","Rich Trott","Roman Reiss"]} ,
      "aggregator": {
        "function": "top",
        "argument": 5
      },
      "filters": [
        {"name":"repo","values":["node","LogAggregator-Git"]}

        ]
    }

    var json_param5={                                            //UT-R
      "primaryGroupByField" : "committer.name",
      "secondaryGroupByField":{"name":"commitYear","values":[2014,2015,2016]},
      "aggregator": {
        "function": "top",
        "argument": 5
      },
      "filters": [
        {"name":"repo","values":["node","LogAggregator-Git"]}

        ]
    }
    //////type of json that is used to plot the stacked bar graph

    var json_param6={                                              //T-RU
      "primaryGroupByField" : "commitYear",
      "secondaryGroupByField":"",
      "aggregator": {
        "function": "top",
        "argument": 5
      },
      "filters": [
        {"name":"repo","values":["node","LogAggregator-Git"]},
        {"name":"committer.name","values":["abhinavtdgp","Arul","Brian White","Rich Trott","Roman Reiss"]}
        ]
    }

    var json_param7={                                              //R-TU
      "primaryGroupByField" : "repo",
      "secondaryGroupByField":"",
      "aggregator": {
        "function": "top",
        "argument": 5
      },
      "filters": [
        {"name":"commitYear","values":[2014,2015,2016]},
        {"name":"commitMonth","values":[0,1,2,3,4,5,6,7,8,9,10,11]},
        {"name":"committer.name","values":["abhinavtdgp","Arul","Brian White","Rich Trott","Roman Reiss"]}
        ]
    }

    var json_param8={                                              //U-TR
      "primaryGroupByField" : "committer.name",
      "secondaryGroupByField":"",
      "aggregator": {
        "function": "top",
        "argument": 5
      },
      "filters": [
        {"name":"commitYear","values":[2014,2015,2016]},
        {"name":"commitMonth","values":[0,1,2,3,4,5,6,7,8,9,10,11]},
        {"name":"repo","values":["node","LogAggregator-Git"]}
        ]
    }




    $scope.plot_graph = function(){
      $('#my_modal1').modal('show');
      console.log("we are in plot_top_repos function");
      console.log($scope.selectedRepoDataDisplay);
      console.log($scope.selectedUserDataDisplay);
      console.log(event.target.getAttribute('data-json'));
      data_json = event.target.getAttribute('data-json');
      if(data_json=="json_param1"){
        obj=json_param1;
      }
      else if(data_json=="json_param2"){
        obj=json_param2;
      }
      else if(data_json=="json_param3"){
        obj=json_param3;
      }
      else if(data_json=="json_param4"){
        obj=json_param4;
      }else if(data_json=="json_param5"){
        obj=json_param5;
      }else if(data_json=="json_param6"){
        obj=json_param6;
      }else if(data_json=="json_param7"){
        obj=json_param7;
      }else if(data_json=="json_param8"){
        obj=json_param8;
      }
      else{
        console.log("No matched data found");
      }
      console.log(obj);
      $('#box1').hide();
      $('#box2').hide();
      $('#box3').hide();
      $('#box4').hide();
      for(var j=0;j<obj["filters"].length;j++)
      {
        if(obj["filters"][j]["name"]=="commitMonth"){
          $('#box1').show();
        }
        if(obj["filters"][j]["name"]=="commitYear"){
          $('#box2').show();
        }if(obj["filters"][j]["name"]=="repo"){
          $('#box3').show();
        }if(obj["filters"][j]["name"]=="committer.name"){
          $('#box4').show();
        }
      }
      console.log(obj);
      plotthedata(obj);
    }


    $scope.plotthedata = function() {
        $('#my_modal1').modal('hide');
        console.log("we are in plot the data function");

        for(var i=0;j<obj["filters"].length;j++)
        {
          obj["filters"][i]["values"]=[];
        }
        for(var j=0;j<obj["filters"].length;j++)
        {
          if(obj["filters"][j]["name"]=="commitMonth"){
            for(var m=0;m < $scope.selectedMonthDataDisplay.length;m++){
              obj["filters"][j]["values"][m]=parseInt($scope.selectedMonthDataDisplay[m]);
            }
          }
          if(obj["filters"][j]["name"]=="commitYear"){
            console.log("selected data length");
            for(var m=0;m < $scope.selectedYearDataDisplay.length;m++){
              obj["filters"][j]["values"][m]=parseInt($scope.selectedYearDataDisplay[m]);
            }
          }if(obj["filters"][j]["name"]=="repo"){
            obj["filters"][j]["values"]=$scope.selectedRepoDataDisplay;
          }if(obj["filters"][j]["name"]=="committer.name"){
            obj["filters"][j]["values"]=$scope.selectedUserDataDisplay;
          }
        }
        //$('#my_modal1').modal('show');
        console.log(obj);

            $http({method: 'Post', url: '/plotgraph', data:{data:obj}}).
                success(function(data, status, headers, config) {
                      console.log(data);
                      if(obj["secondaryGroupByField"]!==""){
                        console.log(obj["secondaryGroupByField"]["values"]);
                        plotting_stacked_graph(data,obj["secondaryGroupByField"]["values"]);
                      }
                      else{
                        plotting_graph(data);
                      }
                });
    }

    $scope.$on('$viewContentLoaded', function() {
        console.log("we are in the fetching function calling function");
        //console.log(obj);

        $scope.fetchedMonthDataDisplay=[0,1,2,3,4,5,6,7,8,9,10,11];
        //$scope.selected_json_param = event.target.getAttribute('data-json');
            $http({method: 'Post', url: '/getFilterData', data:{data:{"filterby":"repo"}}}).
                success(function(data, status, headers, config) {
                      //console.log(data);
                      var display_data=[];
                      for(var i=0; i<data.length;i++){
                        display_data[i]=data[i]["_id"];
                      }
                      $scope.fetchedRepoDataDisplay=display_data;
                      console.log($scope.fetchedRepoDataDisplay);

                });
                $http({method: 'Post', url: '/getFilterData', data:{data:{"filterby":"committer.name"}}}).
                    success(function(data, status, headers, config) {
                          //console.log(data);
                          var display_data=[];
                          for(var i=0; i<data.length;i++){
                            display_data[i]=data[i]["_id"];
                          }
                          $scope.fetchedUserDataDisplay=display_data;
                          console.log($scope.fetchedUserDataDisplay);
                          //$('#my_modal1').modal('show');

                    });
                    $http({method: 'Post', url: '/getFilterData', data:{data:{"filterby":"commitYear"}}}).
                        success(function(data, status, headers, config) {
                              //console.log(data);
                              var display_data=[];
                              for(var i=0; i<data.length;i++){
                                display_data[i]=data[i]["_id"];
                              }
                              $scope.fetchedYearDataDisplay=display_data;
                              console.log($scope.fetchedYearDataDisplay);


                        });
    });

    // $scope.fetchfilteringdata = function() {
    //     console.log("we are in the fetching function calling function");
    //     //console.log(obj);
    //
    //     $scope.fetchedMonthDataDisplay=[0,1,2,3,4,5,6,7,8,9,10,11];
    //     $scope.selected_json_param = event.target.getAttribute('data-json');
    //         $http({method: 'Post', url: '/getFilterData', data:{data:{"filterby":"repo"}}}).
    //             success(function(data, status, headers, config) {
    //                   //console.log(data);
    //                   var display_data=[];
    //                   for(var i=0; i<data.length;i++){
    //                     display_data[i]=data[i]["_id"];
    //                   }
    //                   $scope.fetchedRepoDataDisplay=display_data;
    //                   console.log($scope.fetchedRepoDataDisplay);
    //
    //             });
    //             $http({method: 'Post', url: '/getFilterData', data:{data:{"filterby":"committer.name"}}}).
    //                 success(function(data, status, headers, config) {
    //                       //console.log(data);
    //                       var display_data=[];
    //                       for(var i=0; i<data.length;i++){
    //                         display_data[i]=data[i]["_id"];
    //                       }
    //                       $scope.fetchedUserDataDisplay=display_data;
    //                       console.log($scope.fetchedUserDataDisplay);
    //                       //$('#my_modal1').modal('show');
    //
    //                 });
    //                 $http({method: 'Post', url: '/getFilterData', data:{data:{"filterby":"commitYear"}}}).
    //                     success(function(data, status, headers, config) {
    //                           //console.log(data);
    //                           var display_data=[];
    //                           for(var i=0; i<data.length;i++){
    //                             display_data[i]=data[i]["_id"];
    //                           }
    //                           $scope.fetchedYearDataDisplay=display_data;
    //                           console.log($scope.fetchedYearDataDisplay);
    //
    //
    //                     });
    // }
    $scope.add_repo= function(){
      console.log("we are in add_repo function");
      $scope.selectedRepoDataDisplay = $scope.value;
    }
    $scope.add_user= function(){
      console.log("we are in add_user function");
      $scope.selectedUserDataDisplay = $scope.value2;
    }
    $scope.add_year= function(){
      console.log("we are in add_year function");
      $scope.selectedYearDataDisplay = $scope.value7;
    }
    $scope.add_month= function(){
      console.log("we are in add_month function");
      $scope.selectedMonthDataDisplay = $scope.value5;
    }
  });



function show_the_modal(){
  $('#my_modal1').modal('show');
}
