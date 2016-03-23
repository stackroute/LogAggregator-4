var fs = require('fs');



var rollingTimeWindow = require('./rollingTime.js');
//Creating a new instance
var timeWindow1 = new rollingTimeWindow(20);
var timeWindow2 = new rollingTimeWindow(20);
var timeWindow3 = new rollingTimeWindow(20);
var timeWindow4 = new rollingTimeWindow(20);
var timeWindow5 = new rollingTimeWindow(20);
for (var i = 0; i < 100000000; i++) {
  var str='0';
  str+=i;
  console.log("avg ** "+timeWindow1.avg(str));
  console.log("min ** "+timeWindow2.min(str));
  console.log("max ** "+timeWindow3.max(str));
  console.log("sum ** "+timeWindow4.sum(str));      
}
