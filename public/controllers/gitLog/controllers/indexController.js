var app = angular.module('logAggregator');

app.controller('myController', function($scope, $http) {
    $scope.toggle_list = function(){
      //$scope.listToggle = $scope.listToggle==true?false:true;
      $('.left-nav-div').slideToggle();
    }

    $scope.plot_graph = function(){
      console.log("we are in plot_top_repos function");
      console.log(event.target.getAttribute('data-yparam'));
      console.log(event.target.getAttribute('data-xparam'));
      console.log(event.target.getAttribute('data-type'));
      var y_axis_dim = event.target.getAttribute('data-yparam');
      var x_axis_dim = event.target.getAttribute('data-xparam');
      var type = event.target.getAttribute('data-type');
      var filter_by = event.target.getAttribute('data-filterby');
      console.log("FilterBy" + filter_by);
      var to_date = $scope.to_date;
      var from_date = $scope.from_date;

      if(x_axis_dim == 'time' && (filter_by === null || filter_by ==="")){
        console.log('////////////////////////////////');
        if($scope.to_date === undefined && $scope.from_date === undefined){
          $scope.submit_yparam = y_axis_dim;
          $scope.submit_xparam = x_axis_dim;
          $scope.submit_type = type;
          $scope.submit_filterby = filter_by;
          $('#my_modal1').modal('show');
          // alert("Please select the date");
          return;
        }

        var to_year = to_date.getFullYear();
        var to_month= to_date.getMonth();
        var from_year = from_date.getFullYear();
        var from_month = from_date.getMonth();
        var obj = {
            "y_axis_dim": y_axis_dim,
            "x_axis_dim": x_axis_dim,
            "type": type,
            "from_date" : from_date,
            "to_date" : to_date,
            "from_year" : from_year,
            "from_month" : from_month,
            "to_year":  to_year,
            "to_month" : to_month
        }
        plotthedata(obj);
      }
      else if(x_axis_dim == 'time' && filter_by !== null){


            if($scope.value === undefined || $scope.filterbydata!=filter_by)
            {
              var obj={
                  "filterby" : filter_by
              }
              //console.log("Value"+$scope.value.length);
              $scope.filterbydata = filter_by;
              $scope.submit_yparam = y_axis_dim;
              $scope.submit_xparam = x_axis_dim;
              $scope.submit_type = type;
              $scope.submit_filterby = filter_by;
              fetchfilteringdata(obj);
              //console.log(fetched_data);
            }
            else{
              console.log("we are in the filtered section");
              $('#my_modal1').modal('show');
              if($scope.to_date === undefined && $scope.from_date === undefined){
                alert("Please select the date range");
                return;
              }
              var fetch_data = $scope.value;
              var obj = {
                  "y_axis_dim": y_axis_dim,
                  "x_axis_dim": x_axis_dim,
                  "type": type,
                  "from_date" : from_date,
                  "to_date" : to_date,
                  "from_year" : from_year,
                  "from_month" : from_month,
                  "to_year":  to_year,
                  "to_month" : to_month,
                  "filterby" : filter_by,
                  "filterdata" : fetch_data
              }
              console.log(obj);
              plotthedata(obj);
            }


            //return;
      }
      else if(x_axis_dim != 'time' && filter_by !== null){


            if($scope.value === undefined || $scope.filterbydata!=filter_by)
            {
              var obj={
                  "filterby" : filter_by
              }
              //console.log("Value"+$scope.value.length);
              $scope.filterbydata = filter_by;
              $scope.submit_yparam = y_axis_dim;
              $scope.submit_xparam = x_axis_dim;
              $scope.submit_type = type;
              $scope.submit_filterby = filter_by;
              fetchfilteringdata(obj);
              //console.log(fetched_data);
            }
            else{
              console.log("we are in the filtered section");
              // if($scope.to_date === undefined && $scope.from_date === undefined){
              //   alert("Please select the date range");
              //   return;
              // }
              var fetch_data = $scope.value;
              var obj = {
                  "y_axis_dim": y_axis_dim,
                  "x_axis_dim": x_axis_dim,
                  "type": type,
                  // "from_date" : from_date,
                  // "to_date" : to_date,
                  // "from_year" : from_year,
                  // "from_month" : from_month,
                  // "to_year":  to_year,
                  // "to_month" : to_month,
                  "filterby" : filter_by,
                  "filterdata" : fetch_data
              }
              console.log(obj);
              plotthedata(obj);
            }


            //return;
      }
      else{
        var obj = {
            "y_axis_dim": y_axis_dim,
            "x_axis_dim": x_axis_dim,
            "type": type
        }
        plotthedata(obj);
      }
      //console.log(obj);
    }


    var plotthedata = function(obj) {
        console.log("we are in the function");
        $('#my_modal1').modal('hide');
        //var json= JSON.parse(obj);
        console.log(obj);

            $http({method: 'Post', url: '/plotgraph', data:{data:obj}}).
                success(function(data, status, headers, config) {
                      console.log(data);
                      plotting_graph(data);
                });
    }

    var fetchfilteringdata = function(obj) {
        console.log("we are in the fetching function calling function");

        //var json= JSON.parse(obj);
        console.log(obj);

            $http({method: 'Post', url: '/getFilterData', data:{data:obj}}).
                success(function(data, status, headers, config) {
                      console.log(data);
                      var display_data=[];
                      for(var i=0; i<data.length;i++){
                        display_data[i]=data[i]["_id"];
                      }
                      $scope.fetchedDataDisplay=display_data;
                      console.log($scope.fetchedDataDisplay);
                      //$scope.showModal = false;
                      //show_the_modal();
                      $('#my_modal1').modal('show');
                      //return data;
                      //plotting_graph(data);
                });
    }


  });



