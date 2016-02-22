var app = angular.module('logAggregator');
var dashBoardJson = [];
var obj={};
app.controller('myController', function($scope, $http) {

    // $scope.show_pie = function(){
    //   $('#graph').addClass('hidden');
    //   $('#graph1').removeClass('hidden');
    // }
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
    console.log("we are in plot_top_repos function");
    console.log($scope.selectedRepoDataDisplay);
    console.log($scope.selectedUserDataDisplay);
    $scope.clear_repo();
    $scope.clear_user();
    $scope.clear_year();
    $scope.clear_month();
    console.log(event.target.getAttribute('data-json'));
    data_json = event.target.getAttribute('data-json');
    console.log("From plot graph function",dashBoardJson);
    for(var m=0;m<dashBoardJson.length;m++){
      if(data_json == dashBoardJson[m]["graph-type"])
      {
        obj = dashBoardJson[m];
        break;
      }
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
  }
  //end of the function

  //function to set the filter values depending on the selection
        $scope.plotthedata= function() {
        $scope.close_model();

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
                    console.log("plotgraph"+data);
                    if(obj["secondaryGroupByField"]!==""){
                      console.log(obj["secondaryGroupByField"]["values"]);
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

        $scope.fetchedMonthDataDisplay=[0,1,2,3,4,5,6,7,8,9,10,11];  //adding values to the months filter

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
                                    if(dashBoardJson[i]["secondaryGroupByField"]!==""){
                                      multidimensional[j]=dashBoardJson[i]["graph-type"];
                                      j++;
                                    }else{
                                      singledimensional[k]=dashBoardJson[i]["graph-type"];
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
      $scope.selectedMonthDataDisplay = "";
    }
    $scope.close_model = function(){
        // $('#my_modal1').slideUp(700);
        $('#my_modal1').toggle("slide");
    }
    $scope.open_model = function(){
        $('#my_modal1').toggle("slide");
    }

    //enf of the set of functions
  });
