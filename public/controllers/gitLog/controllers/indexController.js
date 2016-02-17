var app = angular.module('logAggregator');

app.controller('myController', function($scope, $http) {
    $scope.toggle_list = function(){
      //$scope.listToggle = $scope.listToggle==true?false:true;
      // var bodyE = $('.left-nav-div'),
      //   navToggleBtn = bodyE.find('.nav-toggle-btn');
      //
      // navToggleBtn.on('click', function(e){
      //   bodyE.toggleClass('active-nav');
      //   e.preventDefault();
      // });
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
        if($scope.to_date === undefined && $scope.from_date === undefined){
          $scope.submit_yparam = y_axis_dim;
          $scope.submit_xparam = x_axis_dim;
          $scope.submit_type = type;
          $scope.submit_filterby = filter_by;
          $('#my_modal1').modal('show');
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
              $scope.filterbydata = filter_by;
              $scope.submit_yparam = y_axis_dim;
              $scope.submit_xparam = x_axis_dim;
              $scope.submit_type = type;
              $scope.submit_filterby = filter_by;
              fetchfilteringdata(obj);
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
      }
      else if(x_axis_dim != 'time' && filter_by !== null){


            if($scope.value === undefined || $scope.filterbydata!=filter_by)
            {
              var obj={
                  "filterby" : filter_by
              }
              $scope.filterbydata = filter_by;
              $scope.submit_yparam = y_axis_dim;
              $scope.submit_xparam = x_axis_dim;
              $scope.submit_type = type;
              $scope.submit_filterby = filter_by;
              fetchfilteringdata(obj);
            }
            else{
              console.log("we are in the filtered section");
              var fetch_data = $scope.value;
              var obj = {
                  "y_axis_dim": y_axis_dim,
                  "x_axis_dim": x_axis_dim,
                  "type": type,
                  "filterby" : filter_by,
                  "filterdata" : fetch_data
              }
              console.log(obj);
              plotthedata(obj);
            }
      }
      else{
        var obj = {
            "y_axis_dim": y_axis_dim,
            "x_axis_dim": x_axis_dim,
            "type": type
        }
        plotthedata(obj);
      }
    }


    var plotthedata = function(obj) {
        console.log("we are in the function");
        $('#my_modal1').modal('hide');
        console.log(obj);

            $http({method: 'Post', url: '/plotgraph', data:{data:obj}}).
                success(function(data, status, headers, config) {
                      console.log(data);
                      plotting_graph(data);
                });
    }

    var fetchfilteringdata = function(obj) {
        console.log("we are in the fetching function calling function");
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
                      $('#my_modal1').modal('show');
                });
    }
  });



function show_the_modal(){
  $('#my_modal1').modal('show');
}
