var app = angular.module('logAggregator');
var dashBoardJson = [];
var obj={};
app.controller('myController', function($scope, $http) {
    $scope.toggle_graph = function(){
      if($('#graph').attr("class")=='hidden'){
        $('#graph').removeClass('hidden');
        $('#graph1').addClass('hidden');
      }
      else{
        $('#graph').addClass('hidden');
        $('#graph1').removeClass('hidden');
      }

    }
    //function to adjust the display of filters on the modal window
    $scope.plot_graph = function(){
    $scope.open_model();
    // console.log("we are in plot_top_repos function");
    // console.log($scope.selectedRepoDataDisplay);
    // console.log($scope.selectedUserDataDisplay);
    // $scope.clear_repo();
    // $scope.clear_user();
    // $scope.clear_year();
    // $scope.clear_month();
    console.log(event.target.getAttribute('data-json'));
    data_json = event.target.getAttribute('data-json');
    console.log("From plot graph function",dashBoardJson);
    for(var m=0;m<dashBoardJson.length;m++){
      if(data_json == dashBoardJson[m]["name"])
      {
        obj = dashBoardJson[m];
        break;
      }
    }

    for(var i=0;i<$scope.filtered_data.length;i++){
      var ids= '#'+$scope.filtered_data[i]["name"].replace('.','')+"div";
      console.log("filtered_datai",ids);
      $(ids).hide();
    };

    for(var j=0;j<obj["filters"].length;j++)
    {
      for(var i=0;i<$scope.filtered_data.length;i++){
        console.log(obj["filters"][j]["name"]);
        console.log($scope.filtered_data[i]["name"]);
        console.log("bool",obj["filters"][j]["name"]===$scope.filtered_data[i]["name"]);
        if(obj["filters"][j]["name"]===$scope.filtered_data[i]["name"])
        {
          var ids= '#'+$scope.filtered_data[i]["name"].replace('.','')+"div";
          console.log("filtered_datai",ids);
          $(ids).show();
        }
        // else{
        //   var ids= '#'+$scope.filtered_data[i]["name"].replace('.','')+"div";
        //   console.log("filtered_datai",ids);
        //   $(ids).hide();
        // }
      }
    }
    console.log("global_data",obj);

  }
  //end of the function

  //inserts the selected filter data into the obj filter section
        $scope.plotthedata= function() {
        $scope.close_model();

        console.log("we are in plot the data function",obj);

        // for(var i=0;j<obj["filters"].length;j++)
        // {
        //
        // }
        for(var j=0;j<obj["filters"].length;j++)
        {
          obj["filters"][j]["values"]=[];
          console.log("transformed_obj",obj);
            for(var i=0;i<$scope.filtered_data.length;i++)
            {
              if(obj["filters"][j]["name"]==$scope.filtered_data[i]["name"])
              {
               var ids= '#'+$scope.filtered_data[i]["name"].replace('.','')+'selected > option';
               console.log("selectedIDS",ids);
               $(ids).each(function(){
                 var $this = $(this);
                 obj["filters"][j]["values"].push($this.text());
               });
            }
          }
        }
        //$('#my_modal1').modal('show');
        console.log(obj);
        getgitdata(obj);
    }
    //end of the function

    //function to fetch the data from the git database and call the plotting graph function
    function getgitdata(obj){
      $scope.graph_type_details=obj["graph-type"];
      console.log("we are in getgit data function");
      console.log("getgitdata",obj);

          $http({method: 'Post', url: '/plotgraph', data:{data:obj}}).
              success(function(data, status, headers, config) {
                    console.log("plotgraph",data);
                    if(obj["columns"]!==undefined){
                      console.log(obj["columns"][0]["values"]);
                      plotting_stacked_graph(data,obj);
                      plot_multibar_graph(data,obj);
                    }
                    else{
                      console.log("calling the plotting graph function");
                      plotting_graph(data,obj);
                      plot_pie_chart(data,obj)
                    }
              });
    }
    //end of the function

    //all the inner content will be executed while loading the page
    $scope.$on('$viewContentLoaded', function() {
        console.log("we are in the fetching function calling function");

        //$scope.fetchedMonthDataDisplay=[0,1,2,3,4,5,6,7,8,9,10,11];  //adding values to the months filter

        $http({method: 'Post', url: '/newfilter'}).
           success(function(data, status, headers, config) {
              //console.log("we are in git filterdata1");

              //console.log(data["dimensions"][0]["displayName"]);
              $scope.filtered_data=data["dimensions"];
              console.log("getFilterData1",$scope.filtered_data);
              });

              $http({method: 'Post', url: '/getDashBoardJson'}).
                  success(function(data, status, headers, config) {
                                //console.log(data);
                  console.log("form getDashBoardJson");
                                  //console.log(data);
                  dashBoardJson = data;
                  var multidimensional = [];
                  var singledimensional =[];
                  console.log("DashBorad",dashBoardJson);
                  console.log(dashBoardJson.length);
                  for(var i=0,j=0,k=0;i<dashBoardJson.length;i++){
                      if(dashBoardJson[i]["columns"]!==undefined){
                          multidimensional[j]=dashBoardJson[i]["name"];
                          j++;
                     }else{
                          singledimensional[k]=dashBoardJson[i]["name"];
                          }
                          }
                          $scope.multigraphdashboard=multidimensional;
                          $scope.singlegraphdashboard = singledimensional;
                          console.log("multidimension",$scope.multigraphdashboard);
                    });
                    $http({method: 'Post', url: '/onPageLoadDashBoard'}).
                        success(function(data, status, headers, config) {
                                //console.log(data);
                        console.log("form onPageLoadDashBoard");
                        console.log(data);
                        getgitdata(data[0]);
                      });

    });
    //end og the laoding page function
    // $scope.get_filter = function(){
    //   console.log("we are get filter data");
    //   $http({method: 'Post', url: '/newfilter'}).
    //           success(function(data, status, headers, config) {
    //         console.log("we are in git filterdata1");
    //         console.log("getFilterData1",data);
    //         });
    // }
    $scope.idMaker = function(id){
      return id.replace('.','');
    }
    //functions to select the selected content in different filter option
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
      console.log("this",this.data.name);
      console.log("this",this.data.displayName);
      var origin= '#'+this.data.name.replace('.','');
      var dest='#'+this.data.name.replace('.','')+'selected';
      console.log(origin,dest);
        //$('#commitYear').find(':selected').appendTo('#commit-Year');
        $(origin).find(':selected').appendTo(dest);
    // $('#btnRemove').click(function(){
    //     $('#PairedSelectBox').removeSelected('#MasterSelectBox');
    // });
      $scope.selectedMonthDataDisplay = $scope.value5;
    }
    $scope.clear_repo= function(){
      console.log("we are in add_repo function");
      $scope.selectedRepoDataDisplay = "";
    }
    $scope.clear_user= function(){
      console.log("we are in add_user function");
      $scope.selectedUserDataDisplay = "";
    }
    $scope.clear_year= function(){
      console.log("we are in add_year function");
      $scope.selectedYearDataDisplay = "";
    }
    $scope.clear_month= function(){
      console.log("we are in add_month function");
      var dest= '#'+this.data.name.replace('.','');
      var origin='#'+this.data.name.replace('.','')+'selected';
      console.log(origin,dest);
        //$('#commitYear').find(':selected').appendTo('#commit-Year');
        $(origin).find(':selected').appendTo(dest);
    }
    $scope.close_model = function(){
        // $('#my_modal1').slideUp(700);
        $('#my_modal1').toggle("slide");
    }
    $scope.open_model = function(){
        $('#my_modal1').toggle("slide");
    }

    //end of the set of functions
  });
