var app = angular.module('logAggregator');
var kk=0;
app.controller('liveQueryController', ['$scope', function ($scope) {
    var data = '{"group": {"operator": "OR","rules": []}}';

    function htmlEntities(str) {
        return String(str).replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    function computed(group) {
        if (!group) return "";
        for (var str = "(", i = 0; i < group.rules.length; i++) {
            console.log("aaaaa")
            console.log($scope.select1);
            console.log("len----"+ group.rules.length);

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


       var str2="{from: {stream: "+$scope.stream+",where: {server-name: {$regex: '/$server.*/' }}},select: ['dimension1', 'dimension2','measure3','measure4'],eval: {"

        for ( i = 0; i < group.rules.length; i++) {
            console.log("aaaaa")
            console.log($scope.select1);
            console.log("len----"+ group.rules.length);
            console.log("STR----"+i+"-----"+str2);
            i > 0 && (str2 += ",");
            kk++;

            str2 += group.rules[i].group ?
                computeJson(group.rules[i].group) :
                "val"+i+": {$rolling: { evaluate:"+group.rules[i].field+",over: {"+group.rules[i].accumulator+": "+group.rules[i].value+"},on:"+group.rules[i].data+"}}";

            //if(kk>0)
            //{
            //    str += group.rules[i].group ?
            //        computed(group.rules[i].group) :
            //
            //}

        }


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
                    { name: 'AND' },
                    { name: 'OR' }
                ];

                scope.fields = [
                    { name: 'Average' },
                    { name: 'Standard Deviation' },
                    { name: 'Count' },
                    { name: 'Mean' },
                    { name: 'Max' }
                ];

                scope.accumulators = [
                    { name: 'Count' },
                    { name: 'Time' }

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
                    scope.group.rules.push({
                        condition: 'of',
                        field: 'Firstname',
                        data: '',
                        accumulator:'',
                        value:''
                    });
                };

                scope.removeCondition = function (index) {
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
                query="select * from somthing"
                $http({method: 'Post', url: '/exp/save',data:{data:query}}).
                success(function(data, status, headers, config) {
                console.log("Successful");
                console.log(data);
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
