var app = angular.module('logAggregator');
var dashBoardJson = [];
var obj={};
var flag=0;
app.controller('wizardController',function($scope,$http){
  $scope.tempArr = [{val:'one'},{val:"two"}];
  $scope.dimArray = 0;
  $scope.dashBoardObj = {};
  $scope.dashBoardObj.dashBoardName = "";
  $scope.dashBoardObj.secondaryGroupByArr= [];
  $scope.dashBoardObj.rowArray = [];
  $scope.dashBoardObj.measureArray = [];
  $scope.dashBoardObj.aggregatorArray= [];
  $scope.dashBoardObj.filtersArr = [];
  $scope.deleteTheChoice = function(choiceIndex,choiceType) {
    $scope.dashBoardObj[choiceType].splice(choiceIndex,1);
    if($scope.dashBoardObj.rowArray.length ==0){

      $scope.dashBoardObj.secondaryGroupByArr= [];
      $scope.dashBoardObj.measureArray = [];
      $scope.dashBoardObj.aggregatorArray= [];
      $scope.dashBoardObj.filtersArr = [];
    }

  }
  // $scope.dashBoardName;
  $scope.makeId = function(idStr){
    return idStr.replace('.','')+"Id";
  }
  // $scope.dashBoardName = 'An awsesome Dashboard;
  $scope.makeIdWithHref = function(idStr){
    return '#'+idStr.replace('.','')+"Id";
  }

  $scope.createAndDumpWidget = function(){
    $scope.submitted = true;

    var dashBoardMade = {
       "name": $scope.dashBoardObj.dashBoardName,
      "row":{},
      "measure":{},
      "columns":[],
      "filters":[]
    };
    dashBoardMade.row.name = $scope.dashBoardObj.rowArray["0"].name;
    //For row

    if($scope.dashBoardObj.rowArray[0].values === undefined){
      console.log("First row element",$scope.dashBoardObj.rowArray[0]);
        dashBoardMade.row.displayName = $scope.dashBoardObj.rowArray[0].categoryDisplayName;
        // dashBoardMade.row.name = $scope.rowValues[0].name;
        // dashBoardMade.row.displayName = $scope.rowValues[0].displayName;
        dashBoardMade.row.values = [];
        $scope.dashBoardObj.rowArray.map(function(selectedRows){
          dashBoardMade.row.values.push(selectedRows.value);
        });
    }
    else{
      console.log("groupby field has been selected!!");
      dashBoardMade.row.displayName = $scope.dashBoardObj.rowArray[0].displayName;
      //groupby field has been selected
      if($scope.dashBoardObj.aggregatorArray.length !==0 ){
        //aggregators have been provided
        dashBoardMade.row.aggregators = {};
        dashBoardMade.row.aggregators.displayName = $scope.dashBoardObj.aggregatorArray[0].displayName
        dashBoardMade.row.aggregators.argument = 10;
      }
      else{
        dashBoardMade.row.aggregators = {
          "name": "all",
          "argument": 0
        };
      }
    }
      //Measure code
      dashBoardMade.measure.primary = $scope.dashBoardObj.measureArray[0];
      console.log("measure length", $scope.dashBoardObj.measureArray.length);
      var tempIndex = 1;
      for(;tempIndex<$scope.dashBoardObj.measureArray.length;tempIndex++){
        console.log("Inside measureArray loop");
        if(tempIndex === 1){
          console.log("secondary initial");
          dashBoardMade.measure.secondary = [];
        }
        dashBoardMade.measure.secondary.push($scope.dashBoardObj.measureArray[tempIndex]);
      }
      //Secondary grouby element code
      var tempSecondaryObjSet = {};
      $scope.dashBoardObj.secondaryGroupByArr.map(function(secondaryGroupByElement){

        var tempSecondaryObj2 = {};
        if(secondaryGroupByElement.values == undefined){
          //instance
          if (tempSecondaryObjSet[secondaryGroupByElement.name] === undefined){
            tempSecondaryObjSet[secondaryGroupByElement.name] = {"name":secondaryGroupByElement.name, "displayName": secondaryGroupByElement.categoryDisplayName};
            tempSecondaryObjSet[secondaryGroupByElement.name]["values"] = [secondaryGroupByElement.value];
          }
          else{
            tempSecondaryObjSet[secondaryGroupByElement.name]["values"].push(secondaryGroupByElement.value);
          }
          //   tempSecondaryObj.name = secondaryGroupByElement.name;
          // tempSecondaryObj.displayName = secondaryGroupByElement.categoryDisplayName;

        }
        else {

          tempSecondaryObj2.name = secondaryGroupByElement.name;
          tempSecondaryObj2.displayName = secondaryGroupByElement.displayName;
          tempSecondaryObj2.values = [];
          secondaryGroupByElement.values.map(function(secondaryGroupByElementValue){
            tempSecondaryObj2.values.push(secondaryGroupByElementValue.value);
          });
          dashBoardMade.columns.push(tempSecondaryObj2);
          //groupby field
        }
      });
      for(tempSecGroupbyField in tempSecondaryObjSet){
        dashBoardMade.columns.push(tempSecondaryObjSet[tempSecGroupbyField]);
      }
      //Filters implimentation
      var tempFiltersSet = {};
      $scope.dashBoardObj.filtersArr.map(function(filterElement){
        if(tempFiltersSet[filterElement.name] === undefined){
          //empty
          tempFiltersSet[filterElement.name] = {"name": filterElement.name,"displayName": filterElement.categoryDisplayName};
          tempFiltersSet[filterElement.name].values  = [filterElement.value];
        }
        else {
          tempFiltersSet[filterElement.name].values.push(filterElement.value);
        }
      });
      console.log("tempfilterset===================?>"+tempFiltersSet);
      for(tempFilterFieldName in tempFiltersSet){
        dashBoardMade.filters.push(tempFiltersSet[tempFilterFieldName]);
      }


    console.log("Dashboard Object", dashBoardMade);
    $scope.saveDash(dashBoardMade);
    //saving code will go here

    $scope.dashBoardObj = {};
    $scope.dashBoardObj.dashBoardName = "";
    $scope.dashBoardObj.secondaryGroupByArr= [];
    $scope.dashBoardObj.rowArray = [];
    $scope.dashBoardObj.measureArray = [];
    $scope.dashBoardObj.aggregatorArray= [];
    $scope.dashBoardObj.filtersArr = [];

  };
  $scope.allowedTypes = {};

  $scope.allowedTypes.primaryFieldType = ['rowValues'];
  $scope.allowedTypes.measureType = ['Measure'];
  $scope.allowedTypes.aggregatorType = ["Aggregator"];

  //save the dashboard from the data
  $scope.saveDash = function(dashboard){
    console.log("we are function to save the dash board");
    $http({method: 'Post', url: '/getDashBoardJson/saveDash',data:{data:dashboard}}).
            success(function(data, status, headers, config) {
          console.log("Successful");
          console.log("successful",data);
          });
  };
  $scope.maintainSingleRow = function(dimension,indexOfDimension){
    $scope.dashBoardObj.rowArray = [];
    $scope.dashBoardObj.rowArray.push(dimension);
  };
  $scope.aggregatorHandler = function(arrayNameAndIndex, event,item){
    var arrayName = arrayNameAndIndex.arrayName;
    var index = arrayNameAndIndex.index;
    console.log("aggregatorHandler");
    console.log(item);
    if(item["noOfArguments"] != undefined ) {
      $scope.dashBoardObj.aggregatorArray= [];
      $scope.dashBoardObj.aggregatorArray.push(item);
    }
    else{
        if(item.name == $scope.dashBoardObj.rowArray[0].name)
         $scope.removeDuplicate(arrayNameAndIndex, event);
        else {
          var i =0;
          for(i=0;i<$scope.dashBoardObj[arrayName].length-1;i++){
            if ($scope.dashBoardObj[arrayName][i].name == item.name){
              $scope.dashBoardObj[arrayName][i].splice(i,1);
              break;
            }
          }
        }
    }
  }
  $scope.fixTheFilters = function(item) {

    console.log("Inside filx the filters");
    console.log("item", item);
    if (item.values == undefined){
      console.log("Item is an instance");
      var filterIndex = 0;
      var filterFound  = false;
      for(;filterIndex<$scope.dashBoardObj.filtersArr.length ;filterIndex++){
        console.log($scope.dashBoardObj.filtersArr[filterIndex]);

        if((item.name == $scope.dashBoardObj.filtersArr[filterIndex].name) && (item.value == $scope.dashBoardObj.filtersArr[filterIndex].value ))
          {
            console.log("Duplicate found");
            filterFound = true;
            break;
          }
      }
      if (filterFound == false){
        console.log("dup0licate not found");
        $scope.dashBoardObj.filtersArr.push(item);
      }
    }
  }
  $scope.fixTheSecondaryGroupby = function (item) {
    if($scope.dashBoardObj.rowArray[0].name != item.name){
      if($scope.dashBoardObj.secondaryGroupByArr.length>0){
        var secIndex = 0;
        // var noDup = true;
        if(item.values != undefined){
          //item is a groupby field
          for(;secIndex<$scope.dashBoardObj.secondaryGroupByArr.length;secIndex++){
              var secElement = $scope.dashBoardObj.secondaryGroupByArr[secIndex];
              if(secElement.values != undefined){
                if(secElement.name==item.name)
                  return false;
              }
              else{
                if(secElement.name == item.name) {
                  $scope.dashBoardObj.secondaryGroupByArr.splice(secIndex,1);
                  secIndex--;
                }
              }
          }

        }
        else{
          for(;secIndex<$scope.dashBoardObj.secondaryGroupByArr.length;secIndex++){
              var secElement = $scope.dashBoardObj.secondaryGroupByArr[secIndex];
              if(secElement.values == undefined){
                if(secElement.value==item.value && secElement.name==item.name)
                  return false;
              }
              else {
                if(secElement.name == item.name){
                  $scope.dashBoardObj.secondaryGroupByArr.splice(secIndex,1);
                  break;
                }
              }
          }

        }
        return item;

      }
      else {
        $scope.dashBoardObj.secondaryGroupByArr = [item];
      }
    }

  }
  $scope.fixThePrimaryGroupby = function(item){
    // $scope.dashBoardObj.rowArray.
    console.log("fixThePrimaryGroupby-----------");
    console.log("item",item);
    console.log($scope.dashBoardObj.rowArray);
    console.log(Object.keys($scope.dashBoardObj.rowArray));
    console.log("typeof ",typeof $scope.dashBoardObj.rowArray);
    var noOfPrimaryFields = Object.keys($scope.dashBoardObj.rowArray).length;
    if(noOfPrimaryFields>0){
      console.log("When lenght is more");

      if(item.values == undefined){
        console.log("The item is an instance");
        var instanceCounter = 0;
        var instanceIndex;
        var groupbyFieldIndex;
        var typeMatchCount = 0;
        for(primaryIndex in $scope.dashBoardObj.rowArray){
            if($scope.dashBoardObj.rowArray[primaryIndex].values == undefined ){
              instanceIndex = primaryIndex;
              instanceCounter++;
              if($scope.dashBoardObj.rowArray[primaryIndex].name == item.name)
                typeMatchCount++;
            }
            else{
              groupbyFieldIndex = primaryIndex;
            }
        }
        console.log("indexes"+instanceIndex);
        console.log("indexes"+groupbyFieldIndex);
        console.log("indexes"+typeMatchCount);
        console.log();
        if($scope.dashBoardObj.rowArray[0].values != undefined){
          console.log("All existing are not instances");
          //All existing are not instances
          $scope.dashBoardObj.rowArray = [];
          return item;
        }
        else {
          console.log("All existing are  instances");
          //All existing are not instances
          if(typeMatchCount != instanceCounter){
            console.log("type is different");
             $scope.dashBoardObj.rowArray = [];
             return item;

          }
          else{
            $scope.dashBoardObj.rowArray.push(item);
            $scope.removeDuplicate({"arrayName":"rowArray", "fieldToMatch":"value"});
          }

        }
      }
      else{
        console.log('Item is a grouby field');

        $scope.dashBoardObj.rowArray = [];
        return item;
      }
    }
    else {
      console.log("First elemt-------");
      return item;
    }
  }

  // $scope.maintainReferToRow = function(arrayNameAndIndex, event, item){
  //   console.log("Inside maintainReferToRow");
  //   if($scope.dashBoardObj.rowArray.length ==0){
  //     $scope.dashBoardObj.secondary= [];
  //   }else {
  //
  //     console.log("Inside else");
  //     console.log(item);
  //     console.log($scope.dashBoardObj.rowArray[0]);
  //     if(item.value != $scope.dashBoardObj.rowArray[0].value ){
  //         $scope.logEvent(arrayNameAndIndex, event)
  //     }
  //   }
    // console.log($scope.dashBoardObj.rowArray.length);
    // console.log($scope.dashBoardObj.rowArray[0].value);
    // console.log(item.value);
    // if($scope.dashBoardObj.rowArray.length ==0 || item.value != $scope.dashBoardObj.rowArray[0].value)
    //   return false;
    // return true;

  // }

  $scope.removeDuplicate = function(arrayNameAndIndex){
    console.log("Remove duplicates");
    var arrayName = arrayNameAndIndex.arrayName;
    // var index = arrayNameAndIndex.index;
    var fieldToMatch = arrayNameAndIndex.fieldToMatch;
    console.log("removeDuplicate");
    console.log(arrayName);
    // console.log(index);
    var i = 0;
    $scope.dashBoardObj[arrayName].map(function(dashElementHash, dashElementArrayIndex){
      console.log("Inside dup map");
      console.log(dashElementHash.value);
      console.log(dashElementArrayIndex);
      console.log("Going to enter the loop");
      for(i=0;i<$scope.dashBoardObj[arrayName].length;i++){
        console.log(i);
        console.log($scope.dashBoardObj[arrayName][i].value);
        if(dashElementHash[fieldToMatch] == $scope.dashBoardObj[arrayName][i][fieldToMatch] && dashElementArrayIndex != i) {
          console.log("Found Duplicate");
          $scope.dashBoardObj[arrayName].splice(dashElementArrayIndex,1);
          break;
        }
      }
    });
  }
  $scope.logEvent = function(arrayNameAndIndex, event,item) {
    console.log("Inside Log Event");
    var arrayName = arrayNameAndIndex.arrayName;
    var index = arrayNameAndIndex.index;
    if($scope.dashBoardObj.rowArray.length ==0){
      $scope.dashBoardObj.secondaryGroupByArr= [];

    }else {
      console.log("Inisde else");
        var rowElement = $scope.dashBoardObj.rowArray[0];
        console.log("item",item);
        console.log("rowElement",rowElement);
        if(item.name != rowElement.name){

          console.log("For duplicates");

            // $scope.dashBoardObj[arrayName].map(function(dashArray, dashArrayIndex){
              var i = 0;
              $scope.dashBoardObj[arrayName].map(function(dashElementHash, dashElementArrayIndex){
                console.log("Inside dup map");
                console.log(dashElementHash.value);
                console.log(dashElementArrayIndex);
                console.log("Going to enter the loop");
                for(i=0;i<$scope.dashBoardObj[arrayName].length;i++){
                  console.log(i);
                  console.log($scope.dashBoardObj[arrayName][i].value);
                  if(dashElementHash.value == $scope.dashBoardObj[arrayName][i].value && dashElementArrayIndex != i) {
                    console.log("Found Duplicate");
                    $scope.dashBoardObj[arrayName].splice(dashElementArrayIndex,1);
                    break;
                  }
                }
              });
            }
            else{
              for(i=0;i<$scope.dashBoardObj[arrayName].length;i++){
                if($scope.dashBoardObj[arrayName][i].name ==  item.name && $scope.dashBoardObj[arrayName][i].name ==  item.name ) {
                  $scope.dashBoardObj[arrayName].splice(i,1);
                  break;
                }
              }
            }
          }

  }
  $scope.models = {
        selected: null,
        lists: {"A": [], "B": []}
    };

  var dataForServer = "sda";
    $scope.$on('$viewContentLoaded', function() {
      $http({method: 'Post', url: '/newfilter'}).success(function(data, status, headers, config){
        //  if(data =="Not able to fetch data"){
        //    alert("no data avaliable");
        //  }
        //  else{
        //    console.log("dat==>",data);
        //    for(var i = 0; i < data.dimensions.length ; i++){
        //       if(data.dimensions[i].name === "commitMonth"){
        //           var allMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"];
         //
        //           data.dimensions[i].values = data.dimensions[i].values.sort(function(a,b){
        //               return allMonths.indexOf(a) > allMonths.indexOf(b);
        //           });
        //       }
        //       if(data.dimensions[i].name === "commitDay"){
        //           var allMonths = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday' , 'Sunday'];
         //
        //           data.dimensions[i].values = data.dimensions[i].values.sort(function(a,b){
        //               return allMonths.indexOf(a) > allMonths.indexOf(b);
        //           });
        //       }
        //       if(data.dimensions[i].name === "commitYear"){
         //
        //           data.dimensions[i].values = data.dimensions[i].values.sort(function(a,b){
        //               return allMonths.indexOf(a) > allMonths.indexOf(b);
        //           });
        //       }
        //     }
           $scope.gitDashboardConfigData = data;

             $scope.gitDashboardConfigData.dimensions.map(function(dimensionParam, dimIndex){
                   dimensionParam.values.map(function(dimValue,dimValueIndex) {
                     $scope.gitDashboardConfigData.dimensions[dimIndex].values[dimValueIndex] ={"value":dimValue, "_id":dimensionParam._id, "name":dimensionParam.name, "displayName": dimValue, "categoryDisplayName": $scope.gitDashboardConfigData.dimensions[dimIndex].displayName };
                   });
             });
         //}
      });
    });
});





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
      //flag=0;
      //$scope.open_model();
    console.log(event.target.getAttribute('data-json'));
    data_json = event.target.getAttribute('data-json');
    $scope.submit_json = data_json;

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
      }
    }
    console.log("dashboardJSON====>",obj);
    //console.log(obj["columns"]!==undefined && obj["columns"].length!==0);
    //if(obj["columns"]!==undefined && obj["columns"].length!==0){
    var dashboardbutton = event.target.getAttribute("data-dashbutton");
    console.log("dashboardJSON",dashboardbutton);
    if(dashboardbutton == "true"){
      getgitdata(obj);
    }
    else{
      flag=1;
      console.log("modal_windowopen",flag);
      $scope.open_model();
    }
    console.log("global_data",obj);
  }
  //end of the function

  //inserts the selected filter data into the obj filter section
  $scope.plotthedata= function() {
    console.log("plotthedata",flag);
    if(flag==1)
    {
        $scope.close_model();
        flag=0;
    }


    console.log("we are in plot the data function",obj);

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
      console.log("getgitdata",obj);
      $scope.graph_type_details=obj["name"];
      var column_details= "";
      var filter_details= "";
      if(obj.columns !== undefined && obj.columns.length !== 0){

        for(var i=0;i< obj.columns.length;i++){
          var graph_column_displayName = obj.columns[i].displayName + " ";
          var graph_column_value =" ";
          for(var j=0;j<((obj.columns[i].values.length>3)?3:obj.columns[i].values.length);j++){
             graph_column_value +=obj.columns[i].values[j] + ", ";
          }
          column_details+= graph_column_displayName+"["+graph_column_value+"]";
          console.log("column_details",column_details);
        }
        $scope.groupedby = " groupedby " + column_details;
        }
<<<<<<< HEAD
        else{
          $scope.groupedby = "";
        }
=======
>>>>>>> d44739083ddbc064be8db6dc69eaeb8b51da203b

        if(obj.filters !== undefined && obj.filters.length !== 0){

          for(var i=0;i< obj.filters.length;i++){
            var graph_filters_displayName = obj.filters[i].displayName + " ";
            var graph_filters_value =" ";
            for(var j=0;j<((obj.filters[i].values.length>=3)?3:obj.filters[i].values.length);j++){
               graph_filters_value +=obj.filters[i].values[j] + ", ";
            }
            filter_details += graph_filters_displayName+"["+graph_filters_value+"]";

            console.log("filter_details",filter_details);
          }
<<<<<<< HEAD
          $scope.filteredby = "and filtered by " + filter_details;
          }
          else{
            $scope.filteredby = "";
          }

          //column_details = "&" + column_details;
          if(obj["row"]["aggregators"]!==undefined){
            if(obj["row"]["aggregators"]["name"]==="all")
              $scope.description_data= "This graph shows "+ obj["row"]["aggregators"]["name"] + obj["measure"]["primary"]["displayName"] +" vs "+ obj["row"]["displayName"] ;
              else {
                $scope.description_data= "This graph shows "+ obj["row"]["aggregators"]["displayName"]+obj["row"]["aggregators"]["argument"] + obj["measure"]["primary"]["displayName"] +" vs "+ obj["row"]["displayName"] ;
              }
          }
          else{
              $scope.description_data= "This graph shows total" + obj["measure"]["primary"]["displayName"] +" vs "+ obj["row"]["displayName"] ;
          }



=======
          $scope.filteredby = " filteredBy " + filter_details;
          }

          //column_details = "&" + column_details;
          $scope.description_data= "This graph in plotted between " + obj["row"]["displayName"] + " and " + obj["measure"]["primary"]["displayName"];
