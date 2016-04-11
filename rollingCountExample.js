var fs = require('fs');



var rollingTimeWindow = require('./rollingTime.js');
//Creating a new instance
var timeWindow = new rollingTimeWindow(20);
for (var i = 0; i < 100000000; i++) {
  var str='0';
  str+=i;
  console.log(timeWindow.avg(str));
}
