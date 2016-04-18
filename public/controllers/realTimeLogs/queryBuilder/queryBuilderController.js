var app = angular.module('logAggregator');
var kk=0;
var str2="";
var addConditionCount=0;
app.controller('liveQueryController', ['$scope','$http', function ($scope,$http) {


    var data = '{"group": {"operator": "OR","rules": []}}';
    $scope.flag=false;

    function htmlEntities(str) {
        return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }
    function computed(group) {
        if (!group) return "";
        for (var str = "(", i = 0; i < group.rules.length; i++) {
//            console.log("aaaaa")
            //          console.log($scope.select1);
//            console.log("len----"+ group.rules.length);

            console.log(group.rules[i]);
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

        }

        return " Select  "+$scope.select1 + " from " +$scope.stream + " where "+ str + ")";

    }


    function computeJson(group){
        if(!group) return "";


    //    str2="{from: {stream: "+$scope.stream+",where: {server-name: {$regex: \"/$server.*/\" }}},select:[";
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

        console.log(stringA);

        str2=str2+stringA+str3;
        var operator;

        for ( i = 0; i < group.rules.length; i++) {
            console.log("aaaaa")
            console.log($scope.select1);
            console.log("len----"+ group.rules.length);
            console.log("STR----"+i+"-----"+str2);
            i > 0 && (str2 += ",");
            kk++;

            str2 += group.rules[i].group ?
                computeJson(group.rules[i].group) :
            "\"val"+(i+1)+"\" : { \"rolling\" : { \"evaluate\" :\""+group.rules[i].field+"\", \"over\" : { \""+group.rules[i].accumulator+"\": "+group.rules[i].value+"},\"on\":\""+group.rules[i].data+"\"}}";
            operator=group.operator;

            //if(kk>0)
            //{
            //    str += group.rules[i].group ?
            //        computed(group.rulews[i].group) :
            //
            //}

        }


        var str6="},\"project\": { \"$highlight\": {\"$condition\":\"val1 "+operator+" val2\"}},\"to\": \""+$scope.streamB+"\"}";
        str2=str2+str6;
        return str2;

    }

    $scope.json = null;

    $scope.filter = JSON.parse(data);

    $scope.$watch('filter', function (newValue) {
        $scope.json = JSON.stringify(newValue, null, 2);
        $scope.output = computed(newValue.group);
        $scope.jsonOutput=computeJson(newValue.group);
    }, true);
}]);

//var queryBuilder = angular.module('queryBuilder', []);
    app.directive('queryBuilder', ['$compile','$http', function ($compile,$http) {
    return {
        restrict: 'E',
        scope: {
            group: '='
        },
        templateUrl: '/queryBuilderDirective.html',
        compile: function (element, attrs) {
            var content, directive;
            content = element.contents().remove();
            return function (scope, element, attrs) {
                scope.operators = [
                    { name: '==' },
                    { name: '<>' },
                    { name: '<' },
                    { name: '<=' },
                    { name: '>' },
                    { name: '>=' }
                ];

                scope.fields = [
                    { name: 'average' },
                    { name: 'standard deviation' },
                    { name: 'count' },
                    { name: 'mean' },
                    { name: 'max' }
                ];

                scope.accumulators = [
                    { name: 'count' },
                    { name: 'time' }

                ];

                scope.conditions = [
                    { name: '=' },
                    { name: '<>' },
                    { name: '<' },
                    { name: '<=' },
                    { name: '>' },
                    { name: '>=' }
                ];

                scope.addCondition = function () {

                    addConditionCount++;
                    if(addConditionCount>2)
                    {
                        $scope.flag=true;

                    }
                    scope.group.rules.push({
                        condition: 'of',
                        field: 'average',
                        data: '',
                        accumulator:'',
                        value:''
                    });
                };

                scope.removeCondition = function (index) {
                    if(addConditionCount>1){
                    addConditionCount=2
                    }
                    addConditionCount--;
                    scope.group.rules.splice(index, 1);
                };

                scope.addGroup = function () {
                    scope.group.rules.push({
                        group: {
                            operator: 'AND',
                            rules: []
                        }
                    });
                };

                scope.removeGroup = function () {
                    "group" in scope.$parent && scope.$parent.group.rules.splice(scope.$parent.$index, 1);
                };

                scope.submitQuery = function () {
                    query=JSON.parse(str2);
                    // query=str2;
                    // console.log("Answer String")
                    // console.log(str2);
                    // $scope.answer=str2;
                    $http({method: 'Post', url: '/exp/save',data:{data:query}}).
                    success(function(data, status, headers, config) {
                        console.log("Successful");
                        console.log(data);
                    });
                };


                  scope.dimensionList = [];
                  scope.measureList = [];

                scope.getDimension = function () {
                    $http({method: 'GET', url: '/dimensions'}).
                    then(function(response) {
                        var dimArr = response.data;
                    console.log("array",dimArr);
                    if (dimArr.length > 0) {
                      for (var i = 0; i < dimArr.length; i++) {
                        //console.log("inside loop", dimArr[i].dispName);
                        scope.dimensionList.push(dimArr[i].displayName);
                      }
                    }
                    });

                };


                scope.getMeasure = function () {
                    $http({method: 'GET', url: '/measures'}).
                    then(function(response) {
                        var measArr = response.data;
                    console.log("array",measArr);
                    if (measArr.length > 0) {
                      for (var i = 0; i < measArr.length; i++) {
                        //console.log("inside loop", dimArr[i].dispName);
                        scope.measureList.push(measArr[i].displayName);
                      }
                    }
                    });

                };








                directive || (directive = $compile(content));

                element.append(directive(scope, function ($compile) {
                    return $compile;
                }));
            }
        }
    }
}]);
