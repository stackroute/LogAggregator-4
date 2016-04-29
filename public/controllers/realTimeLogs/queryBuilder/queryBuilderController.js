var app = angular.module('logAggregator');
var kk=0;
var str2="";
var pid ;
var addConditionCount=0;
app.controller('liveQueryController', ['$scope','$http', '$compile','$sce',function ($scope,$http,$compile,$sce) {


    var dimensionMap= new Map();
    var measureMap = new Map();
    var visitedMap= new Map();
    $scope.iter=1;
    $scope.iter2=1;




    var data = '{"group": {"operator": "OR","rules": []}}';
    $scope.flag=false;

    $scope.aggfn = ["average", "count", "max","min","sum"];
    $scope.accumfn = ["time", "count"];
    $scope.operators = [">", "<", "==",">=","=<"];
    //$scope.operators = [">", "<", "==",">=","=<"];


//    console.log($scope.selectedAccumFn2);



    function htmlEntities(str) {
        return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');

    }




    $scope.submitQuery = function () {



  //      console.log("pid----------------------->>>>>>>>>>>"+pid);

        $http({method: 'Post', url: '/exp/stream',data:{data:pid}}).
        success(function(data, status, headers, config) {
            console.log("Successful");
            console.log(data);
        });
        query=JSON.parse(str2);
        // query=str2;
        // console.log("Answer String")
        console.log(str2);
        // $scope.answer=str2;
        $http({method: 'Post', url: '/exp/save',data:{data:query}}).
        success(function(data, status, headers, config) {
            console.log("Successful");
            console.log(data);
        });

        window.location="#rtWizard";


    };




    function computed(group) {
        if (!group) return "";
        for (var str = "(", i = 0; i < group.rules.length; i++) {
//            console.log("aaaaa")
            //          console.log($scope.select1);
//            console.log("len----"+ group.rules.length);

    //        console.log(group.rules[i]);
            i > 0 && (str += " <strong>"+group.operator+"</strong> ");
            kk++;

            str += group.rules[i].group ?
                computed(group.rules[i].group) :
            group.rules[i].field + " " + htmlEntities(group.rules[i].condition) + " " + group.rules[i].data + "  Over  " + group.rules[i].accumulator +"   " +group.rules[i].value ;

            //if(kk>0)
            //{
            //    str += group.rules[i].group ?
            //        computed(group.rules[i].group) :
            //
            //}
            return "asddddddddddddddddddd";

        }

        return " Select  "+$scope.select1 + " from " +$scope.stream + " where "+ str + ")";

    }





     $scope.computeJson=function (){


         str2="{\"select\":[";
         var str3="],\"eval\": {";

         var strng=$scope.select1;

         var dummy="";
         var stringA="";
         var count=0;
         var cn=0;
         for(var j=0;j<strng.length;j++)
         {

             if(strng[j]==",") {

                 count++;
             }

         }

         for(var j=0;j<strng.length;j++)
         {

             if(strng[j]!=",")
             {
                 dummy=dummy+strng[j];
             }
             else {
                 if(cn<count) {
                     stringA = stringA + "\"" + dummy + "\",";
                     cn++;
                     dummy="";
                 }


             }

         }


         stringA = stringA + "\"" + dummy + "\"";



         str2=str2+stringA+str3;

         str2=str2+"\"val1\": {\"rolling\": {\"evaluate\":\""+$scope.selectedAggFn1+"\",\"over\": {\""+$scope.selectedAccumFn1+"\":"+$scope.value1+"},\"on\":\""
             +$scope.measure1+"\"}},\"val2\": {\"rolling\": {\"evaluate\":\""+$scope.selectedAggFn2+"\",\"over\": {\""+$scope.selectedAccumFn2+"\":"+$scope.value2
             +"},\"on\":\"" +$scope.measure2+"\"}}},\"project\": {\"$highlight\": {\"$condition\": \"val1 "+$scope.selectedOperators +" val2\"}},\"to\": \"a\"}";
      //   console.log(str2);


        $scope.display=str2;
         $scope.trustedHtml=$sce.trustAsHtml($scope.display);
        // console.log("------"+str2);
        return str2;

    }
    var dimArr;




    $scope.getRows = function () {




         dimensionMap.clear();
         measureMap.clear();
         visitedMap.clear();
        console.log("sssssssssssssssssssssssssssssss");

        $http({method: 'GET', url: '/logdata/namespaceList'}).
        then(function(response) {
            console.log("respose--------------------------");
            //console.log(response.data);
            //console.log("resposeData--------------------------");


            dimArr = response.data;
            var dimArrLength=dimArr.length;
            //console.log("length-----------"+dimArrLength);
            //console.log("array",dimArr);
            $scope.nameSpaceList=[];

            if (dimArr.length > 0) {
                for (var i = 0; i < dimArr.length; i++) {
                    console.log("inside loop"+ dimArr[i].dispName);
                    var newObj=dimArr[i];
              //      console.log("name-------------"+newObj);

                    $scope.nameSpaceList.push(newObj);
                    var objId=dimArr[i]._id;
                    var dimensionArr=dimArr[i].dimensions;
                    var measureArr=dimArr[i].measures;
                    dimensionMap.set(objId,dimensionArr);
                    measureMap.set(objId,measureArr);

                }
                console.log("jajajajaja")
                //console.log($scope.nameSpaceList);
            }

        });

    }


    // ( function () {
    //     $http({method: 'GET', url: '/logdata/namespaceList'}).
    //     then(function(response) {
    //         console.log("respose--------------------------");
    //         console.log(response.data);
    //         console.log("resposeData--------------------------");
    //
    //
    //         dimArr = response.data;
    //         var dimArrLength=dimArr.length;
    //         console.log("length-----------"+dimArrLength);
    //         console.log("array",dimArr);
    //
    //         if (dimArr.length > 0) {
    //             for (var i = 0; i < dimArr.length; i++) {
    //                 //console.log("inside loop", dimArr[i].dispName);
    //                 var newObj=dimArr[i];
    //                 console.log("name-------------"+newObj);
    //
    //                 $scope.nameSpaceList.push(newObj);
    //                 var objId=dimArr[i]._id;
    //                 var dimensionArr=dimArr[i].dimensions;
    //                 var measureArr=dimArr[i].measures;
    //                 dimensionMap.set(objId,dimensionArr);
    //                 measureMap.set(objId,measureArr);
    //
    //             }
    //             console.log("jajajajaja")
    //             console.log($scope.nameSpaceList);
    //         }
    //
    //     });
    //
    // }());





    $scope.getDimensionAndMeasure=function (id) {



        console.log("qqqqqqqqqqqqqqqqqq")


            $scope.dimensionList=[];
            $scope.measureList=[];


            pid=id;
            var visitedValue=visitedMap.get(id);
        console.log("visited value -----"+visitedValue);

            if(visitedValue!=1)
            {

                visitedMap.set(id,1);
//                console.log("get dimension clicked. ID: " + id);

                var arrayDim = dimensionMap.get(id);
                console.log("Dimension Map");
                console.log(dimensionMap)
               console.log("array dim ---------------->>>>>>>>>>>>>>>>>>");
                console.log(arrayDim);
                var arrayMeas = measureMap.get(id);
                //console.log(measureMap)
                //console.log("hihihi");
                //console.log("array dim ka length ---------------------------->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>"+arrayDim.length);


                for (var j = 0; j < arrayDim.length; j++) {
                    $scope.dimensionList[j] = arrayDim[j].fieldName;

                }

                for (var j = 0; j < arrayMeas.length; j++) {
                    // $scope.dimensionList[j]=arrayDim[j].fieldName;
                    $scope.measureList[j] = arrayMeas[j].displayName;

                }


                //console.log("measure list");
                //console.log($scope.measureList);

                var btnhtml = '<li   class="styleforli">&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;a)&nbsp;Dimensions</li><ul  class="baskya">';
                var i = 0;
                for (i = 0; i < $scope.dimensionList.length; i++) {
                    btnhtml = btnhtml + "<li class='innerlicolor'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +$scope.iter2+".&nbsp;"+ $scope.dimensionList[i] + "</li>"
                    $scope.iter2++;
                }
                btnhtml = btnhtml + "</ul><li class ='styleforli' >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;b)&nbsp;Measures</li><ul class='baskya'>";
                // btnhtml = btnhtml + "</ul><li class ='styleforli' >&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Measures</li><ul class='baskya'>";

                var i = 0;
                for (i = 0; i < $scope.measureList.length; i++) {


                    btnhtml = btnhtml + "<li class='innerlicolor'>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +$scope.iter+".&nbsp;"+ $scope.measureList[i] + "</li>"
                    $scope.iter++;
                }
                btnhtml = btnhtml + "</ul>";

//                console.log(btnhtml);
                var temp = $compile(btnhtml)($scope);
                angular.element(document.getElementById(id)).append(temp);


            }



    }
    $scope.output2 = "sadasdadaasdasdsa";

    $scope.aggregatorList=["average", "mean", "max","standard deviation"];
    $scope.json = null;

    $scope.filter = JSON.parse(data);

    $scope.$watch('filter', function (newValue) {
        $scope.json = JSON.stringify(newValue, null, 2);
        $scope.output2 = "sadasdadaasdasdsa";
  //      console.log("output value"+$scope.output2);
        //$scope.jsonOutput=computeJson(newValue.group);
    }, true);
}]);