function show_the_modal(){
  $('#my_modal1').modal('show');
}

























          //  for(var i=0;i<data.length;i++){
          //    key_data[i] = [];
          //    filter_data[i] = [];
          //    for(var j=0;j<data[i].length;j++){
          //      console.log(data[i][j]["_id"]);
          //      for(key in data[i][j]["_id"]){
          //        console.log(key + " " + data[i][j]["_id"][key]);
          //        key_data[i].push(key);
          //        filter_data[i].push(data[i][j]["_id"][key]);
          //        // for(key1 in data[i][j]["_id"][0]){
          //        //   console.log(data[i][j]["_id"][0][key1]);
          //        // }
          //      }
          //    }
          //  }
          //  //console.log(filter_data);
          //  //console.log(key_data);
           //
          //  for(var i=0;i<key_data.length;i++){
          //    console.log(key_data[i]);
          //    $scope.keys_filter= key_data[i];
          //    for(var j=0;j<filter_data[i].length;j++){
          //        console.log(filter_data[i][j]);
          //        $scope.data_filter = filter_data[i][j];
          //    }
          //  }





//   $scope.getFilterData = function(){
//     console.log("we are calling this function");
//     var str = $scope.json;
//     //var str_new = angular.toJson(str);
//     var str_new = JSON.parse(str);
//     var filter_data = [];
//     var key_data = [];
//     console.log(str_new);
//     // $http({url:"/getFilterData",'data':str,'method':'POST',headers: {'Content-Type':'text/plain'}}).then(function(data){
//     //   console.log("we recieved the data from server");
//     //   console.log(data);
//     // }, function(err){
//     //   console.log("we are having issues in retrieving the data from server");
//     //   console.log(err);
//     // });
//     // var config= {headers: {'Content-Type':'text/plain'}};
//     // $http.post("/getFilterData",str,config).then(function(data){
//     //   console.log("we recieved the data from server");
//     //   console.log(data);
//     // }, function(err){
//     //   console.log("we are having issues in retrieving the data from server");
//     //   console.log(err);
//     // });
//
//     $http({method: 'Post', url: '/getFilterData', data:{data:str_new}}).
//     success(function(data, status, headers, config) {
//         //console.log(data);
//         for(var i=0;i<data.length;i++){
//           key_data[i] = [];
//           filter_data[i] = [];
//           for(var j=0;j<data[i].length;j++){
//             console.log(data[i][j]["_id"]);
//             for(key in data[i][j]["_id"]){
//               console.log(key + " " + data[i][j]["_id"][key]);
//               key_data[i].push(key);
//               filter_data[i].push(data[i][j]["_id"][key]);
//               // for(key1 in data[i][j]["_id"][0]){
//               //   console.log(data[i][j]["_id"][0][key1]);
//               // }
//             }
//           }
//         }
//         //console.log(filter_data);
//         //console.log(key_data);
//
//         for(var i=0;i<key_data.length;i++){
//           console.log(key_data[i]);
//           $scope.keys_filter= key_data[i];
//           for(var j=0;j<filter_data[i].length;j++){
//               console.log(filter_data[i][j]);
//               $scope.data_filter = filter_data[i][j];
//           }
//         }
//
//
//     });
//     // console.log(JSON.stringify(str));
//     // console.log(JSON.parse(str));
//   }
// });
// }