>>>>>>> d44739083ddbc064be8db6dc69eaeb8b51da203b

       console.log("description_data",$scope.description_data);
      console.log("we are in getgit data function");

          $http({method: 'Post', url: '/plotgraph', data:{data:obj}}).
              success(function(data, status, headers, config) {
                  if(data.length==0){
                    alert("no data retrived");
                  }
                  else{
                    console.log("plotgraph",data);
                    if(data=="no data fetched"){
                      alert("no data retrieved");
                    }
                    else if(obj["columns"]!==undefined && obj["columns"].length !== 0){
                      console.log(obj["columns"][0]["values"]);
                      plotting_stacked_graph(data,obj);
                      plot_multibar_graph(data,obj);
                    }
                    else{
                      console.log("calling the plotting graph function");
                      plotting_graph(data,obj);
                      plot_pie_chart(data,obj)
                    }

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
              if(data=="Not able to fetch data")
              {
                console.log("no data fetched");
              }
              else{
                //console.log(data["dimensions"][0]["displayName"]);
                $scope.filtered_data=data["dimensions"];
                console.log("getFilterData1",$scope.filtered_data);
              }
              });

        $http({method: 'Post', url: '/getDashBoardJson'}).
            success(function(data, status, headers, config) {
                                //console.log(data);
            console.log("form getDashBoardJson");
                                  //console.log(data);
           if(data=="No dashboard saved")
           {
             console.log("please create new dashboards");
           }
           else{
             dashBoardJson = data;
             var multidimensional = [];
             var singledimensional =[];
             console.log("DashBorad",dashBoardJson);
             console.log(dashBoardJson.length);
             for(var i=0,j=0,k=0;i<dashBoardJson.length;i++){
             //if(dashBoardJson[i]["columns"]!==undefined && dashBoardJson[i]["columns"].length!==0){
             multidimensional[i]=dashBoardJson[i]["name"];
             //j++;
             //}else{
             //singledimensional[k]=dashBoardJson[i]["name"];
                          //  k++
                            //}
             }
             $scope.multigraphdashboard=multidimensional;
             //$scope.singlegraphdashboard = singledimensional;
             console.log("multidimension",$scope.multigraphdashboard);
             }
             });
             $http({method: 'Post', url: '/onPageLoadDashBoard'}).
                success(function(data, status, headers, config) {
                console.log("onpageload",data);
                if(data=="No dashboard saved")
                {
                  console.log("please create new dashboards");
                }
                else{
                    console.log("form onPageLoadDashBoard");
                    console.log(data);
                    getgitdata(data);
                }
                console.log(data);
                });
    });

    $scope.idMaker = function(id){
      return id.replace('.','');
    }
    //functions to select the selected content in different filter option
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
